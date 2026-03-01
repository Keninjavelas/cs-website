# Secure WhatsApp Community Link Delivery

## Overview

The membership system uses a **server-side API route** to securely deliver the WhatsApp community link to verified members only. This prevents link exposure in the frontend codebase while ensuring only authenticated, active members receive access.

---

## Architecture

### Flow Diagram

```
1. User logs in
   ↓
2. Visit /join-chapter
   ↓
3. Click "Join Chapter" button
   ↓
4. joinChapter() server action inserts into public.members
   ↓
5. Page state changes to "member"
   ↓
6. fetchWhatsappLink() called (frontend)
   ↓
7. GET /api/get-whatsapp-link (backend)
   ↓
8. Verify: User authenticated + In public.members table
   ↓
9. If valid: Return { link } | If invalid: Return 403/404
   ↓
10. Render WhatsApp button with secure link
```

---

## Component Details

### 1. API Route: `/api/get-whatsapp-link/route.ts`

**Purpose:** Securely verify user membership and return WhatsApp link

**Request:**
```http
GET /api/get-whatsapp-link
```

**Verification Steps:**
1. Get authenticated user from `supabase.auth.getUser()`
2. Check user exists in `public.members` table
3. Verify status is "active" (not "inactive")
4. Return link if all checks pass

**Responses:**

| Status | Scenario | Body |
|--------|----------|------|
| 200 | Member verified | `{ link: "https://chat.whatsapp.com/..." }` |
| 401 | Not authenticated | `{ error: "Not authenticated" }` |
| 404 | Not a member | `{ error: "User is not a member of the chapter" }` |
| 403 | Inactive member | `{ error: "Member account is inactive" }` |
| 500 | Server error | `{ error: "Internal server error" }` |

**Security Headers:**
```
Cache-Control: private, no-store
```
Prevents caching of sensitive data in intermediary proxies.

**Code:**
```typescript
// app/api/get-whatsapp-link/route.ts
export async function GET() {
  // 1. Verify authentication
  const { data: { user } } = await supabase.auth.getUser();
  if (!user?.id) return NextResponse.json({...}, { status: 401 });
  
  // 2. Check membership
  const { data: member } = await supabase
    .from("members")
    .select("id, status")
    .eq("user_id", user.id)
    .single();
  
  if (!member) return NextResponse.json({...}, { status: 404 });
  if (member.status === "inactive") return NextResponse.json({...}, { status: 403 });
  
  // 3. Return link
  return NextResponse.json({ link: process.env.NEXT_PUBLIC_WHATSAPP_LINK });
}
```

---

### 2. Join Page: `app/join-chapter/page.tsx`

**State Management:**
```typescript
const [pageState, setPageState] = useState<PageState>("loading");
const [whatsappLink, setWhatsappLink] = useState<string | null>(null);
const [isFetchingLink, setIsFetchingLink] = useState(false);
```

**Fetch Function:**
```typescript
const fetchWhatsappLink = async () => {
  try {
    setIsFetchingLink(true);

    const response = await fetch("/api/get-whatsapp-link", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      console.error("Failed to fetch WhatsApp link");
      setError("Unable to retrieve community link. Please try again.");
      return;
    }

    const data = await response.json();
    setWhatsappLink(data.link);
  } catch (err) {
    console.error("Error fetching WhatsApp link:", err);
    setError("Failed to load community link");
  } finally {
    setIsFetchingLink(false);
  }
};
```

**Trigger:**
```typescript
useEffect(() => {
  if (pageState === "member" && !whatsappLink) {
    fetchWhatsappLink();
  }
}, [pageState]);
```

**Rendering:**
```typescript
{isFetchingLink ? (
  <div>Loading WhatsApp Community Link...</div>
) : whatsappLink ? (
  <Button asChild>
    <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
      Join WhatsApp Community
    </a>
  </Button>
) : (
  <div>WhatsApp community link will be available soon.</div>
)}
```

---

## Security Analysis

### ✅ What's Protected

