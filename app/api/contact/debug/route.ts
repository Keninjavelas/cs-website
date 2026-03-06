import { NextResponse } from "next/server";

// Force Node.js runtime
export const runtime = "nodejs";

/**
 * Debug endpoint to check email service configuration
 * DO NOT USE IN PRODUCTION - Remove or protect this endpoint
 */
export async function GET() {
  const diagnostics = {
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    runtime: "nodejs",
    checks: {
      gmailUserSet: !!process.env.GMAIL_USER,
      gmailPassSet: !!process.env.GMAIL_PASS,
      gmailUserValue: process.env.GMAIL_USER ? `${process.env.GMAIL_USER.substring(0, 3)}***` : "NOT SET",
      gmailPassLength: process.env.GMAIL_PASS?.length || 0,
    },
    nodemailerAvailable: false,
    smtpTest: "not_tested",
  };

  // Test if nodemailer is available
  try {
    const nodemailer = await import("nodemailer");
    diagnostics.nodemailerAvailable = true;

    // Only test SMTP if credentials are set
    if (process.env.GMAIL_USER && process.env.GMAIL_PASS) {
      try {
        const transporter = nodemailer.default.createTransport({
          host: "smtp.gmail.com",
          port: 587,
          secure: false,
          auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_PASS,
          },
          tls: {
            rejectUnauthorized: false,
          },
        });

        await transporter.verify();
        diagnostics.smtpTest = "success";
      } catch (error) {
        diagnostics.smtpTest = error instanceof Error ? error.message : "failed";
      }
    } else {
      diagnostics.smtpTest = "credentials_missing";
    }
  } catch (error) {
    diagnostics.smtpTest = "nodemailer_import_failed";
  }

  return NextResponse.json(diagnostics, { status: 200 });
}
