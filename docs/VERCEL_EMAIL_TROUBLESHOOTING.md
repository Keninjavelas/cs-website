# Vercel Email Service Troubleshooting

## Common Issue: 500 Error on Vercel Deployment

If you're getting a 500 error when submitting the contact form on Vercel, follow these steps:

## Step 1: Check Environment Variables

The most common issue is missing environment variables on Vercel.

### Verify Variables are Set

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Verify these variables exist:
   - `GMAIL_USER`
   - `GMAIL_PASS`

### Add Missing Variables

If they're missing, add them:

1. Click **Add New**
2. Add `GMAIL_USER`:
   - Name: `GMAIL_USER`
   - Value: `hkbk.cs.ieee@gmail.com` (or your email)
   - Environment: Production, Preview, Development (check all)
   - Click **Save**

3. Add `GMAIL_PASS`:
   - Name: `GMAIL_PASS`
   - Value: Your Gmail App Password (e.g., `ctrk maqz bgzb bpvz`)
   - Environment: Production, Preview, Development (check all)
   - Mark as **Sensitive** (eye icon)
   - Click **Save**

### Important Notes

- Do NOT prefix with `NEXT_PUBLIC_` (these are server-side only)
- Use the App Password from https://myaccount.google.com/apppasswords
- Include spaces in the App Password as generated
- After adding variables, you MUST redeploy

## Step 2: Redeploy

After adding/updating environment variables:

1. Go to **Deployments** tab
2. Click the three dots (...) on the latest deployment
3. Click **Redeploy**
4. Wait for deployment to complete

OR push a new commit to trigger automatic deployment.

## Step 3: Check Vercel Logs

If still failing, check the logs:

1. Go to your Vercel project
2. Click on the latest deployment
3. Click **Functions** tab
4. Find `/api/contact` function
5. Click to view logs

Look for error messages like:
- `❌ Missing Gmail credentials` → Environment variables not set
- `❌ Failed to send email` → SMTP connection issue
- `❌ Email transporter verification failed` → Invalid credentials

## Step 4: Test Locally First

Before debugging on Vercel, ensure it works locally:

```bash
# Test the email service
npm run test:email

# Start dev server
npm run dev

# Test the contact form at http://localhost:3000/contact
```

If it works locally but not on Vercel, it's definitely an environment variable issue.

## Step 5: Verify Gmail App Password

If environment variables are set but still failing:

1. Go to https://myaccount.google.com/apppasswords
2. Delete the old App Password
3. Generate a new one
4. Update `GMAIL_PASS` in Vercel
5. Redeploy

## Common Errors and Solutions

### Error: "Email service not configured"

**Cause**: Missing `GMAIL_USER` or `GMAIL_PASS` environment variables

**Solution**:
1. Add variables in Vercel dashboard
2. Redeploy

### Error: "Failed to connect to email service"

**Cause**: Invalid Gmail credentials or App Password

**Solution**:
1. Regenerate Gmail App Password
2. Update `GMAIL_PASS` in Vercel
3. Ensure 2-Step Verification is enabled on Gmail
4. Redeploy

### Error: "Authentication failed"

**Cause**: Incorrect App Password or regular password used instead

**Solution**:
1. Use App Password, not regular Gmail password
2. Regenerate App Password if needed
3. Update in Vercel
4. Redeploy

### Error: Connection timeout

**Cause**: Vercel's network blocking SMTP port 587

**Solution**:
This is rare, but if it happens:
1. Try using port 465 with `secure: true`
2. Consider using Resend or SendGrid instead (see alternatives below)

## Vercel-Specific Configuration

The contact API route is configured to use Node.js runtime:

```typescript
// app/api/contact/route.ts
export const runtime = "nodejs";
```

This ensures nodemailer works correctly on Vercel.

## Alternative: Use Resend (Recommended for Vercel)

If Gmail SMTP continues to have issues, consider using Resend (built for serverless):

### 1. Install Resend

```bash
npm install resend
```

### 2. Get Resend API Key

1. Sign up at https://resend.com
2. Get your API key from the dashboard

### 3. Update Environment Variables

In Vercel, add:
- `RESEND_API_KEY` = your-api-key

### 4. Update Email Service

Create `lib/email-service-resend.ts`:

```typescript
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmail(config: EmailConfig) {
  const { data, error } = await resend.emails.send({
    from: 'IEEE CS HKBK <onboarding@resend.dev>', // Use verified domain
    to: config.to,
    replyTo: config.replyTo,
    subject: config.subject,
    html: config.html,
  });

  if (error) {
    throw new Error('Failed to send email');
  }

  return { messageId: data?.id || '' };
}
```

### 5. Update Contact Route

```typescript
// Change import
import { sendEmail } from '@/lib/email-service-resend';
```

## Debugging Checklist

- [ ] Environment variables set in Vercel
- [ ] Variables marked as Sensitive
- [ ] All environments selected (Production, Preview, Development)
- [ ] Redeployed after adding variables
- [ ] Gmail App Password is correct (not regular password)
- [ ] 2-Step Verification enabled on Gmail
- [ ] Works locally with same credentials
- [ ] Checked Vercel function logs
- [ ] Runtime set to "nodejs" in route

## Testing on Vercel

After deployment, test the contact form:

1. Go to your production URL: `https://your-site.vercel.app/contact`
2. Fill out the form
3. Submit
4. Check Vercel logs for errors
5. Check Gmail inbox for email

## Getting Help

If still having issues:

1. Check Vercel function logs for specific error messages
2. Test locally to isolate the issue
3. Verify all environment variables are correct
4. Consider using Resend as an alternative

## Quick Fix Commands

```bash
# Test locally
npm run test:email

# Check if variables are in .env.local
cat .env.local | grep GMAIL

# Rebuild and test
npm run build
npm run start
```

## Support

- Vercel Documentation: https://vercel.com/docs
- Nodemailer Documentation: https://nodemailer.com/
- Resend Documentation: https://resend.com/docs
- Gmail App Passwords: https://myaccount.google.com/apppasswords
