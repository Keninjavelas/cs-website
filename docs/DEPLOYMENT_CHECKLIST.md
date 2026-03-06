# Deployment Checklist for Vercel

## Pre-Deployment

### 1. Test Locally

- [ ] Run `npm run test:email` - should pass
- [ ] Run `npm run dev` and test contact form at http://localhost:3000/contact
- [ ] Verify email is received in Gmail inbox
- [ ] Check console logs for any errors
- [ ] Run `npm run build` to ensure no build errors

### 2. Prepare Environment Variables

- [ ] Gmail App Password generated (https://myaccount.google.com/apppasswords)
- [ ] 2-Step Verification enabled on Gmail account
- [ ] Note down `GMAIL_USER` and `GMAIL_PASS` values

## Vercel Deployment

### 3. Set Environment Variables

1. Go to Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add the following:

#### GMAIL_USER
- Name: `GMAIL_USER`
- Value: `hkbk.cs.ieee@gmail.com` (your email)
- Environments: ✅ Production ✅ Preview ✅ Development
- Click **Save**

#### GMAIL_PASS
- Name: `GMAIL_PASS`
- Value: Your 16-character App Password (e.g., `ctrk maqz bgzb bpvz`)
- Environments: ✅ Production ✅ Preview ✅ Development
- Mark as **Sensitive** (eye icon)
- Click **Save**

#### NEXT_PUBLIC_SUPABASE_URL (if not already set)
- Name: `NEXT_PUBLIC_SUPABASE_URL`
- Value: Your Supabase URL
- Environments: ✅ Production ✅ Preview ✅ Development

#### NEXT_PUBLIC_SUPABASE_ANON_KEY (if not already set)
- Name: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Value: Your Supabase anon key
- Environments: ✅ Production ✅ Preview ✅ Development

### 4. Deploy

Option A: Push to Git
```bash
git add .
git commit -m "Fix email service for Vercel deployment"
git push
```

Option B: Manual Redeploy
1. Go to **Deployments** tab
2. Click three dots (...) on latest deployment
3. Click **Redeploy**

### 5. Wait for Deployment

- [ ] Wait for deployment to complete (usually 1-2 minutes)
- [ ] Check for any build errors
- [ ] Verify deployment status is "Ready"

## Post-Deployment Testing

### 6. Test Debug Endpoint

```bash
curl https://your-site.vercel.app/api/contact/debug
```

Expected response:
```json
{
  "checks": {
    "gmailUserSet": true,
    "gmailPassSet": true,
    "gmailUserValue": "hkb***",
    "gmailPassLength": 19
  },
  "nodemailerAvailable": true,
  "smtpTest": "success"
}
```

If `smtpTest` is not "success", check:
- [ ] Environment variables are correct
- [ ] App Password is valid
- [ ] Redeployed after adding variables

### 7. Test Contact Form

1. Go to `https://your-site.vercel.app/contact`
2. Fill out the form:
   - Name: Test User
   - Email: test@example.com
   - Subject: Test Submission
   - Message: Testing the contact form after deployment
3. Click **Send Message**
4. Should see success message
5. Check Gmail inbox for email

### 8. Check Vercel Logs

1. Go to Vercel dashboard
2. Click on the deployment
3. Click **Functions** tab
4. Find `/api/contact` function
5. Check logs for:
   - `✅ Email sent successfully`
   - No error messages

## Troubleshooting

### If Debug Endpoint Shows Issues

#### `gmailUserSet: false` or `gmailPassSet: false`
- Environment variables not set in Vercel
- Go back to Step 3 and add them
- Redeploy

#### `smtpTest: "credentials_missing"`
- Environment variables not set
- Add them and redeploy

#### `smtpTest: "Authentication failed"`
- Invalid App Password
- Regenerate App Password
- Update in Vercel
- Redeploy

#### `smtpTest: "Connection timeout"`
- Rare network issue
- Try redeploying
- Consider using Resend instead

### If Contact Form Returns 500 Error

1. Check Vercel function logs
2. Look for specific error message
3. Verify environment variables are set
4. Test debug endpoint
5. See `docs/VERCEL_EMAIL_TROUBLESHOOTING.md`

### If Email Not Received

1. Check spam folder
2. Verify Gmail inbox is `hkbk.cs.ieee@gmail.com`
3. Check Vercel logs for "Email sent successfully"
4. Try sending another test email

## Security Checklist

- [ ] Environment variables marked as Sensitive
- [ ] `.env.local` not committed to Git
- [ ] App Password used (not regular Gmail password)
- [ ] Debug endpoint removed or protected in production
- [ ] Rate limiting enabled (3 per 10 min per IP)
- [ ] Honeypot field in place

## Performance Checklist

- [ ] Contact API uses Node.js runtime
- [ ] No unnecessary SMTP verification on each request
- [ ] Error messages don't expose sensitive info
- [ ] Logs are concise and informative

## Monitoring

### Set Up Alerts

Consider setting up alerts for:
- Failed email deliveries
- High error rates on `/api/contact`
- Rate limit exceeded events

### Regular Checks

- [ ] Test contact form weekly
- [ ] Monitor Vercel function logs
- [ ] Check Gmail inbox for test emails
- [ ] Rotate App Password quarterly

## Rollback Plan

If deployment fails:

1. Go to Vercel **Deployments**
2. Find last working deployment
3. Click three dots (...)
4. Click **Promote to Production**

## Documentation

- [ ] Update README with production URL
- [ ] Document any custom configuration
- [ ] Share credentials with team (securely)
- [ ] Update runbook with any issues encountered

## Final Verification

- [ ] Contact form works on production
- [ ] Email received in Gmail
- [ ] No errors in Vercel logs
- [ ] Debug endpoint tested
- [ ] All environment variables set
- [ ] Security measures in place

## Success Criteria

✅ Contact form submits successfully
✅ Email received in Gmail inbox
✅ No 500 errors
✅ Debug endpoint shows all checks passing
✅ Vercel logs show "Email sent successfully"

## Next Steps

After successful deployment:

1. Remove or protect debug endpoint
2. Monitor for a few days
3. Set up error tracking (optional)
4. Consider adding email templates
5. Document any issues for future reference

## Support

If you encounter issues:
- Check `docs/VERCEL_EMAIL_TROUBLESHOOTING.md`
- Review Vercel function logs
- Test locally first
- Verify all checklist items

## Quick Commands

```bash
# Test locally
npm run test:email

# Build and test
npm run build
npm run start

# Test debug endpoint
curl https://your-site.vercel.app/api/contact/debug

# Test contact API
curl -X POST https://your-site.vercel.app/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com","subject":"Test","message":"Testing"}'
```
