# Cursor AI Prompt: Job Matching Platform (Full Stack)

## Project Overview
Create a complete job matching platform with 3 user types:
1. **Job Seekers** (elderly users) - Access via LINE Bot
2. **Companies** - Web portal to post jobs and manage applications
3. **Admin** - Web dashboard to approve/manage everything

## Tech Stack Requirements
- **Framework**: Next.js 15 (App Router) + TypeScript
- **Styling**: Tailwind CSS + shadcn/ui components
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js
- **LINE Integration**: @line/bot-sdk + LIFF
- **Deployment**: Ready for Vercel deployment

## Project Structure
```
job-matching-platform/
├── app/
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   ├── (company)/
│   │   ├── layout.tsx
│   │   ├── dashboard/page.tsx
│   │   ├── jobs/
│   │   │   ├── page.tsx
│   │   │   ├── new/page.tsx
│   │   │   └── [id]/edit/page.tsx
│   │   └── applications/
│   │       ├── page.tsx
│   │       └── [id]/page.tsx
│   ├── (admin)/
│   │   ├── layout.tsx
│   │   ├── dashboard/page.tsx
│   │   ├── companies/page.tsx
│   │   ├── jobs/page.tsx
│   │   └── users/page.tsx
│   ├── api/
│   │   ├── auth/[...nextauth]/route.ts
│   │   ├── line/webhook/route.ts
│   │   ├── jobs/route.ts
│   │   ├── applications/route.ts
│   │   └── notifications/route.ts
│   └── liff/
│       ├── register/page.tsx
│       └── profile/page.tsx
├── components/
│   ├── ui/ (shadcn components)
│   ├── line/
│   │   ├── flex-messages.tsx
│   │   └── rich-menu.tsx
│   ├── company/
│   │   ├── job-form.tsx
│   │   ├── application-card.tsx
│   │   └── stats-dashboard.tsx
│   └── admin/
│       ├── approval-table.tsx
│       └── stats-overview.tsx
├── lib/
│   ├── prisma.ts
│   ├── line-client.ts
│   ├── auth.ts
│   └── utils.ts
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
└── types/
    └── index.ts
```

## Database Schema (Prisma)

Create a comprehensive schema with these models:

### User Model
- id, email, password (hashed), role (ADMIN/COMPANY), name, status (PENDING/APPROVED/REJECTED/SUSPENDED)
- Timestamps: createdAt, updatedAt
- Relations: company (one-to-one), notifications (one-to-many)

### Company Model
- id, userId, name, description, address, phone, website, logo
- Timestamps: createdAt, updatedAt
- Relations: user (one-to-one), jobs (one-to-many)

### JobSeeker Model
- id, lineUserId (unique), displayName, pictureUrl, phone, email, age
- Profile: education, experience, skills, resumeUrl
- Timestamps: createdAt, updatedAt
- Relations: applications (one-to-many), notifications (one-to-many)

### Job Model
- id, companyId, title, description, location, salary, jobType (FULL_TIME/PART_TIME/CONTRACT/INTERNSHIP)
- requirements, status (PENDING/ACTIVE/CLOSED/REJECTED), expiresAt
- Timestamps: createdAt, updatedAt
- Relations: company (many-to-one), applications (one-to-many)
- Indexes: companyId, status

### Application Model
- id, jobId, seekerId, coverLetter, status (PENDING/REVIEWING/ACCEPTED/REJECTED/WITHDRAWN)
- Timestamps: createdAt, updatedAt
- Relations: job (many-to-one), seeker (many-to-one)
- Unique constraint: [jobId, seekerId]
- Indexes: jobId, seekerId, status

### Notification Model
- id, userId (nullable), seekerId (nullable), title, message, type, isRead
- Timestamp: createdAt
- Relations: user (many-to-one), seeker (many-to-one)
- Indexes: [userId, isRead], [seekerId, isRead]

## Feature Requirements

### 1. LINE Bot (Job Seekers)

#### Welcome & Registration Flow
- On follow: Welcome message with Flex Message bubble
- Check if registered → Show registration button (LIFF form)
- Registration form collects: phone, email, age, education, experience, skills
- Upload resume (use Next.js API for file handling)

#### Main Menu (Flex Message)
Create a beautiful Flex Message menu with:
- 🔍 Browse Jobs
- 📝 My Applications
- 👤 Edit Profile
- 🔔 Notifications

#### Browse Jobs
- Display jobs as Flex Carousel (max 10 per message)
- Each bubble shows: title, company name, location, salary
- Buttons: "View Details", "Apply Now"
- Filter by: location, job type (use Quick Reply)

#### Job Details
- Full description in Flex Message
- Company info
- Requirements
- Buttons: "Apply", "Save", "Back to Jobs"

#### Apply for Job
- Check if already applied
- Confirm application with Yes/No buttons
- Save application to database
- Send push notification to company
- Show success message

