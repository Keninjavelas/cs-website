# Anti-Spam Protection Guide

## Overview
This document outlines the anti-spam and bot protection measures implemented for the contact form and event registration system.

---

## Part 1: Honeypot Field

### What is a Honeypot?
A honeypot field is a hidden input field that legitimate users won't fill out, but bots will. It's an effective way to catch automated spam without bothering real users.

### Implementation

**Contact Form** (`app/contact/page.tsx`):
```tsx
<input
  type="text"
  name="company"
  value={formData.company}
  onChange={handleChange}
  style={{ display: "none" }}
  tabIndex={-1}
  autoComplete="off"
  aria-hidden="true"
/>
```

**Event Registration** (`components/events/event-registration-form.tsx`):
```tsx
<input
  type="text"
  name="company"
  value={company}
  onChange={(e) => setCompany(e.target.value)}
  style={{ display: "none" }}
  tabIndex={-1}
  autoComplete="off"
  aria-hidden="true"
/>
```

### Server-Side Validation

**Contact API** (`app/api/contact/route.ts`):
```typescript
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
```

### Why Return 200 Success?
Returning a success response prevents bots from knowing they've been detected. This is important because:
- Bots can't tell if they were blocked
- Defenders won't get feedback to improve their spam techniques
- User experience remains consistent (no confusing error message)

---

## Part 2: Rate Limiting

### Rate Limiter Utility
**File**: `lib/rate-limiter.ts`

Provides in-memory rate limiting with:
- **Max Requests**: 5 submissions per IP per 10 minutes
- **Automatic Cleanup**: Expired entries removed every 5 minutes
- **IP Detection**: Extracts IP from headers with multiple fallbacks

### IP Detection Strategy
```typescript
export function getIP(request: Request | { headers: Headers }): string {
  // Try in order of preference:
  // 1. x-forwarded-for (nginx, Vercel, proxies)
  // 2. x-real-ip (nginx)
  // 3. cf-connecting-ip (Cloudflare)
  // 4. "unknown" fallback
}
```

### Contact Form Rate Limiting
**File**: `app/api/contact/route.ts`

```typescript
const clientIP = getIP(request);

if (!isContactFormAllowed(clientIP)) {
  return NextResponse.json(
    {
      success: false,
      error: "Too many submissions. Please try again in 10 minutes.",
    },
    { status: 429 } // Too Many Requests
  );
}
```

### Event Registration Rate Limiting
**File**: `components/events/event-registration-form.tsx`

Client-side validation with proper error handling:
```tsx
if (insertError && insertError.message.toLowerCase().includes("rate")) {
  setError("Too many registrations. Please try again later.");
}
```

---

## Part 3: Email Validation

### Email Validation Utility
**File**: `lib/email-validation.ts`

Provides comprehensive email validation:

```typescript
// Basic format check
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Detailed validation
export function validateEmail(email: string): {
  valid: boolean;
  error?: string;
}
```

### Validation Rules
✅ Email must be provided
✅ Email must be in valid format (user@domain.com)
✅ Email length between 3 and 254 characters
✅ Local part (before @) max 64 characters
✅ No consecutive dots (..)

### Implementation

**Contact API**:
```typescript
const emailValidation = validateEmail(body.email);
if (!emailValidation.valid) {
  return NextResponse.json(
    {
      success: false,
      error: emailValidation.error,
    },
    { status: 400 } // Invalid Request
  );
}
```

**Event Registration**:
```typescript
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
if (!emailRegex.test(email)) {
  setError("Please enter a valid email address");
  return;
}
```

---

## Part 4: HTTP Status Codes

### Proper Status Code Usage

| Code | Meaning | When Used |
|------|---------|-----------|
| **200** | OK | Successful submission |
| **400** | Bad Request | Validation error (missing fields, invalid email) |
| **429** | Too Many Requests | Rate limit exceeded |
| **500** | Server Error | Email service down, env vars missing |

### Implementation

**Contact API** (`app/api/contact/route.ts`):
```typescript
// 400: Validation errors
if (!body.name || !body.email || !body.subject || !body.message) {
  return NextResponse.json({...}, { status: 400 });
}

// 429: Rate limit exceeded
if (!isContactFormAllowed(clientIP)) {
  return NextResponse.json({...}, { status: 429 });
}

// 500: Server error
if (!process.env.GMAIL_USER || !process.env.GMAIL_PASS) {
  return NextResponse.json({...}, { status: 500 });
}

// 200: Success
return NextResponse.json({...}, { status: 200 });
```