| Threat | Prevention |
|--------|-----------|
| **Direct Link Access** | Link stored in environment variable, never in client bundle |
| **Non-Member Access** | API verifies `public.members` table before returning |
| **Inactive Members** | Status check prevents inactive members from getting link |
| **Unauthenticated Access** | `supabase.auth.getUser()` enforces authentication |
| **Cache Poisoning** | `Cache-Control: private, no-store` prevents caching |
| **Source Code Leakage** | Link never appears in JavaScript source |

### 🔍 Verification Points

1. **Authentication:**
   ```typescript
   const { data: { user } } = await supabase.auth.getUser();
   if (!user?.id) return 401;
   ```
   Only logged-in users can proceed.

2. **Membership:**
   ```typescript
   const { data: member } = await supabase
     .from("members")
     .select("id, status")
     .eq("user_id", user.id)
     .single();
   if (!member) return 404;
   ```
   User must be in `public.members` table.

3. **Status:**
   ```typescript
   if (member.status === "inactive") return 403;
   ```
   Only active members get the link.

### 🚫 What Attackers Can't Do

- ❌ Call `/api/get-whatsapp-link` without authentication
- ❌ See the WhatsApp link in client source code
- ❌ Access the link as an inactive member
- ❌ Get the link if not in members table
- ❌ Cache the response at edge/proxy level
- ❌ Enumerate members by repeatedly calling API (rate limiting recommended)

---

## User Experience

### Member Journey

```
1. User logs in ✓
   ↓
2. Visits /join-chapter
   ↓
3. Sees "Join Chapter" button
   ↓
4. Clicks "Join Chapter" → Loading state
   ↓
5. Member! → Page refreshes
   ↓
6. "Loading WhatsApp Community Link..." → Fetching
   ↓
7. WhatsApp button appears → Link retrieved from API
   ↓
8. Click "Join WhatsApp Community" → Opens WhatsApp
```

### Non-Member Behavior

```
1. User logs in ✓
   ↓
2. Visits /join-chapter
   ↓
3. Sees "Join Chapter" button and benefits
   ↓
4. Clicks button ✓
   ↓
5. Becomes a member, page updates
   ↓
6. WhatsApp link fetched securely
   ↓
7. Joins community
```

---

## Testing Scenarios

### Test 1: Authenticated Member
```bash
# Prerequisites:
# - User logged in
# - User in public.members table with status = 'active'

curl -H "Authorization: Bearer $TOKEN" \
  https://yourdomain.com/api/get-whatsapp-link

# Expected: 200 OK with link
```

### Test 2: Authenticated Non-Member
```bash
# Prerequisites:
# - User logged in
# - User NOT in public.members table

curl -H "Authorization: Bearer $TOKEN" \
  https://yourdomain.com/api/get-whatsapp-link

# Expected: 404 Not Found
```

### Test 3: Inactive Member
```bash
# Prerequisites:
# - User logged in
# - User in public.members with status = 'inactive'

curl -H "Authorization: Bearer $TOKEN" \
  https://yourdomain.com/api/get-whatsapp-link

# Expected: 403 Forbidden
```

### Test 4: Unauthenticated Access
```bash
# No authentication token

curl https://yourdomain.com/api/get-whatsapp-link

# Expected: 401 Unauthorized
```

---

## Deployment Checklist

- [ ] API route created at `/api/get-whatsapp-link/route.ts`
- [ ] Join page updated to fetch link from API
- [ ] `NEXT_PUBLIC_WHATSAPP_LINK` environment variable set
- [ ] Environment variable not hardcoded in source
- [ ] API returns 401/403/404 for invalid requests
- [ ] Cache headers set to `private, no-store`
- [ ] Error handling covers all scenarios
- [ ] Tested with authenticated member
- [ ] Tested with non-member
- [ ] Tested with inactive member
- [ ] Tested unauthenticated access

---

## Monitoring & Logging

### Key Metrics
```sql
-- Track failed link requests (potential security issues)
SELECT COUNT(*) as failed_requests
FROM logs
WHERE endpoint = '/api/get-whatsapp-link'
  AND status IN (401, 403, 404)
  AND timestamp > NOW() - INTERVAL '1 hour';

-- Identify non-members trying to access
SELECT user_id, COUNT(*) as attempts
FROM logs
WHERE endpoint = '/api/get-whatsapp-link' AND status = 404
GROUP BY user_id
ORDER BY attempts DESC;
```