#### My Applications
- Show all applications as Flex Carousel
- Display status with emojis: ⏳ Pending, 👀 Reviewing, ✅ Accepted, ❌ Rejected
- Click to see details

#### Profile Management
- LIFF form to edit profile
- Update resume
- View current information

#### Push Notifications
- When application status changes
- When new matching jobs are posted
- Use LINE Push Message API

### 2. Company Portal (Web)

#### Authentication
- Login page with email/password
- Registration form with company details
- NextAuth.js with credentials provider
- Protected routes with middleware
- Show "Pending Approval" message if status is PENDING

#### Dashboard
Display cards with:
- Total active jobs
- Total applications (pending/reviewing)
- Recent applications (last 5)
- Quick actions: "Post New Job", "View All Applications"

#### Job Management
**List Page:**
- Data table with: title, status, applications count, created date
- Filters: status (all/active/closed/pending)
- Search by title
- Actions: Edit, View Applications, Delete, Toggle Active/Closed

**Create/Edit Form:**
- Fields: title, description (textarea), location, salary, jobType (select), requirements
- Validation with Zod
- Auto-save draft (optional)
- Submit for admin approval (status = PENDING)

#### Applications Management
**List Page:**
- Filter by: job, status, date range
- Sort by: date, status
- Bulk actions: Accept selected, Reject selected

**Detail Page:**
- Applicant info: name, photo, contact
- Resume download link
- Cover letter
- Application timeline
- Actions: Accept, Reject, Mark as Reviewing
- Send action triggers LINE notification to job seeker

#### Notifications
- Bell icon with unread count
- Dropdown list of recent notifications
- Mark as read functionality
- Types: New Application, Admin Approved Job, etc.

### 3. Admin Dashboard (Web)

#### Authentication
- Separate admin login
- Seed one admin account in prisma/seed.ts
- Protected admin routes

#### Dashboard Overview
Display stats cards:
- Total users (companies + job seekers)
- Pending approvals (companies + jobs)
- Total active jobs
- Total applications
- Charts: Applications over time, Jobs by type

#### Company Management
**List Page:**
- Data table: name, email, status, registration date
- Filters: status (pending/approved/rejected/suspended)
- Search by name/email
- Bulk actions: Approve, Reject, Suspend

**Actions:**
- Approve: Set status to APPROVED, send notification
- Reject: Set status to REJECTED, send notification with reason
- Suspend: Prevent login and hide all jobs
- View company details and all their jobs

#### Job Management
**List Page:**
- All jobs from all companies
- Columns: title, company, status, created date
- Filters: status, company, date range
- Search by title/company

**Actions:**
- Approve job: Set status to ACTIVE
- Reject job: Set status to REJECTED, notify company
- Force close job
- View job details

#### User Management
- View all job seekers
- Search by name/LINE ID
- View their applications
- Block/unblock users

#### Analytics (Optional)
- Charts using Recharts
- Top companies by applications
- Most popular job types
- Application success rate

## LINE Bot Implementation Details

### Webhook Handler (app/api/line/webhook/route.ts)
```typescript
Handle these event types:
- follow: Register new user
- message (text): Parse commands, show menu
- postback: Handle button clicks (browse jobs, apply, etc.)
- unfollow: Mark user as inactive (optional)

Signature verification required.
Error handling with try-catch.
Return 200 OK always to prevent retries.
```

### Flex Message Templates
Create reusable functions for:
1. **Welcome Message**: Hero image, welcome text, registration button
2. **Main Menu**: 4 buttons with icons
3. **Job Card**: Company logo placeholder, job info, 2-3 buttons
4. **Job Carousel**: Up to 10 job cards
5. **Application Card**: Job title, company, status badge
6. **Success/Error Messages**: Simple bubble with icon and text

### LIFF Pages (app/liff/)
- Use LIFF SDK to get user profile
- Forms styled with Tailwind + shadcn/ui
- Submit to Next.js API routes
- Close LIFF after success
- Handle errors gracefully

### Rich Menu (Optional)
Create a rich menu image with:
- Browse Jobs
- My Applications  
- Profile
- Help

## API Routes

### POST /api/line/webhook
- Verify LINE signature
- Parse events
- Handle each event type
- Return 200 OK

### GET/POST /api/jobs
- GET: List jobs (with filters, pagination)
- POST: Create job (company only)

### GET/PUT /api/jobs/[id]
- GET: Job details
- PUT: Update job

### GET /api/applications
- List applications
- Filter by job, seeker, status

### POST /api/applications
- Create application
- Check for duplicates
- Create notification

### PUT /api/applications/[id]
- Update status
- Send LINE push notification on status change

### POST /api/notifications/push
- Send LINE push message
- Track delivery

### Admin routes: /api/admin/*
- All protected with admin role check
- Approval endpoints
- Stats endpoints

## Authentication Setup

