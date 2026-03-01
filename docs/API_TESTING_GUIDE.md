# Testing the Secure WhatsApp Link API

## Overview
This guide helps you verify that the `/api/get-whatsapp-link` endpoint is working correctly and properly protecting the community link.

---

## Quick Test: Browser Console

### Test 1: As an Authenticated Member

1. **Login to your app**
   - Navigate to `/login`
   - Sign in with a test account

2. **Join the chapter**
   - Navigate to `/join-chapter`
   - Click "Join Chapter" button
   - Wait for success message

3. **Test the API**
   ```javascript
   // In browser console (F12)
   fetch('/api/get-whatsapp-link')
    .then(r => r.json())
    .then(d => console.log(d))
   ```

   **Expected Output:**
   ```json
   {
     "link": "https://chat.whatsapp.com/abcdef123456"
   }
   ```

---

### Test 2: As a Non-Member (Authenticated)

1. **Login with a different account** that hasn't joined
   - Sign in with another test account

2. **Try to access the API directly**
   ```javascript
   fetch('/api/get-whatsapp-link')
    .then(r => r.json())
    .then(d => console.log(d))
   ```

   **Expected Output (404):**
   ```json
   {
     "error": "User is not a member of the chapter"
   }
   ```

   **Expected Status Code:** 404

---

### Test 3: Without Authentication (Unauthenticated)

1. **Logout completely**
   - Close all browser tabs with the app open
   - Clear authentication cookies

2. **Try to access the API**
   ```javascript
   fetch('/api/get-whatsapp-link')
    .then(r => r.json())
    .then(d => console.log(d))
   ```

   **Expected Output (401):**
   ```json
   {
     "error": "Not authenticated"
   }
   ```

   **Expected Status Code:** 401

---

## Advanced Testing: cURL Commands

### Prerequisites
```bash
# Get your Supabase auth session token
# 1. Login to your app
# 2. Open DevTools → Application → Cookies → Find auth token
# Copy the token value
```

### Test as Authenticated Member

```bash
curl -i \
  -H "Authorization: Bearer YOUR_AUTH_TOKEN" \
  https://yourdomain.com/api/get-whatsapp-link
```

**Expected:**
```
HTTP/1.1 200 OK
Content-Type: application/json
Cache-Control: private, no-store

{"link": "https://chat.whatsapp.com/..."}
```

---

### Test as Non-Member

```bash
curl -i \
  -H "Authorization: Bearer DIFFERENT_USER_TOKEN" \
  https://yourdomain.com/api/get-whatsapp-link
```

**Expected:**
```
HTTP/1.1 404 Not Found
Content-Type: application/json

{"error": "User is not a member of the chapter"}
```

---

### Test Without Authentication

```bash
curl -i https://yourdomain.com/api/get-whatsapp-link
```

**Expected:**
```
HTTP/1.1 401 Unauthorized
Content-Type: application/json

{"error": "Not authenticated"}
```

---

## Visual Testing: Browser DevTools

### Step 1: Open DevTools
- Press `F12` or `Right-click → Inspect`
- Go to **Network** tab

### Step 2: Clear Previous Requests
- Click the trash icon to clear network log

### Step 3: Join Chapter (As Non-Member)
1. Navigate to `/join-chapter`
2. Click "Join Chapter" button
3. Watch the Network tab

**You should see:**
- `POST /api/join-chapter` or similar (the join action)
- `GET /api/get-whatsapp-link` (the link fetch)

### Step 4: Check the Response

1. Click on the `get-whatsapp-link` request
2. **Headers tab:**
   - ✅ Should see `Cache-Control: private, no-store`
   - ✅ Status should be 200

3. **Response tab:**
   - ✅ Should contain `link: "https://chat.whatsapp.com/..."`
   - ✅ Should NOT contain the actual link in other requests

4. **Preview tab:**
   - ✅ Shows the parsed JSON response

---

## Security Verification Tests

### Test 1: Link Not in HTML Source

1. Navigate to `/join-chapter` (as member)
2. Right-click → "View Page Source"
3. Search for `chat.whatsapp.com`

**Expected:** ❌ NOT found
- Link should only appear in API response, not in HTML

### Test 2: Link Not in JavaScript Variables

1. Navigate to `/join-chapter` (as member)
2. Open DevTools console
3. Type:
   ```javascript
   // Try to find the link in global scope
   console.log(window.whatsappLink)
   console.log(window.WHATSAPP_LINK)
   console.log(process.env.NEXT_PUBLIC_WHATSAPP_LINK)
   ```

**Expected:** ❌ All should be `undefined`
- Link is only stored in React state, not accessible globally

### Test 3: Inactive Member Cannot Access

