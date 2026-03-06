# 🚀 Quick Fix for Vercel 500 Error

## The Problem
Contact form returns 500 error on Vercel deployment.

## The Solution (3 Steps)

### 1️⃣ Add Environment Variables in Vercel

Go to: **Vercel Dashboard → Your Project → Settings → Environment Variables**

Add these two:

```
GMAIL_USER = hkbk.cs.ieee@gmail.com
GMAIL_PASS = ctrk maqz bgzb bpvz
```

✅ Check all environments (Production, Preview, Development)
✅ Mark GMAIL_PASS as Sensitive

### 2️⃣ Redeploy

**Option A**: Push code
```bash
git add .
git commit -m "Fix email service"
git push
```

**Option B**: Manual redeploy in Vercel
- Deployments → (...) → Redeploy

### 3️⃣ Test

```bash
# Test debug endpoint
curl https://your-site.vercel.app/api/contact/debug

# Should show: "smtpTest": "success"
```

Then test the contact form at: `https://your-site.vercel.app/contact`

## Done! ✅

If still not working, see `VERCEL_FIX_SUMMARY.md` for detailed troubleshooting.
