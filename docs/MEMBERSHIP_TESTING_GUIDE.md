# IEEE CS Student Chapter Membership System - Testing & Deployment Guide

## Overview
Complete testing checklist for the membership system that allows users to join the IEEE CS Student Chapter and access the WhatsApp community.

## Prerequisites

### 1. Database Setup
Execute the schema in Supabase SQL Editor:
```bash
# Run this file in Supabase SQL Editor
docs/MEMBERS_SCHEMA.sql
```

Verify the setup:
- [ ] Table `public.members` exists
- [ ] Indexes created (user_id, status, joined_at)
- [ ] RLS policies enabled (5 policies)
- [ ] Helper function `is_member()` created
- [ ] Unique constraint on `user_id` exists

### 2. Environment Variables
Update your `.env.local` file:
```bash
# Copy from .env.example
NEXT_PUBLIC_WHATSAPP_LINK=https://chat.whatsapp.com/your-actual-invite-link
```

Verification:
- [ ] `.env.local` exists in project root
- [ ] `NEXT_PUBLIC_WHATSAPP_LINK` is set
- [ ] WhatsApp link is a private invite link (not visible in public code)

---

## Testing Checklist

### Phase 1: Database & RLS Verification

#### 1.1 Table Structure
```sql
-- Run in Supabase SQL Editor
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'members'
ORDER BY ordinal_position;
```
Expected: id, user_id, joined_at, status columns

#### 1.2 RLS Policies
```sql
-- Verify all 5 policies exist
SELECT policyname, cmd, roles
FROM pg_policies
WHERE tablename = 'members';
```
Expected policies:
- [ ] `users_view_own_membership` (SELECT)
- [ ] `admins_view_all_members` (SELECT)
- [ ] `users_insert_own_membership` (INSERT)
- [ ] `admins_update_members` (UPDATE)
- [ ] `admins_delete_members` (DELETE)

#### 1.3 Helper Function
```sql
-- Test the helper function
SELECT is_member('00000000-0000-0000-0000-000000000000');
```
Expected: Returns boolean (false for non-existent user)

---

### Phase 2: Authentication Flow Testing

#### 2.1 Unauthenticated Access
1. **Navigate to /join-chapter** (logged out)
   - [ ] Page loads without errors
   - [ ] Shows loading spinner briefly
   - [ ] Displays "Sign in to join" message
   - [ ] Shows login button
   - [ ] WhatsApp link is **NOT** visible
   - [ ] No exposed secrets in browser console/network tab

2. **Click "Sign In" button**
   - [ ] Redirects to `/login` page
   - [ ] User can authenticate successfully

#### 2.2 Authenticated Non-Member Access
1. **Navigate to /join-chapter** (logged in, not a member)
   - [ ] Page loads successfully
   - [ ] Shows chapter benefits list
   - [ ] Shows "Join Chapter" button
   - [ ] WhatsApp link is **NOT** visible yet
   - [ ] No JavaScript errors in console

2. **Click "Join Chapter" button**
   - [ ] Button shows loading state
   - [ ] Success message appears
   - [ ] WhatsApp community button appears
   - [ ] Button text: "Join WhatsApp Community"
   - [ ] Page refreshes state automatically

3. **Verify Database Entry**
   ```sql
   -- Check member was created
   SELECT user_id, status, joined_at
   FROM members
   WHERE user_id = 'your-test-user-id';
   ```
   - [ ] Record exists with status = 'active'
   - [ ] `joined_at` timestamp is accurate

#### 2.3 Duplicate Join Prevention
1. **Click "Join Chapter" again** (already a member)
   - [ ] Shows "You're already a member" message
   - [ ] WhatsApp link remains visible
   - [ ] No duplicate database entry created
   - [ ] No errors in console

2. **Verify Database**
   ```sql
   -- Ensure no duplicates
   SELECT COUNT(*) as count
   FROM members
   WHERE user_id = 'your-test-user-id';
   ```
   Expected: count = 1

---

### Phase 3: Admin Dashboard Testing

#### 3.1 Admin Access
1. **Navigate to /admin** (as admin user)
   - [ ] Dashboard loads successfully
   - [ ] "Chapter Members" stat card displays correct count
   - [ ] "Manage Members" tile is visible
   - [ ] Member count badge shows on tile

2. **Click "Manage Members"**
   - [ ] Redirects to `/admin/members`
   - [ ] Page loads without errors