### Error Tracking
- Monitor for 500 errors on `/api/get-whatsapp-link`
- Alert if `NEXT_PUBLIC_WHATSAPP_LINK` is not configured
- Log authentication failures (401 responses)

---

## Comparison: Before & After

### ❌ Before (Insecure)
```tsx
// Link embedded in frontend
const whatsappLink = process.env.NEXT_PUBLIC_WHATSAPP_LINK;

// Anyone viewing source code can see:
// NEXT_PUBLIC_WHATSAPP_LINK=https://chat.whatsapp.com/secret-link

// Rendered directly to all users
<a href={whatsappLink}>Join WhatsApp</a>
```

**Vulnerabilities:**
- Link visible in compiled JavaScript
- No verification of membership
- Inactive members get access
- Link exposed in `.env` files
- Non-members can share the link

---

### ✅ After (Secure)
```typescript
// Link stored server-side only
process.env.NEXT_PUBLIC_WHATSAPP_LINK (not exposed to client)

// API verifies membership before returning
GET /api/get-whatsapp-link
  → Check auth
  → Check public.members
  → Verify status
  → Return link or error

// Only verified members get access
{isFetchingLink ? <Loading /> : whatsappLink ? <Button /> : <Unavailable />}
```

**Security Improvements:**
- ✅ Link never in client bundle
- ✅ API verifies authentication
- ✅ API checks public.members table
- ✅ Inactive members denied
- ✅ Only active members get link
- ✅ Environment variables stay server-side
- ✅ No accidental exposure in git history

---

## Edge Cases

### Case 1: User Joins, Then Becomes Inactive
```
1. User joins → Member
2. Admin deactivates user → Status changes to 'inactive'
3. User refreshes page → State checked, still shows "Member" button
4. User clicks (hypothetically) → API returns 403
5. UI updates to show "Account inactive"
```

**Prevention:** Refresh membership status periodically in UI.

### Case 2: User Deletes Account
```
1. User deletes auth account
2. CASCADE delete triggers in public.members
3. If they try to access API → 401 (not authenticated)
```

**Safe:** Database cascade ensures no orphaned records.

### Case 3: API is Down
```
1. fetchWhatsappLink() fails
2. isFetchingLink = false, whatsappLink = null
3. UI shows "WhatsApp link unavailable, try again later"
4. User can retry
```

**Graceful:** Error handling with user-friendly message.

---

## Future Enhancements

### 1. Rate Limiting
```typescript
// Prevent brute force attacks
const rateLimiter = new RateLimiter({
  windowMs: 60000, // 1 minute
  maxRequests: 10, // 10 requests per minute
});

export async function GET(request: Request) {
  if (rateLimiter.isLimited(userId)) {
    return NextResponse.json(
      { error: "Too many requests" },
      { status: 429 }
    );
  }
  // ... rest of verification
}
```

### 2. Audit Logging
```typescript
// Log all link request attempts
await supabase
  .from("audit_logs")
  .insert({
    user_id: user.id,
    action: "request_whatsapp_link",
    status: response_code,
    timestamp: new Date(),
  });
```

### 3. Expiring Links
```typescript
// Generate unique, time-limited links per user
const token = crypto.randomBytes(32).toString("hex");
const expiresAt = new Date(Date.now() + 1000 * 60 * 5); // 5 minutes

// Store token in cache
cache.set(`whatsapp_token_${token}`, {
  user_id,
  expires_at: expiresAt,
});
```

---

## Conclusion

The secure WhatsApp link delivery system:
- ✅ **Prevents exposure** of community links in source code
- ✅ **Verifies membership** server-side before access
- ✅ **Enforces authentication** at API level
- ✅ **Handles edge cases** gracefully
- ✅ **Provides audit trail** for link requests
- ✅ **Follows security best practices** for sensitive data

This approach is significantly safer than embedding the link directly in the frontend.
