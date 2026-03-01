# Error Handling Implementation Guide

## Overview
This document outlines the robust error handling system implemented across the application to prevent crashes and improve user experience when Supabase fails or data is unavailable.

---

## Part 1: Global Error Page

**File**: [`app/error.tsx`](app/error.tsx)

### Purpose
Catches unhandled errors in the application and displays a user-friendly error page.

### Features
- ✅ Clean fallback UI with icon
- ✅ "Try Again" button to reset error
- ✅ "Back to Home" navigation link
- ✅ Development mode shows error details
- ✅ Error digest for debugging (if provided)

### Usage
This error page automatically handles any errors thrown in Server Components within the same segment or nested segments.

```tsx
// In a Server Component, just throw if something goes wrong
if (unexpectedCondition) {
  throw new Error("Something went wrong");
}
```

### Example Error States
- Network failures
- Supabase connection issues
- Unexpected runtime errors
- JSON parsing failures

---

## Part 2: 404 Not Found Page

**File**: [`app/not-found.tsx`](app/not-found.tsx)

### Purpose
Handles requests for pages that don't exist.

### Features
- ✅ Professional 404 design with large number
- ✅ Decorative accent line
- ✅ "Back to Home" navigation
- ✅ "Browse Events" quick link
- ✅ "Contact Us" support link

### Usage
```tsx
import { notFound } from "next/navigation";

export default function Page() {
  if (!resource) {
    notFound(); // Displays 404 page
  }
  return <div>Content</div>;
}
```

---

## Part 3: Safe Data Fetching Pattern

**File**: [`lib/safe-fetch.ts`](lib/safe-fetch.ts)

### Purpose
Provides utility functions for safe Supabase queries with built-in error handling.

### Available Functions

#### `safeFetchQuery<T>(queryFn): Promise<FetchResult<T>>`
Safely fetch multiple records from Supabase.

```tsx
const result = await safeFetchQuery<Announcement>(async (supabase) => {
  return await supabase
    .from("announcements")
    .select("id, title, slug, content, created_at")
    .eq("is_published", true)
    .order("created_at", { ascending: false });
});

// Result structure
{
  data: Announcement[] | null,      // Array of records or null on error
  error: Error | null,               // Error object or null on success
  isEmpty: boolean                   // True if data is empty array
}
```

#### `safeFetchSingle<T>(queryFn): Promise<{ data: T | null; error: Error | null }>`
Safely fetch a single record from Supabase.

```tsx
const result = await safeFetchSingle<Announcement>(async (supabase) => {
  return await supabase
    .from("announcements")
    .select("id, title, slug, content, created_at")
    .eq("slug", slug)
    .eq("is_published", true)
    .single();
});
```

#### `getErrorMessage(error: Error | null): string`
User-friendly error messages based on error type.

```tsx
const message = getErrorMessage(result.error);
// Returns appropriate message for:
// - Network errors
// - Authorization errors (401/403)
// - Not found errors (404)
// - Generic errors
```

### Error Handling Patterns

**Pattern 1: Check for error first**
```tsx
if (result.error) {
  return <ErrorComponent error={result.error} />;
}
```

**Pattern 2: Check for empty data**
```tsx
if (result.isEmpty) {
  return <EmptyStateComponent />;
}
```

**Pattern 3: Render data**
```tsx
return (
  <div>
    {result.data?.map((item) => (
      <Item key={item.id} data={item} />
    ))}
  </div>
);
```

---

## Part 4: Empty State Component

**File**: [`components/EmptyState.tsx`](components/EmptyState.tsx)

### Purpose
Reusable component for displaying clean empty states and error messages across the application.

### Props

```tsx
interface EmptyStateProps {
  icon?: "inbox" | "alert";           // Icon type: inbox (empty) or alert (error)
  title: string;                       // Main heading
  description: string;                 // Supporting text
  actionHref?: string;                 // Primary button link
  actionLabel?: string;                // Primary button text
  showBackButton?: boolean;             // Show secondary "Back to Home" button
}
```

### Usage Examples

**Empty Data State**
```tsx
<EmptyState
  icon="inbox"
  title="No Announcements Yet"
  description="We'll share important updates and announcements here. Check back soon!"
  actionHref="/"
  actionLabel="Back to Home"
/>
```

**Error State**
```tsx
<EmptyState
  icon="alert"
  title="Unable to Load Team Members"
  description={getErrorMessage(result.error)}
  actionHref="/team"
  actionLabel="Try Again"
  showBackButton={true}
/>
```