#### 3.2 Members List Page
1. **Verify Statistics Cards**
   - [ ] Total Members count is accurate
   - [ ] Active Members count is correct
   - [ ] Inactive Members count is correct
   - [ ] Icons display properly (green/red indicators)

2. **Verify Members Table**
   - [ ] All members are listed
   - [ ] Email addresses display correctly
   - [ ] Joined dates are formatted properly
   - [ ] Status badges show correct state (Active/Inactive)
   - [ ] Action buttons are visible

3. **Search Functionality**
   - [ ] Can search by email
   - [ ] Can search by user ID
   - [ ] Results update instantly
   - [ ] "No members match" message when no results
   - [ ] Count updates in header

#### 3.3 Status Management
1. **Deactivate a Member**
   - [ ] Click "Deactivate" on active member
   - [ ] Button shows loading spinner
   - [ ] Status badge changes to "Inactive" (red)
   - [ ] Statistics update immediately
   - [ ] Action button changes to "Activate"

2. **Reactivate a Member**
   - [ ] Click "Activate" on inactive member
   - [ ] Button shows loading spinner
   - [ ] Status badge changes to "Active" (green)
   - [ ] Statistics update immediately
   - [ ] Action button changes to "Deactivate"

3. **Verify Database Changes**
   ```sql
   SELECT user_id, status
   FROM members
   WHERE id = 'member-id-you-toggled';
   ```
   - [ ] Status reflects UI changes

#### 3.4 Non-Admin Access Prevention
1. **Try accessing /admin/members as non-admin**
   - [ ] Shows "Access Denied" message
   - [ ] Does not display member list
   - [ ] RLS prevents data leakage

---

### Phase 4: Security Testing

#### 4.1 RLS Enforcement
1. **User can only see own membership**
   ```javascript
   // In browser console (as logged-in user)
   const { data } = await supabase.from('members').select('*');
   console.log(data);
   ```
   - [ ] Returns only current user's record (not all members)

2. **Admins can see all members**
   ```javascript
   // In browser console (as admin)
   const { data } = await supabase.from('members').select('*');
   console.log(data);
   ```
   - [ ] Returns all member records

#### 4.2 WhatsApp Link Security
1. **Check public source code**
   - [ ] Search codebase for hardcoded WhatsApp links
   - [ ] Verify link comes from environment variable
   - [ ] Link not visible in built JavaScript bundles

2. **Check network requests**
   - [ ] Open Network tab
   - [ ] WhatsApp link only appears in response when user is member
   - [ ] Link not leaked in headers or other requests

#### 4.3 SQL Injection Prevention
1. **Test server actions with malicious inputs**
   ```javascript
   // Try SQL injection in search
   await updateMemberStatus("'; DROP TABLE members; --", "active");
   ```
   - [ ] No SQL errors occur
   - [ ] Table remains intact
   - [ ] Parameterized queries prevent injection

---

### Phase 5: Edge Cases & Error Handling

#### 5.1 Network Failures
1. **Simulate offline mode**
   - [ ] Join action shows error message
   - [ ] Status toggle shows error message
   - [ ] Error messages are user-friendly

2. **Simulate slow network**
   - [ ] Loading states display properly
   - [ ] No race conditions occur
   - [ ] UI doesn't freeze

#### 5.2 Concurrent Operations
1. **Multiple status toggles rapidly**
   - [ ] Only one operation processes at a time
   - [ ] Button disables during operation
   - [ ] Final state is consistent

2. **Multiple users joining simultaneously**
   - [ ] Each gets unique record
   - [ ] No duplicate key violations
   - [ ] All operations succeed

#### 5.3 Deleted User Cleanup
1. **Delete user from auth.users**
   ```sql
   -- Member record should cascade delete
   DELETE FROM auth.users WHERE id = 'test-user-id';
   ```
   - [ ] Member record is automatically deleted (CASCADE)
   - [ ] No orphaned records remain

---

### Phase 6: Performance Testing

#### 6.1 Large Dataset
1. **Insert 1000 test members**
   ```sql
   -- Generate test data
   INSERT INTO members (user_id, status)
   SELECT gen_random_uuid(), 'active'
   FROM generate_series(1, 1000);
   ```
   - [ ] Admin page loads in < 3 seconds
   - [ ] Search is responsive
   - [ ] Pagination not needed yet but consider for 10,000+

