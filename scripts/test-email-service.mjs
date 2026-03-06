#!/usr/bin/env node

/**
 * Test script for email service
 * Usage: node scripts/test-email-service.mjs
 */

import { config } from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const envPath = join(__dirname, "..", ".env.local");
config({ path: envPath });

console.log("\n🧪 Testing Email Service\n");
console.log("=" .repeat(50));

// Check environment variables
console.log("\n1️⃣ Checking environment variables...");
if (!process.env.GMAIL_USER) {
  console.error("❌ GMAIL_USER is not set");
  process.exit(1);
}
if (!process.env.GMAIL_PASS) {
  console.error("❌ GMAIL_PASS is not set");
  process.exit(1);
}
console.log(`✅ GMAIL_USER: ${process.env.GMAIL_USER}`);
console.log(`✅ GMAIL_PASS: ${"*".repeat(process.env.GMAIL_PASS.length)}`);

// Test SMTP connection
console.log("\n2️⃣ Testing SMTP connection...");
const nodemailer = await import("nodemailer");

// Set DNS resolution order
try {
  const dns = await import("dns");
  dns.setDefaultResultOrder("ipv4first");
  console.log("✅ DNS resolution order set to IPv4 first");
} catch (error) {
  console.warn("⚠️  Could not set DNS resolution order:", error.message);
}

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

try {
  await transporter.verify();
  console.log("✅ SMTP connection successful");
} catch (error) {
  console.error("❌ SMTP connection failed:", error.message);
  console.error("\nPossible issues:");
  console.error("  - Invalid Gmail credentials");
  console.error("  - App Password not generated (use https://myaccount.google.com/apppasswords)");
  console.error("  - 2-Step Verification not enabled on Gmail account");
  console.error("  - Network/firewall blocking SMTP port 587");
  process.exit(1);
}

// Send test email
console.log("\n3️⃣ Sending test email...");
try {
  const info = await transporter.sendMail({
    from: process.env.GMAIL_USER,
    to: process.env.GMAIL_USER,
    subject: "[TEST] Email Service Verification",
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px;">
        <h2 style="color: #0066cc;">✅ Email Service Test</h2>
        <p>This is a test email from your IEEE CS HKBK platform.</p>
        <p><strong>Timestamp:</strong> ${new Date().toLocaleString("en-IN", {
          timeZone: "Asia/Kolkata",
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })} (IST)</p>
        <p style="color: #28a745; font-weight: bold;">If you received this email, your email service is working correctly! 🎉</p>
      </div>
    `,
    text: `
Email Service Test

This is a test email from your IEEE CS HKBK platform.
Timestamp: ${new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })} (IST)

If you received this email, your email service is working correctly!
    `,
  });

  console.log("✅ Test email sent successfully");
  console.log(`   Message ID: ${info.messageId}`);
  console.log(`   Check your inbox: ${process.env.GMAIL_USER}`);
} catch (error) {
  console.error("❌ Failed to send test email:", error.message);
  process.exit(1);
}

console.log("\n" + "=".repeat(50));
console.log("✅ All tests passed! Email service is working correctly.\n");
