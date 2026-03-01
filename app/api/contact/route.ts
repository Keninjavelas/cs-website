require("dns").setDefaultResultOrder("ipv4first");

import nodemailer from "nodemailer";
import { NextRequest, NextResponse } from "next/server";
import {
  isContactFormAllowed,
  getIP,
  getContactFormRemaining,
} from "@/lib/rate-limiter";
import { validateEmail } from "@/lib/email-validation";

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
  company?: string; // Honeypot field
}

export async function POST(request: NextRequest) {
  console.log("\n📧 === CONTACT FORM SUBMISSION ===");

  try {
    // Get client IP for rate limiting
    const clientIP = getIP(request);
    console.log(`📍 Client IP: ${clientIP}`);

    // Check rate limit
    if (!isContactFormAllowed(clientIP)) {
      const remaining = getContactFormRemaining(clientIP);
      console.log(
        `❌ Rate limit exceeded for IP: ${clientIP} (remaining: ${remaining})`
      );
      return NextResponse.json(
        {
          success: false,
          error: "Too many submissions. Please try again in 10 minutes.",
        },
        { status: 429 }
      );
    }

    // Verify environment variables are set
    if (!process.env.GMAIL_USER || !process.env.GMAIL_PASS) {
      console.error("❌ Missing Gmail credentials in environment variables");
      return NextResponse.json(
        {
          success: false,
          error: "Email service not configured",
        },
        { status: 500 }
      );
    }

    // Parse request body
    const body: ContactFormData = await request.json();
    console.log("✓ Parsed request body");

    // Check honeypot field (silent rejection if filled)
    if (body.company && body.company.trim().length > 0) {
      console.log("🤖 Honeypot field filled - treating as spam");
      // Return success to not reveal honeypot to bots
      return NextResponse.json(
        {
          success: true,
          message: "Thank you for contacting us! We will get back to you soon.",
        },
        { status: 200 }
      );
    }

    // Validate required fields
    if (!body.name || !body.email || !body.subject || !body.message) {
      console.log("❌ Validation failed: Missing required fields");
      return NextResponse.json(
        {
          success: false,
          error: "Name, email, subject, and message are required",
        },
        { status: 400 }
      );
    }

    // Validate email format
    const emailValidation = validateEmail(body.email);
    if (!emailValidation.valid) {
      console.log(`❌ Validation failed: ${emailValidation.error}`);
      return NextResponse.json(
        {
          success: false,
          error: emailValidation.error || "Please provide a valid email address",
        },
        { status: 400 }
      );
    }

    // Validate message length
    if (body.message.trim().length < 10) {
      console.log("❌ Validation failed: Message too short");
      return NextResponse.json(
        {
          success: false,
          error: "Message must be at least 10 characters long",
        },
        { status: 400 }
      );
    }

    console.log("✓ All validations passed");
    console.log(`  Name: ${body.name}`);
    console.log(`  Email: ${body.email}`);

    // Create Nodemailer transporter for Gmail using STARTTLS on port 587
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false, // Use STARTTLS instead of implicit SSL
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    // Get current timestamp in IST
    const timestamp = new Date().toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });

    // Escape HTML entities to prevent injection
    const escapeHtml = (text: string): string => {
      const map: { [key: string]: string } = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;",
      };
      return text.replace(/[&<>"']/g, (char) => map[char]);
    };

    // Prepare email content
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8" />
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
              line-height: 1.6;
              color: #333;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              border: 1px solid #e0e0e0;
              border-radius: 8px;
              background-color: #f9f9f9;
            }
            .header {
              background-color: #0066cc;
              color: white;
              padding: 20px;
              border-radius: 8px 8px 0 0;
              margin: -20px -20px 20px -20px;
            }
            .header h1 {
              margin: 0;
              font-size: 24px;
            }
            .content {
              background-color: white;
              padding: 20px;
              border-radius: 4px;
              margin-bottom: 20px;
            }
            .field {
              margin-bottom: 16px;
            }
            .field-label {
              font-weight: 600;
              color: #0066cc;
              font-size: 14px;
              text-transform: uppercase;
              letter-spacing: 0.5px;
            }
            .field-value {
              margin-top: 6px;
              color: #333;
              word-break: break-word;
            }
            .message-box {
              background-color: #f5f5f5;
              padding: 16px;
              border-left: 4px solid #0066cc;
              border-radius: 4px;
              margin-top: 6px;
              white-space: pre-wrap;
              word-wrap: break-word;
            }
            .timestamp {
              font-size: 12px;
              color: #999;
              text-align: right;
              margin-top: 20px;
              padding-top: 20px;
              border-top: 1px solid #e0e0e0;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>✉️ New Contact Message</h1>
            </div>
            <div class="content">
              <div class="field">
                <div class="field-label">Sender Name</div>
                <div class="field-value">${escapeHtml(body.name)}</div>
              </div>
              <div class="field">
                <div class="field-label">Email Address</div>
                <div class="field-value">
                  <a href="mailto:${escapeHtml(body.email)}" style="color: #0066cc; text-decoration: none;">
                    ${escapeHtml(body.email)}
                  </a>
                </div>
              </div>
              <div class="field">
                <div class="field-label">Subject</div>
                <div class="field-value">${escapeHtml(body.subject)}</div>
              </div>
              <div class="field">
                <div class="field-label">Message</div>
                <div class="message-box">${escapeHtml(body.message)}</div>
              </div>
            </div>
            <div class="timestamp">
              Received on: ${timestamp} (IST)
            </div>
          </div>
        </body>
      </html>
    `;

    // Send email
    console.log("📤 Sending email via Gmail SMTP...");
    const info = await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: process.env.GMAIL_USER,
      replyTo: body.email,
      subject: `[IEEE CS] New Contact: ${escapeHtml(body.subject)}`,
      html: htmlContent,
      text: `
Name: ${body.name}
Email: ${body.email}
Subject: ${body.subject}

Message:
${body.message}

Received on: ${timestamp} (IST)
      `,
    });

    console.log("✅ Email sent successfully");
    console.log(`  Message ID: ${info.messageId}`);
    console.log("=== END CONTACT FORM SUBMISSION ===\n");

    return NextResponse.json(
      {
        success: true,
        message: "Thank you for contacting us! We will get back to you soon.",
        timestamp,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Exception occurred:", error);
    console.log("=== END CONTACT FORM SUBMISSION ===\n");

    // Don't expose error details to client
    return NextResponse.json(
      {
        success: false,
        error: "Failed to send email. Please try again later.",
      },
      { status: 500 }
    );
  }
}