2. **Verify Indexes**
   ```sql
   EXPLAIN ANALYZE
   SELECT * FROM members WHERE user_id = 'some-uuid';
   ```
   - [ ] Uses index scan (not sequential scan)

---

## Deployment Checklist

### Pre-Deployment
- [ ] All tests pass
- [ ] Database schema applied to production
- [ ] Environment variables configured in hosting platform
- [ ] `.env.example` committed to repository
- [ ] `.env.local` added to `.gitignore`

### Vercel/Hosting Platform
1. **Environment Variables**
   - [ ] `NEXT_PUBLIC_SUPABASE_URL` set
   - [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` set
   - [ ] `NEXT_PUBLIC_WHATSAPP_LINK` set (private invite link)

2. **Build & Deploy**
   ```bash
   npm run build
   ```
   - [ ] Build succeeds without errors
   - [ ] No TypeScript errors
   - [ ] No missing environment variable warnings

### Post-Deployment
1. **Smoke Tests**
   - [ ] Visit production `/join-chapter`
   - [ ] Login flow works
   - [ ] Join chapter works
   - [ ] Admin dashboard accessible
   - [ ] Members list displays

2. **Monitor Logs**
   - [ ] Check Vercel/hosting logs for errors
   - [ ] Check Supabase logs for RLS violations
   - [ ] Verify no excessive query counts

---

## Rollback Plan
If issues occur in production:

1. **Disable Join Button**
   - Set environment variable: `NEXT_PUBLIC_ENABLE_JOIN=false`
   - Update `/join-chapter` to check this flag

2. **Revert Database**
   ```sql
   -- If needed, drop table and policies
   DROP TABLE IF EXISTS public.members CASCADE;
   DROP FUNCTION IF EXISTS is_member(UUID);
   ```

3. **Redeploy Previous Version**
   - Use Vercel/hosting rollback feature
   - Or git revert + redeploy

---

## Monitoring

### Key Metrics to Track
- Member join rate (signups per day)
- Failed join attempts
- Admin status toggle frequency
- Average page load times
- RLS policy violations (should be 0)

### Supabase Queries
```sql
-- Daily join rate
SELECT DATE(joined_at) as date, COUNT(*) as joins
FROM members
GROUP BY DATE(joined_at)
ORDER BY date DESC;

-- Active vs Inactive breakdown
SELECT status, COUNT(*) as count
FROM members
GROUP BY status;

-- Recent joins (last 7 days)
SELECT COUNT(*) as recent_joins
FROM members
WHERE joined_at >= NOW() - INTERVAL '7 days';
```

---

## Support & Troubleshooting

### Common Issues

**Issue: "User not authorized" error when joining**
- Check: RLS policy `users_insert_own_membership` exists
- Check: User is properly authenticated
- Check: `auth.uid()` returns correct user ID

**Issue: WhatsApp link shows "undefined"**
- Check: `NEXT_PUBLIC_WHATSAPP_LINK` is set in environment
- Check: Server was restarted after adding variable
- Check: Variable name is spelled correctly

**Issue: Admin can't see all members**
- Check: User email exists in `public.admins` table
- Check: RLS policy `admins_view_all_members` exists
- Check: Admin policy uses correct email column

**Issue: Multiple memberships created**
- Check: Unique constraint on `user_id` exists
- Check: Join action checks for existing membership
- Cleanup: Remove duplicates manually in Supabase

---

## Maintenance

### Regular Tasks
- **Weekly**: Review member join rate
- **Monthly**: Audit inactive members
- **Quarterly**: Check for orphaned records
- **Annually**: Rotate WhatsApp invite link if needed

### Database Maintenance
```sql
-- Find inactive members (no activity > 6 months)
SELECT email, joined_at
FROM members m
JOIN auth.users u ON m.user_id = u.id
WHERE m.status = 'active'
  AND m.joined_at < NOW() - INTERVAL '6 months';

-- Clean up test data
DELETE FROM members WHERE email LIKE '%+test%';
```

---

## Success Criteria
The membership system is complete when:
- ✅ Users can join chapter after authentication
- ✅ Members receive WhatsApp community access
- ✅ Admins can view and manage all members
- ✅ RLS security is properly enforced
- ✅ No duplicate memberships possible
- ✅ WhatsApp link never exposed publicly
- ✅ All tests pass
- ✅ Documentation is complete