1. **Setup:**
   - Have a member account
   - Admin deactivates the member (toggle status)

2. **Test:**
   ```javascript
   fetch('/api/get-whatsapp-link')
    .then(r => r.json())
    .then(d => console.log(d))
   ```

   **Expected Output (403):**
   ```json
   {
     "error": "Member account is inactive"
   }
   ```

### Test 4: Cache Headers

1. Navigate to `/join-chapter` (as member)
2. Open DevTools → Network tab
3. Find the `get-whatsapp-link` request
4. Click on it
5. Go to **Headers** tab → **Response Headers**

**Expected:**
```
cache-control: private, no-store
```

This prevents proxies and CDNs from caching sensitive data.

---

## Load Testing (Optional)

Test that the API can handle concurrent requests:

```bash
# Install Apache Bench (if not installed)
# Windows: Download from apache.org
# Mac: brew install httpd
# Linux: sudo apt-get install apache2-utils

# Test with 100 requests, 10 concurrent
ab -n 100 -c 10 \
  -H "Authorization: Bearer YOUR_AUTH_TOKEN" \
  https://yourdomain.com/api/get-whatsapp-link

# Expected: All requests succeed (200 OK)
# Response time should be < 1 second per request
```

---

## Debugging: If Tests Fail

### Issue: 500 Internal Server Error

**Cause:** Missing environment variable

**Fix:**
```bash
# Check .env.local exists
ls -la .env.local

# Verify NEXT_PUBLIC_WHATSAPP_LINK is set
grep WHATSAPP .env.local

# Restart dev server
# Ctrl+C (cancel)
npm run dev
```

### Issue: Always Returns 404 (Not a Member)

**Cause:** User not inserted into public.members table

**Fix:**
1. Verify you completed the join action
2. Check database directly:
   ```sql
   -- In Supabase SQL Editor
   SELECT * FROM public.members
   WHERE user_id = 'your-user-id';
   ```
3. If empty, your join action didn't succeed

### Issue: Returns 403 (Inactive Member)

**Cause:** User status is "inactive"

**Fix:**
1. In admin panel (`/admin/members`)
2. Find your test user
3. Click "Activate" button
4. Try API again

### Issue: 401 (Not Authenticated)

**Cause:** Session expired or not logged in

**Fix:**
1. Clear browser cookies
2. Login again
3. Repeat test

---

## Test Checklist

Use this checklist to verify the API is secure:

- [ ] Member can fetch link (200 OK)
- [ ] Non-member gets 404
- [ ] Unauthenticated gets 401
- [ ] Inactive member gets 403
- [ ] Cache headers present
- [ ] Link NOT in HTML source
- [ ] Link NOT in browser console variables
- [ ] Link NOT in other network requests
- [ ] API responds < 1 second
- [ ] No errors in Supabase logs

---

## Production Testing

Before deploying to production:

1. **Deploy to staging environment**
   ```bash
   npm run build
   npm run deploy --environment=staging
   ```

2. **Run all tests from this guide** on staging URL

3. **Monitor API logs** for any errors

4. **Test with real users** (if available for beta)

5. **Check Supabase logs** for RLS violations

6. **Deploy to production** once all tests pass

---

## Monitoring After Deployment

### Daily Checks
```sql
-- Check for failed link requests (security issues)
SELECT count(*), status
FROM logs
WHERE endpoint = '/api/get-whatsapp-link'
  AND created_at > NOW() - INTERVAL '24 hours'
GROUP BY status;
```

### Weekly Checks
```sql
-- Verify no orphaned members (auth.users deleted)
SELECT count(*)
FROM public.members m
LEFT JOIN auth.users u ON m.user_id = u.id
WHERE u.id IS NULL;
```

### Monthly Checks
1. Review audit logs for suspicious activity
2. Check for failed authentication attempts
3. Verify no members are stuck "inactive"
4. Update WhatsApp link if needed

---

## Support

If tests fail or you encounter issues:

1. **Check Supabase logs:** Supabase Dashboard → Logs
2. **Check application logs:** Vercel/hosting dashboard
3. **Debug in browser:** DevTools → Console → Look for errors
4. **Verify schema:** Supabase Dashboard → SQL Editor
   ```sql
   SELECT * FROM public.members LIMIT 1;
   ```

---

## Summary

The `/api/get-whatsapp-link` endpoint is **working correctly** when:

✅ Members receive the WhatsApp link (200 OK)  
✅ Non-members get told they're not members (404)  
✅ Unauthenticated users get 401  
✅ Inactive members get 403  
✅ Link never appears in frontend code  
✅ No caching of sensitive data  
✅ All responses < 1 second  

If all tests pass, your secure join flow is production-ready! 🎉
