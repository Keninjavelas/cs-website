# Email Service Quick Reference

## Quick Setup (5 minutes)

1. **Enable 2-Step Verification**
   - Go to: https://myaccount.google.com/security
   - Enable 2-Step Verification

2. **Generate App Password**
   - Go to: https://myaccount.google.com/apppasswords
   - Create password for "Mail" → "Other (IEEE CS Platform)"
   - Copy the 16-character password

3. **Add to .env.local**
   ```env
   GMAIL_USER=your-email@gmail.com
   GMAIL_PASS=aaaa bbbb cccc dddd
   ```

4. **Test**
   ```bash
   node scripts/test-email-service.mjs
   ```

## Quick Test

### Test via Script
```bash
node scripts/test-email-service.mjs
```

### Test via API
```bash
curl -X POST http://localhost:3000/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test",
    "email": "test@example.com",
    "subject": "Test",
    "message": "Testing email service"
  }'
```

### Test via UI
1. Start dev server: `npm run dev`
2. Go to: http://localhost:3000/contact
3. Submit the form
4. Check Gmail inbox

## Common Issues

| Issue | Solution |
|-------|----------|
| "Email service not configured" | Add `GMAIL_USER` and `GMAIL_PASS` to `.env.local` |
| "Failed to connect" | Regenerate App Password |
| "Authentication failed" | Verify 2-Step Verification is enabled |
| "Rate limit exceeded" | Wait 10 minutes |
| Connection timeout | Check port 587 is not blocked |

## File Structure

```
lib/
  email-service.ts       # Email service utilities
  email-validation.ts    # Email validation
app/api/contact/
  route.ts              # Contact form API endpoint
scripts/
  test-email-service.mjs # Test script
docs/
  EMAIL_SERVICE_SETUP.md # Full documentation
```

## Key Functions

### `sendEmail(config)`
Send an email with the provided configuration.

```typescript
await sendEmail({
  from: "sender@gmail.com",
  to: "recipient@gmail.com",
  replyTo: "reply@example.com",
  subject: "Subject",
  html: "<p>HTML content</p>",
  text: "Plain text content"
});
```

### `escapeHtml(text)`
Escape HTML entities for security.

```typescript
const safe = escapeHtml("<script>alert('xss')</script>");
// Returns: "&lt;script&gt;alert('xss')&lt;/script&gt;"
```

### `getISTTimestamp()`
Get formatted timestamp in IST timezone.

```typescript
const timestamp = getISTTimestamp();
// Returns: "6 March, 2026, 10:30:45 am"
```

## Security Features

- ✅ Rate limiting (3 per 10 min per IP)
- ✅ Honeypot field (bot detection)
- ✅ Email validation
- ✅ HTML escaping (XSS prevention)
- ✅ Server-side only (credentials protected)

## Production Checklist

- [ ] App Password generated
- [ ] Environment variables set in Vercel
- [ ] Variables marked as "Sensitive"
- [ ] Test email sent successfully
- [ ] Contact form tested on production
- [ ] Error monitoring configured

## Support

Full documentation: `docs/EMAIL_SERVICE_SETUP.md`
