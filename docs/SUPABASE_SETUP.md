# Supabase Setup Guide for IEEE CS Website

## 📋 Prerequisites
- A Supabase account (free tier is sufficient)
- Admin email address for testing

## 🚀 Step-by-Step Setup

### 1. Create Supabase Project

1. Visit [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Click **"New Project"**
3. Fill in:
   - **Name**: `ieee-cs-website` (or your preferred name)
   - **Database Password**: Create a strong password (SAVE THIS!)
   - **Region**: Select closest to your location
   - **Pricing Plan**: Free (sufficient for development)
4. Click **"Create new project"**
5. Wait 2-3 minutes for provisioning

### 2. Get API Credentials

1. Go to **Settings** (gear icon in sidebar) → **API**
2. Find these two values:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **Project API keys** → **`anon` `public`** (long JWT token, ~200+ chars)

3. Copy them to your `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.your-actual-key-here...
```

### 3. Create Admin User

**Option A: Using Supabase Dashboard (Recommended)**

1. Go to **Authentication** → **Users**
2. Click **"Add user"** → **"Create new user"**
3. Fill in:
   - **Email**: your-admin@example.com
   - **Password**: Create a secure password
   - **Auto Confirm User**: ✅ Enable
4. Click **"Create user"**

**Option B: Using SQL Editor**

1. Go to **SQL Editor** → Click **"New query"**
2. Paste this SQL:

```sql
-- Insert admin user
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'admin@ieee.edu',                          -- CHANGE THIS EMAIL
  crypt('admin123', gen_salt('bf')),         -- CHANGE THIS PASSWORD
  now(),
  '{"role": "admin", "name": "Admin User"}'::jsonb,
  now(),
  now(),
  '',
  '',
  '',
  ''
);
```

3. Click **"Run"**

### 4. Add Admin Role to User Metadata

**Important**: The user must have `role: "admin"` in their metadata.

1. Go to **Authentication** → **Users**
2. Click on your admin user
3. Scroll to **"User Metadata"** section
4. Click **"Edit"** and add:

```json
{
  "role": "admin",
  "name": "Admin User"
}
```

5. Click **"Save"**

### 5. Configure URL Allowed List (Optional but Recommended)

1. Go to **Authentication** → **URL Configuration**
2. Under **"Redirect URLs"**, add:
   ```
   http://localhost:3000/**
   http://localhost:3000/admin/**
   ```
3. Click **"Save"**

### 6. Create Events Table

1. Go to **Table Editor** → Click **"Create a new table"**
2. Table name: `events`
3. Add columns:
   - `id` (uuid, primary key, auto-generated)
   - `title` (text, required)
   - `description` (text)
   - `date` (timestamp with time zone)
   - `location` (text)
   - `image_url` (text)
   - `event_type` (text)
   - `created_at` (timestamp with time zone, default: now())
   - `updated_at` (timestamp with time zone, default: now())

### 7. Test Connection

1. Update `.env.local` with your real credentials
2. Restart dev server:
   ```bash
   # Stop current server (Ctrl+C)
   npm run dev
   ```
3. Visit `http://localhost:3000/login`
4. Login with your admin credentials
5. Should redirect to `/admin` dashboard

## 🔒 Security Checklist

- [ ] Real Supabase project created
- [ ] `.env.local` updated with real credentials
- [ ] `.env.local` is in `.gitignore` (already done)
- [ ] Admin user created with `role: "admin"` in metadata
- [ ] Test login/logout flow works
- [ ] Dashboard displays user email

## 🎯 Quick Verification

Run this test:

1. Clear browser cookies for localhost:3000
2. Visit `http://localhost:3000/admin`
   - Should redirect to `/login`
3. Enter admin credentials
   - Should redirect to `/admin` dashboard
4. Click "Logout"
   - Should redirect back to `/login`

## 🐛 Troubleshooting

### CORS Error / 525 Error
- ✅ Verify your Supabase project URL is correct
- ✅ Check that anon key is a long JWT token (~200+ chars)
- ✅ Ensure project is fully provisioned (check dashboard)

### "Invalid login credentials"
- ✅ Verify email/password are correct
- ✅ Check user exists in Authentication → Users
- ✅ Ensure "Auto Confirm User" was enabled

### Redirect to homepage instead of dashboard
- ✅ Check user metadata has `"role": "admin"`
- ✅ Verify metadata is valid JSON
- ✅ Check browser console for errors

### Can't access /admin even when logged in
- ✅ Clear browser cookies and try again
- ✅ Check Network tab for auth requests
- ✅ Verify session is being created

## 📚 Resources

- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [Supabase Dashboard](https://supabase.com/dashboard)
- [Next.js with Supabase](https://supabase.com/docs/guides/getting-started/quickstarts/nextjs)

---

**After setup is complete, you'll be ready to test the admin authentication system!**