---

## Complete Flow

### Contact Form Submission Flow

```
User Submit Form
    ↓
[Honeypot Filled?] → Return 200 (silent rejection)
    ↓ NO
[Get Client IP]
    ↓
[Rate Limit Check] → If exceeded, return 429
    ↓ ALLOWED
[Validate Fields] → If missing, return 400
    ↓ OK
[Validate Email] → If invalid, return 400
    ↓ VALID
[Send Email]
    ↓
Return 200 Success
```

### Event Registration Flow

```
User Submit Form
    ↓
[Honeypot Filled?] → Treat as success (silent rejection)
    ↓ NO
[Validate Name] → Show error if missing
    ↓ OK
[Validate Email Format] → Show error if invalid
    ↓ VALID
[Insert into Database]
    ↓
[Duplicate Email?] → Show "Already registered" error
[Rate Limited?] → Show "Try again later" error
[Other Error?] → Show "Failed to register" error
    ↓ SUCCESS
Return Success Message
```

---

## Security Features Summary

### ✅ Protection Against:
- **Form Bots**: Honeypot catches automated submissions
- **Brute Force Spam**: Rate limiting stops rapid-fire attacks
- **Invalid Emails**: Email validation prevents bad data
- **Repeated Submissions**: Rate limiting across IPs
- **Silent Failures**: Proper error messages and status codes

### ✅ User Experience:
- Legitimate users see clear error messages
- No CAPTCHA needed (friction-free)
- Quick feedback on validation errors
- Rate limit messages hint at what needs to happen

### ✅ Server Protection:
- Prevents email service overload
- Reduces database insertions from spam
- Limits resource consumption
- Graceful degradation with proper status codes

---

## Testing

### Test Honeypot (Should be Silent)
```javascript
// Fill honeypot field
const formData = {
  name: "Bot Name",
  email: "bot@example.com",
  subject: "Spam",
  message: "This is spam content",
  company: "Spam Company" // Honeypot filled
};

// Result: Returns 200 but doesn't send email
```

### Test Rate Limiting
```javascript
// Submit 6 times rapidly from same IP
for (let i = 0; i < 6; i++) {
  fetch("/api/contact", { method: "POST", body });
}

// Result: 6th request returns 429 Too Many Requests
```

### Test Email Validation
```javascript
// Invalid emails should return 400
const invalidEmails = [
  "no-at-sign.com",
  "@nodomain.com",
  "user@",
  "user..name@example.com"
];

// Result: 400 Bad Request with error message
```

---

## Configuration

### Rate Limiter Settings
**File**: `lib/rate-limiter.ts`

```typescript
// Default: 5 submissions per 10 minutes
const contactFormLimiter = new RateLimiter(
  5,              // maxRequests
  10 * 60 * 1000, // windowMs (10 minutes)
  5 * 60 * 1000   // cleanupIntervalMs (5 minutes)
);
```

To change limits, modify the parameters in:
- `contactFormLimiter` - Contact form limits
- `eventRegistrationLimiter` - Event registration limits

---

## Monitoring

### Log Output
The system logs all relevant events:

```
📧 === CONTACT FORM SUBMISSION ===
📍 Client IP: 192.168.1.1
✓ Parsed request body
🤖 Honeypot field filled - treating as spam
❌ Rate limit exceeded for IP: 192.168.1.1
✓ All validations passed
✓ Email sent successfully
❌ Validation failed: Invalid email format
=== END CONTACT FORM SUBMISSION ===
```

Check server logs to monitor:
- Honeypot catches
- Rate limiting triggers
- Validation failures
- Email sending status

---

## Best Practices

✅ **Do's**:
- Monitor logs for spam patterns
- Adjust rate limits based on legitimate usage
- Keep email validation rules current
- Test honeypot regularly
- Use HTTPS for all forms

❌ **Don'ts**:
- Don't reveal honeypot field name in comments
- Don't change honeypot field name frequently
- Don't set rate limits too high (ineffective)
- Don't set rate limits too low (blocks users)
- Don't use only IP-based rate limiting (VPN/corporate networks)

---

## Future Enhancements

Potential improvements:
- Add CAPTCHA for users exceeding rate limit
- Implement persistent rate limiting (database/Redis)
- Add email verification for registrations
- Implement DKIM/SPF for email authentication
- Add pattern detection for common spam keywords
- Geographic IP blocking for countries without legitimate users
- Implement device fingerprinting
