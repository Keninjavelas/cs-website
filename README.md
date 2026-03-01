# IEEE Computer Society Chapter Platform

A production-ready web platform for managing IEEE Computer Society chapter operations, events, and community engagement.

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-green?style=flat-square&logo=supabase)](https://supabase.com)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4.0-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com)
[![Vercel](https://img.shields.io/badge/Vercel-Deployed-black?style=flat-square&logo=vercel)](https://vercel.com)

## Overview

This platform serves as the official digital hub for the IEEE Computer Society Student Chapter at HKBK College of Engineering. It provides a comprehensive solution for chapter management, event coordination, and community engagement through a responsive public website combined with a secure, role-based admin dashboard.

**Problem Solved:** IEEE chapters need a centralized platform to manage events, track registrations, publish announcements, and maintain an organized digital presence without relying on scattered services or external dependencies.

**Why Built:** This platform was developed to provide complete autonomy over chapter operations, eliminate dependency on third-party event management tools, and create a scalable foundation for future expansions and integrations.

## Core Features

### Public-Facing Features

- **Event Listings** - Discover upcoming chapter events with full details, registration links, and event history
- **Achievements Gallery** - Showcase chapter accomplishments, awards, and milestones
- **Announcement Feed** - Stay informed with the latest chapter news and updates
- **Chapter Membership** - Direct WhatsApp integration for instant community access
- **Newsletter Subscription** - Seamless Substack integration for email communications
- **Team Directory** - Executive committee and faculty advisor profiles with social media links
- **Contact System** - Secure contact form with email delivery for member inquiries

### Admin Dashboard Features

- **Secure Admin Authentication** - Email-based authentication with Supabase Auth
- **Role-Based Authorization** - Admin privileges controlled and verified through database tables
- **Event Management** - Create, edit, publish, and manage chapter events with full CRUD operations
- **Achievement Management** - Add and organize chapter achievements with media gallery support
- **Announcement Publishing** - Rich text support for chapter announcements and updates
- **Registration Tracking** - View, manage, and export event registration data
- **Real-Time Statistics** - Dashboard displays key metrics and event analytics

### Security Features

- **Row-Level Security (RLS)** - PostgreSQL policies enforce data access at the database level
- **Database-Driven Authorization** - Admin roles stored and verified in `public.admins` table
- **No Hardcoded Privileges** - Authorization determined entirely by database records, not frontend logic
- **Protected Routes** - Admin section requires authentication and authorization verification
- **Secure Credential Handling** - Service role keys isolated to server-side code only
- **Environment Variable Protection** - Sensitive data excluded from version control via `.gitignore`

## Architecture Overview

### Authentication & Authorization Flow

```
User Visits /admin
    ↓
Next.js Layout Guards Auth Status
    ↓
Supabase Auth Check (getUser)
    ↓
Query public.admins Table
    ↓
Admin: Display Dashboard | Non-Admin: Redirect to Home
```

### Data & Security Model

```
Frontend (Browser)
    ↓
Public Supabase Anon Key
    ↓
Supabase Auth + RLS Policies
    ↓
PostgreSQL Database
    ↓
Server-Side API Routes (Service Role Key)
    ↓
Protected Operations (Email, Data Export)
```

### Database Authorization

- `public.admins` table controls all admin access
- RLS policies enforce row-level access control on all tables
- Published content visible to all users
- Draft content restricted to authenticated admins
- User data only accessible by admin accounts

## Tech Stack

### Frontend & Framework
- **Next.js 16** - React framework with App Router and server components
- **TypeScript** - Type-safe development with full IDE support
- **React 19** - Latest React features and optimizations
- **Tailwind CSS 4** - Utility-first CSS framework with PostCSS

### Backend & Database
- **Supabase** - Open-source Firebase alternative
- **PostgreSQL** - Relational database with Row-Level Security
- **Supabase Auth** - Secure authentication and session management
- **Row-Level Security** - Database-enforced authorization policies

### Deployment & Infrastructure
- **Vercel** - Serverless platform with edge functions and auto-scaling
- **GitHub** - Version control and CI/CD integration

### External Services
- **Nodemailer** - Email delivery for contact forms
- **Resend** - Transactional email service

## Folder Structure

```
ieee-cs-platform/
├── app/
│   ├── admin/                      # Admin dashboard routes
│   │   ├── layout.tsx              # Auth guard and protections
│   │   ├── page.tsx                # Dashboard homepage
│   │   ├── events/                 # Event management
│   │   ├── announcements/          # Announcement CMS
│   │   ├── achievements/           # Achievement management
│   │   ├── registrations/          # Registration tracking
│   │   └── login/                  # Admin authentication
│   ├── api/                        # Server-side API routes
│   │   └── contact/                # Contact form endpoint
│   ├── events/                     # Public event pages
│   ├── announcements/              # Public announcement pages
│   ├── team/                       # Executive team showcase
│   ├── achievements/               # Achievements gallery
│   ├── about/                      # About chapter page
│   ├── membership/                 # Chapter membership info
│   ├── contact/                    # Contact page
│   ├── layout.tsx                  # Root layout
│   └── globals.css                 # Global styles
├── components/
│   ├── admin/                      # Admin-specific components
│   ├── layout/                     # Navbar, Footer
│   ├── events/                     # Event-related components
│   ├── team/                       # Team card components
│   └── ui/                         # Reusable UI primitives
├── lib/
│   ├── supabase.ts                 # Supabase client initialization
│   ├── supabase-ssr.ts             # Server-side Supabase helpers
│   ├── email-validation.ts         # Form validation utilities
│   ├── csv-export.ts               # Data export functionality
│   ├── rate-limiter.ts             # Rate limiting for APIs
│   └── utils.ts                    # Common helper functions
├── data/
│   ├── team.ts                     # Executive committee data
│   ├── events.ts                   # Static event data
│   └── ieeeGlobalEvents.ts         # IEEE global events
├── public/
│   ├── assets/                     # Brand assets and logos
│   └── team/                       # Team member photos
├── docs/                           # Documentation
├── middleware.ts                   # Next.js middleware
├── next.config.ts                  # Next.js configuration
├── tsconfig.json                   # TypeScript configuration
├── tailwind.config.ts              # Tailwind CSS configuration
└── package.json                    # Dependencies and scripts
```

## Environment Variables

### Required Variables

```bash
# Supabase API Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
```

These are public variables used by the frontend to authenticate users and access published data.

### Optional Server-Side Variables

```bash
# Email Configuration
GMAIL_USER=chapter-email@gmail.com
GMAIL_PASS=your-app-password

# Community Links
WHATSAPP_COMMUNITY_LINK=https://chat.whatsapp.com/your-link
```

### Security Notes

- Never expose the Supabase service role key in frontend code
- All sensitive credentials should be marked as "Sensitive" in Vercel
- `.env.local` is automatically excluded from version control
- Environment variables are validated at build time

## Local Development

### Prerequisites
- Node.js 18 or higher
- npm or yarn package manager
- Supabase account (free tier)

### Setup Instructions

1. **Clone the repository**
```bash
git clone https://github.com/IEEE-CS-HKBK/platform.git
cd platform
```

2. **Install dependencies**
```bash
npm install
```

3. **Create environment configuration**
```bash
cp .env.example .env.local
```

Edit `.env.local` with your Supabase credentials from https://supabase.com/dashboard

4. **Start development server**
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### Available Commands

```bash
npm run dev      # Start development server with hot reload
npm run build    # Build for production
npm start        # Start production server
npm run lint     # Run ESLint and TypeScript checks
```

## Production Build & Performance

```bash
# Create optimized production build
npm run build

# Test production build locally
npm start
```

The production build includes:
- Code minification and optimization
- Static page pre-rendering
- Image optimization
- CSS purging
- Bundle analysis

## Deployment

### Deploy to Vercel

Vercel is the recommended deployment platform for this Next.js application.

1. **Push to GitHub**
```bash
git add .
git commit -m "Prepare for production deployment"
git push origin main
```

2. **Connect Repository**
   - Go to https://vercel.com/new
   - Import your GitHub repository
   - Select "Next.js" as the framework

3. **Configure Environment Variables**
   - Navigate to Project Settings > Environment Variables
   - Add `NEXT_PUBLIC_SUPABASE_URL`
   - Add `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - Add any server-side secrets (GMAIL_USER, GMAIL_PASS, etc.)
   - Mark server-side variables as "Sensitive"

4. **Deploy**
   - Click "Deploy"
   - Vercel automatically builds and deploys
   - Subsequent pushes to main trigger automatic deployments

### Alternative Deployment Options

The application can be deployed to any platform supporting Node.js:
- **Self-hosted** - Docker container on own server
- **AWS** - EC2, Elastic Beanstalk, or Lambda
- **Google Cloud** - Cloud Run, App Engine
- **Azure** - App Service, Container Instances
- **DigitalOcean** - App Platform or Droplet

## System Architecture

### Component Interaction

```
┌─────────────────────────────────────────────────────────────┐
│                      Client Browser                          │
│  ┌──────────────────────────────────────────────────────┐  │
│  │           Next.js App (React Components)            │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                           ↓ (HTTPS)
┌─────────────────────────────────────────────────────────────┐
│                   Vercel Edge Network                        │
│  Serverless Functions | Static Content | API Routes         │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│                      Supabase Services                       │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Auth Service | PostgreSQL Database | RLS Policies │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### Data Flow

1. **Public User** → Visits public pages → Reads published events/announcements
2. **Admin User** → Authenticates via Supabase Auth → Verified against admins table → Accesses dashboard
3. **Form Submission** → API route (server-side) → Email delivery via Nodemailer
4. **Registrations** → Stored in PostgreSQL → Exported via CSV from admin panel

## Screenshots

<!-- Dashboard Overview -->
<!-- Add admin dashboard homepage screenshot showing stats and management options -->

<!-- Event Management -->
<!-- Add event creation/edit interface screenshot -->

<!-- Admin Login -->
<!-- Add secure login page screenshot -->

<!-- Public Events Page -->
<!-- Add public-facing events listing screenshot -->

## Security Implementation

### Frontend Security
- No sensitive credentials stored in browser localStorage
- environment variables prefixed with `NEXT_PUBLIC_` are safe for frontend exposure
- All authentication tokens managed by Supabase Auth (secure HTTP-only cookies)
- No privilege flags hardcoded in client-side code

### Database Security
- Row-Level Security policies on all tables enforce access control
- Admin authorization verified through `public.admins` table
- Published flag controls content visibility
- Sensitive operations require service role authentication

### API Security
- Rate limiting on contact form and public endpoints
- Input validation and sanitization on all submissions
- Service role key isolated to server-side routes only
- CORS properly configured for trusted origins

### Authentication Flow
- Email verification before admin access
- Secure password handling via Supabase
- Session tokens expire after inactivity
- Admin status verified on every request
- No client-side privilege elevation possible

## Future Enhancements

- **Admin Role Hierarchy** - Super Admin, Editor, Viewer roles with granular permissions
- **Analytics Dashboard** - Detailed event analytics, registration trends, user behavior
- **Media Management** - Integrated image storage and gallery management
- **Email Campaigns** - Bulk email functionality for newsletter campaigns and announcements
- **Member Profiles** - Individual member accounts with registration history
- **Calendar Integration** - Sync events with Google Calendar and iCalendar
- **Mobile App** - React Native application for iOS and Android
- **APIDocumentation** - OpenAPI specification for third-party integrations
- **Audit Logging** - Track all admin actions for compliance and transparency
- **Multi-Chapter Support** - Platform for multiple IEEE chapters

## Performance Metrics

- First Contentful Paint: < 1s
- Largest Contentful Paint: < 2.5s
- Cumulative Layout Shift: < 0.1
- Time to Interactive: < 3s
- Lighthouse Score: 90+

## Support & Contact

For questions, issues, or contributions:
- Email: hkbk.cs.ieee@gmail.com
- GitHub Issues: [Open an issue](https://github.com/IEEE-CS-HKBK/platform/issues)

## License

MIT License

Copyright (c) 2024 IEEE Computer Society Student Chapter, HKBK College of Engineering

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.

