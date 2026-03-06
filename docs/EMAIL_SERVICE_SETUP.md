# Email Service Setup Guide

This guide explains how to configure and troubleshoot the email service for the IEEE CS HKBK platform.

## Overview

The platform uses **Gmail SMTP** with **Nodemailer** to send contact form emails. The service is configured to use STARTTLS on port 587 for secure email delivery.

## Prerequisites

1. A Gmail account (e.g., `hkbk.cs.ieee@gmail.com`)
2. 2-Step Verification enabled on the Gmail account
3. Gmail App Password generated

## Setup Instructions

### Step 1: Enable 2-Step Verification

1. Go to your Google Account: https://myaccount.google.com
2. Navigate to **Security** → **2-Step Verification**
3. Follow the prompts to enable 2-Step Verification

### Step 2: Generate App Password

1. Go to: https://myaccount.google.com/apppasswords
2. Select **App**: Mail
3. Select **Device**: Other (Custom name) → Enter "IEEE CS Platform"
4. Click **Generate**
5. Copy the 16-character password (format: `aaaa bbbb cccc dddd`)

### Step 3: Configure Environment Variables

Add the following to your `.env.local` file:

```env
# Gmail SMTP Configuration
GMAIL_USER=your-email@gmail.com
GMAIL_PASS=aaaa bbbb cccc dddd
```

**Important Notes:**
- Do NOT prefix with `NEXT_PUBLIC_` (these are server-side only)
- Use the App Password, not your regular Gmail password
- Keep spaces in the App Password as generated

### Step 4: Test the Configuration

Run the test script to verify everything is working:

```bash
node scripts/test-email-service.mjs
```

Expected output:
```
✅ SMTP connection successful
✅ Test email sent successfully
```

## Architecture

### Email Service Module (`lib/email-service.ts`)

The email service provides:
- **Transporter creation** with automatic verification
- **Email sending** with error handling
- **HTML escaping** for security
- **IST timestamp** formatting

### Contact API Route (`app/api/contact/route.ts`)

The contact form endpoint:
1. Validates form data
2. Checks rate limits (prevents spam)
3. Detects honeypot field (bot protection)
4. Sends formatted email
5. Returns success/error response

## Features

### Security Features

1. **Rate Limiting**: 3 submissions per 10 minutes per IP
2. **Honeypot Field**: Hidden field to catch bots
3. **Email Validation**: Format and domain checks
4. **HTML Escaping**: Prevents XSS attacks
5. **Server-Side Only**: Credentials never exposed to client

### Email Template

The contact form emails include:
- Professional HTML formatting
- Sender information (name, email)
- Subject and message content
- IST timestamp
- Reply-to header for easy responses

## Troubleshooting

### Issue: "Email service not configured"

**Cause**: Missing environment variables

**Solution**:
```bash
# Check if variables are set
echo $GMAIL_USER
echo $GMAIL_PASS

# Add to .env.local if missing
GMAIL_USER=your-email@gmail.com
GMAIL_PASS=your-app-password
```

### Issue: "Failed to connect to email service"

**Cause**: Invalid credentials or network issues

**Solutions**:
1. Verify App Password is correct (regenerate if needed)
2. Ensure 2-Step Verification is enabled
3. Check firewall/network allows port 587
4. Try regenerating the App Password

### Issue: "SMTP connection timeout"

**Cause**: Network/firewall blocking SMTP port

**Solutions**:
1. Check if port 587 is open: `telnet smtp.gmail.com 587`
2. Try from a different network
3. Contact your network administrator
4. Verify DNS resolution: `nslookup smtp.gmail.com`

### Issue: "Authentication failed"

**Cause**: Incorrect credentials or App Password expired

**Solutions**:
1. Regenerate App Password
2. Verify email address is correct
3. Check for extra spaces in credentials
4. Ensure using App Password, not regular password

### Issue: Rate limit exceeded

**Cause**: Too many submissions from same IP

**Solution**: Wait 10 minutes or clear rate limit cache

## Testing

### Manual Testing

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Navigate to: http://localhost:3000/contact

3. Fill out and submit the form

4. Check the console for logs:
   ```
   📧 === CONTACT FORM SUBMISSION ===
   ✓ All validations passed
   📤 Sending email via Gmail SMTP...
   ✅ Email sent successfully
   ```

5. Check your Gmail inbox for the email

### Automated Testing

Run the test script:
```bash
node scripts/test-email-service.mjs
```

### API Testing

Use curl or Postman:

```bash
curl -X POST http://localhost:3000/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "subject": "Test Subject",
    "message": "This is a test message from the API."
  }'
```

Expected response:
```json
{
  "success": true,
  "message": "Thank you for contacting us! We will get back to you soon.",
  "timestamp": "6 March, 2026, 10:30:45 am (IST)"
}
```

## Configuration Options

### SMTP Settings

Current configuration (in `lib/email-service.ts`):
```typescript
{
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
}
```

### DNS Resolution

The service sets DNS resolution to prefer IPv4:
```typescript
require("dns").setDefaultResultOrder("ipv4first");
```

This fixes connection issues on some networks.

## Production Deployment

### Vercel Configuration

1. Go to your Vercel project settings
2. Navigate to **Environment Variables**
3. Add:
   - `GMAIL_USER` (mark as Sensitive)
   - `GMAIL_PASS` (mark as Sensitive)
4. Redeploy the application

### Security Best Practices

1. Never commit `.env.local` to version control
2. Use different credentials for development/production
3. Rotate App Passwords periodically
4. Monitor email sending logs
5. Set up alerts for failed deliveries

## Monitoring

### Log Messages

The service logs detailed information:
- `📧 === CONTACT FORM SUBMISSION ===` - New submission
- `✓ All validations passed` - Validation successful
- `📤 Sending email via Gmail SMTP...` - Sending email
- `✅ Email sent successfully` - Email delivered
- `❌ Exception occurred` - Error occurred

### Error Tracking

Monitor these errors:
- Rate limit exceeded (429)
- Validation failures (400)
- SMTP connection failures (500)
- Authentication errors (500)

## Alternative Email Services

If you need to switch from Gmail:

### Using Resend

1. Install: `npm install resend`
2. Get API key from: https://resend.com
3. Update `lib/email-service.ts`:

```typescript
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmail(config: EmailConfig) {
  return await resend.emails.send({
    from: config.from,
    to: config.to,
    subject: config.subject,
    html: config.html,
  });
}
```

### Using SendGrid

1. Install: `npm install @sendgrid/mail`
2. Get API key from: https://sendgrid.com
3. Update `lib/email-service.ts` accordingly

## Support

For issues or questions:
- Check the troubleshooting section above
- Review server logs for detailed error messages
- Test with the provided test script
- Contact: hkbk.cs.ieee@gmail.com

## References

- [Gmail SMTP Settings](https://support.google.com/mail/answer/7126229)
- [Google App Passwords](https://support.google.com/accounts/answer/185833)
- [Nodemailer Documentation](https://nodemailer.com/)
- [Next.js API Routes](https://nextjs.org/docs/api-routes/introduction)