### NextAuth Configuration
```typescript
Providers:
- Credentials (email + password)
- Check user role and status
- Return user object with role

Session:
- Include user role in session
- JWT strategy

Callbacks:
- jwt: Add role to token
- session: Add role to session
```

### Middleware
Protect routes:
- /company/* requires COMPANY role
- /admin/* requires ADMIN role
- Redirect to login if not authenticated

## Mock Data (prisma/seed.ts)

Create seed data:
1. **Admin user**: admin@example.com / Admin123!
2. **3 Company users**: company1@example.com, etc. (1 pending, 2 approved)
3. **3 Companies**: with full details
4. **10 Jobs**: Mix of pending/active/closed, various types
5. **5 Job Seekers**: With realistic LINE user IDs (mock)
6. **15 Applications**: Various statuses

## Environment Variables (.env.example)
```
DATABASE_URL="postgresql://user:password@localhost:5432/jobmatch"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate-random-secret-here"
LINE_CHANNEL_ACCESS_TOKEN="your-line-token"
LINE_CHANNEL_SECRET="your-line-secret"
LINE_LIFF_ID="your-liff-id"
NEXT_PUBLIC_URL="http://localhost:3000"
```

## UI/UX Requirements

### Design System
- Use shadcn/ui components: Button, Card, Form, Input, Select, Textarea, Table, Dialog, Badge, Tabs
- Color scheme: Professional blue/gray palette
- Responsive: Mobile-first approach
- Loading states: Skeletons and spinners
- Error states: Toast notifications or inline errors
- Empty states: Friendly messages with icons

### Company Portal
- Clean, professional design
- Dashboard with cards and stats
- Data tables with sorting and filtering
- Forms with inline validation
- Modal confirmations for destructive actions

### Admin Portal
- Similar to company portal but with admin branding
- More data-dense tables
- Bulk action capabilities
- Status badges with colors

### LINE Bot
- Friendly, conversational tone in Thai
- Emojis for visual appeal
- Clear button labels
- Quick replies for common actions
- Flex Messages with consistent styling

## Testing & Validation

### Form Validation
Use Zod schemas for:
- Registration forms
- Job posting forms
- Application forms
- Validate on client and server

### Error Handling
- API errors with proper status codes
- User-friendly error messages
- Log errors to console
- Graceful fallbacks

## Deployment Checklist

### Vercel Setup
1. Connect GitHub repo
2. Add environment variables
3. Set build command: `npm run build`
4. Set output directory: `.next`

### Database
1. Use Vercel Postgres or Supabase
2. Run migrations: `npx prisma migrate deploy`
3. Seed data: `npx prisma db seed`

### LINE Bot
1. Set webhook URL: `https://your-domain.vercel.app/api/line/webhook`
2. Enable webhook in LINE Console
3. Create LIFF apps for registration and profile
4. Set LIFF endpoint URLs

### Post-Deployment
1. Create Rich Menu in LINE Console
2. Test all LINE Bot flows
3. Test company registration and approval
4. Test job posting and approval
5. Test application flow end-to-end

## Additional Features (Optional but Nice to Have)

1. **Email Notifications**: Using Resend or SendGrid
2. **File Upload**: Resume to AWS S3 or Vercel Blob
3. **Search**: Full-text search for jobs
4. **Filters**: Advanced filtering on jobs page
5. **Bookmarks**: Save jobs for later
6. **Analytics**: Track user engagement
7. **Multi-language**: i18n support (Thai/English)
8. **Dark Mode**: Toggle theme

## Code Quality Requirements

- TypeScript strict mode
- ESLint + Prettier configured
- Consistent naming conventions
- Comments for complex logic
- Reusable components and utilities
- Error boundaries for React components
- Loading states for async operations
- Optimistic UI updates where appropriate

## Success Criteria

The project is complete when:
- ✅ All 3 user types can authenticate
- ✅ LINE Bot responds to all commands
- ✅ Job seekers can browse and apply via LINE
- ✅ Companies can post jobs and manage applications
- ✅ Admin can approve companies and jobs
- ✅ Notifications work (LINE push + web)
- ✅ All forms have validation
- ✅ Responsive on mobile and desktop
- ✅ Can be deployed to Vercel
- ✅ Seed data works

---

## Instructions for Cursor AI

Please create this complete project with:
1. Full Next.js 15 setup with TypeScript and App Router
2. Complete Prisma schema with all models and relations
3. All API routes with full implementations
4. LINE Bot webhook with all handlers and Flex Messages
5. Company portal with all pages and functionality
6. Admin dashboard with all features
7. LIFF pages for LINE users
8. Authentication with NextAuth.js
9. Seed file with realistic mock data
10. All necessary components using shadcn/ui
11. Environment variables template
12. README with setup instructions

Generate production-ready code with proper error handling, validation, and TypeScript types throughout. Include comments for complex logic. Make sure all files are properly organized and follow Next.js conventions.