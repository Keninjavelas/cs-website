import nodemailer from "nodemailer";
import type { Transporter } from "nodemailer";

// Set DNS resolution order to prefer IPv4 (fixes some SMTP connection issues)
// Only works in Node.js runtime, not Edge Runtime
try {
  if (typeof process !== "undefined" && process.versions?.node) {
    const dns = require("dns");
    if (dns.setDefaultResultOrder) {
      dns.setDefaultResultOrder("ipv4first");
    }
  }
} catch (error) {
  // Silently fail - not critical for functionality
}

export interface EmailConfig {
  from: string;
  to: string;
  replyTo?: string;
  subject: string;
  html: string;
  text: string;
}

/**
 * Create Gmail SMTP transporter (without verification for performance)
 */
export function createEmailTransporter(): Transporter {
  if (!process.env.GMAIL_USER || !process.env.GMAIL_PASS) {
    throw new Error("Email credentials not configured. Please set GMAIL_USER and GMAIL_PASS environment variables.");
  }

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // Use STARTTLS
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  return transporter;
}

/**
 * Send email using configured transporter
 */
export async function sendEmail(config: EmailConfig): Promise<{ messageId: string }> {
  const transporter = createEmailTransporter();

  try {
    const info = await transporter.sendMail({
      from: config.from,
      to: config.to,
      replyTo: config.replyTo,
      subject: config.subject,
      html: config.html,
      text: config.text,
    });

    console.log("✅ Email sent successfully. Message ID:", info.messageId);
    return { messageId: info.messageId };
  } catch (error) {
    console.error("❌ Failed to send email:", error);
    throw new Error("Failed to send email. Please try again later.");
  }
}

/**
 * Escape HTML entities to prevent injection
 */
export function escapeHtml(text: string): string {
  const map: { [key: string]: string } = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  };
  return text.replace(/[&<>"']/g, (char) => map[char]);
}

/**
 * Get formatted timestamp in IST
 */
export function getISTTimestamp(): string {
  return new Date().toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}
