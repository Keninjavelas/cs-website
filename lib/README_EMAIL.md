# Email Service Module

This module provides email functionality for the IEEE CS HKBK platform using Gmail SMTP and Nodemailer.

## Quick Start

```typescript
import { sendEmail, escapeHtml, getISTTimestamp } from '@/lib/email-service';

// Send an email
await sendEmail({
  from: process.env.GMAIL_USER!,
  to: 'recipient@example.com',
  replyTo: 'sender@example.com',
  subject: 'Subject Line',
  html: '<p>HTML content</p>',
  text: 'Plain text content'
});
```

## Functions

### `createEmailTransporter()`

Creates and verifies a Gmail SMTP transporter.

**Returns**: `Promise<Transporter>`

**Throws**: Error if credentials are missing or connection fails

**Example**:
```typescript
const transporter = await createEmailTransporter();
```

### `sendEmail(config)`

Sends an email using the configured transporter.

**Parameters**:
- `config.from` (string) - Sender email address
- `config.to` (string) - Recipient email address
- `config.replyTo` (string, optional) - Reply-to email address
- `config.subject` (string) - Email subject
- `config.html` (string) - HTML email content
- `config.text` (string) - Plain text email content

**Returns**: `Promise<{ messageId: string }>`

**Throws**: Error if email sending fails

**Example**:
```typescript
const result = await sendEmail({
  from: 'sender@gmail.com',
  to: 'recipient@example.com',
  subject: 'Hello',
  html: '<p>Hello World</p>',
  text: 'Hello World'
});
console.log('Message ID:', result.messageId);
```

### `escapeHtml(text)`

Escapes HTML entities to prevent XSS attacks.

**Parameters**:
- `text` (string) - Text to escape

**Returns**: `string` - Escaped text

**Example**:
```typescript
const safe = escapeHtml('<script>alert("xss")</script>');
// Returns: "&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;"
```

### `getISTTimestamp()`

Gets the current timestamp formatted in IST timezone.

**Returns**: `string` - Formatted timestamp

**Example**:
```typescript
const timestamp = getISTTimestamp();
// Returns: "6 March, 2026, 10:30:45 am"
```

## Configuration

### Environment Variables

Required environment variables (in `.env.local`):

```env
GMAIL_USER=your-email@gmail.com
GMAIL_PASS=your-app-password
```

### SMTP Settings

The module uses the following SMTP configuration:

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

## Security Features

- **HTML Escaping**: Prevents XSS attacks
- **Server-Side Only**: Credentials never exposed to client
- **Connection Verification**: Automatic SMTP connection testing
- **Error Handling**: Comprehensive error messages

## Testing

Run the test script:

```bash
npm run test:email
```

Or manually:

```bash
node scripts/test-email-service.mjs
```

## Error Handling

All functions throw descriptive errors:

```typescript
try {
  await sendEmail(config);
} catch (error) {
  console.error('Failed to send email:', error.message);
  // Handle error appropriately
}
```

Common errors:
- "Email credentials not configured" - Missing environment variables
- "Failed to connect to email service" - Invalid credentials or network issues
- "Failed to send email" - Email sending failed

## Usage in API Routes

Example from `app/api/contact/route.ts`:

```typescript
import { sendEmail, escapeHtml, getISTTimestamp } from '@/lib/email-service';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const timestamp = getISTTimestamp();
  
  await sendEmail({
    from: process.env.GMAIL_USER!,
    to: process.env.GMAIL_USER!,
    replyTo: body.email,
    subject: `Contact: ${escapeHtml(body.subject)}`,
    html: `<p>${escapeHtml(body.message)}</p>`,
    text: body.message,
  });
  
  return NextResponse.json({ success: true, timestamp });
}
```

## Documentation

- **Full Setup Guide**: `docs/EMAIL_SERVICE_SETUP.md`
- **Quick Reference**: `docs/EMAIL_SERVICE_QUICKREF.md`
- **Fix Summary**: `docs/EMAIL_SERVICE_FIX_SUMMARY.md`

## Dependencies

- `nodemailer` - Email sending library
- `@types/nodemailer` - TypeScript types

## Support

For issues or questions, see the troubleshooting section in `docs/EMAIL_SERVICE_SETUP.md`.