### Visual Features
- ✅ Rounded icon background
- ✅ Clear typography hierarchy
- ✅ Responsive button layout
- ✅ Muted color scheme for empty states
- ✅ Alert color scheme for errors

---

## Part 5: Skeleton Loading Components

**File**: [`components/ui/skeleton.tsx`](components/ui/skeleton.tsx)

### Purpose
Provides placeholder components for loading states while data is being fetched.

### Available Components

```tsx
// Basic skeleton for small elements
<Skeleton className="h-6 w-2/3" />

// Card skeleton
<CardSkeleton />

// Event card skeleton
<EventCardSkeleton />

// Announcement card skeleton
<AnnouncementCardSkeleton />

// Grid of skeletons
<PageSkeletonGrid count={6} />
```

### Implementation
```tsx
import { CardSkeleton, PageSkeletonGrid } from "@/components/ui/skeleton";

export default function LoadingPage() {
  return <PageSkeletonGrid count={6} />;
}
```

---

## Part 6: Updated Pages with Error Handling

### Announcements Page
**File**: [`app/announcements/page.tsx`](app/announcements/page.tsx)

```
Flow:
1. Fetch data with safeFetchQuery
2. Check for errors → Show EmptyState with alert icon
3. Check if empty → Show EmptyState with inbox icon
4. Render announcements list
```

### Announcements Detail Page
**File**: [`app/announcements/[slug]/page.tsx`](app/announcements/%5Bslug%5D/page.tsx)

```
Flow:
1. Fetch single announcement with safeFetchSingle
2. Check for errors → Show EmptyState in page
3. Check if not found → Call notFound() for 404
4. Render announcement with Markdown
```

### Team Page
**File**: [`app/team/page.tsx`](app/team/page.tsx)

```
Flow:
1. Fetch team members with safeFetchQuery
2. Check for errors → Show EmptyState with alert
3. Check if empty → Show EmptyState with inbox
4. Render team member cards
```

### Achievements Page
**File**: [`app/achievements/page.tsx`](app/achievements/page.tsx)

```
Flow:
1. Fetch achievements with safeFetchQuery
2. Check for errors → Show EmptyState with alert
3. Check if empty → Show EmptyState with inbox
4. Render achievement cards with images
```

---

## Error Handling Decision Tree

```
User requests data
    ↓
Query Supabase with safeFetchQuery/safeFetchSingle
    ↓
    ├─ Connection/Network Error?
    │  └─ Show Error EmptyState: "Connection error..."
    │
    ├─ Authorization Error (401/403)?
    │  └─ Show Error EmptyState: "Permission denied..."
    │
    ├─ Not Found Error (404)?
    │  └─ Show Error EmptyState: "Content not found..."
    │
    ├─ Unknown Error?
    │  └─ Show Error EmptyState: "Try again later..."
    │
    ├─ Data is empty?
    │  └─ Show Empty EmptyState: "No data available..."
    │
    └─ Data exists?
       └─ Render content normally
```

---

## Best Practices

### ✅ Do's
- Always wrap Supabase queries with `safeFetchQuery` or `safeFetchSingle`
- Use `getErrorMessage()` to convert technical errors to user-friendly text
- Check for both `error` and `isEmpty` states
- Show appropriate empty states for different scenarios
- Log errors to console in development mode
- Provide "Try Again" buttons for transient failures

### ❌ Don'ts
- Don't use raw Supabase queries without error handling
- Don't show technical error messages to users
- Don't crash the app when data is unavailable
- Don't override the global error.tsx without good reason
- Don't forget to handle the `null` case in optional queries

---

## Testing Error Scenarios

### Simulate Supabase Connection Error
```tsx
// In your code during development
if (process.env.NODE_ENV === "development" && Math.random() < 0.1) {
  throw new Error("Simulated network error");
}
```

### Test Empty Data
Publish no records in Supabase or use a filter that returns no results.

### Test Not Found
Visit a URL with a non-existent slug:
```
/announcements/non-existent-slug
/events/invalid-event
```

---

## Summary

The error handling system provides:
- **Global error page** for unexpected crashes
- **404 page** for missing resources
- **Safe fetch utilities** with try/catch wrappers
- **EmptyState component** for consistent UX
- **Skeleton loaders** for loading states
- **Updated pages** using safe patterns
- **Error messages** that users can understand

This ensures the application gracefully handles failures and provides a smooth experience even when things go wrong.
