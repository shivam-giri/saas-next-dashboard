# Technical Requirements Document (TRD): SaaSify

## 1. Architectural Blueprint

SaaSify is built on a modern, server-centric React architecture leveraging the **Next.js App Router**. The application emphasizes security, performance, and strong typing by keeping heavy business logic and database interactions strictly on the server.

### Core Architectural Decisions
- **Server Actions**: All database mutations (creating workspaces, generating AI content, managing team members) are executed via Next.js Server Actions (`"use server"`). There are almost no traditional `/api` REST endpoints exposed to the client, preventing API key leakage and reducing attack surface.
- **Edge Middleware**: A Next.js `middleware.ts` file acts as a gatekeeper, verifying authentication tokens at the Edge before rendering protected `/dashboard` routes.
- **Server-Side Rendering (SSR)**: Dashboards and campaign views are fetched securely on the server using Prisma, eliminating loading spinners for initial data fetches and ensuring secure RBAC (Role-Based Access Control) checks.
- **Client Components**: Used sparingly (via `"use client"`) only where interactivity is required, such as React's `useActionState` for form handling, chart rendering, and theme toggling.

## 2. The Tech Stack

| Layer | Technology | Version | Purpose |
|---|---|---|---|
| **Framework** | Next.js | 16.2.3 | Core framework, routing, and server actions (Turbopack enabled) |
| **UI Library** | React | 19.2.4 | UI components and modern hooks (`useActionState`) |
| **Language** | TypeScript | 5.x | End-to-end type safety |
| **Styling** | Tailwind CSS | 4.x | Utility-first CSS styling |
| **Database** | PostgreSQL | (Neon.tech) | Primary relational database |
| **ORM** | Prisma | 7.7.0 | Database modeling, migrations, and type-safe querying |

## 3. Core Dependencies & Libraries

### Authentication & Security
- **`next-auth` (v5 Beta)**: Handles the complex OAuth handshake, magic link email tokenization, and session management.
- **`@auth/prisma-adapter`**: Syncs NextAuth sessions and users directly into the Prisma PostgreSQL database.
- **`bcryptjs`**: Hashes and verifies passwords for traditional credential-based sign-ins.

### Artificial Intelligence
- **`@google/genai`**: The official Google SDK used to communicate with the **Gemini 2.5 Flash** model for high-speed, cost-effective content generation.

### Database Drivers
- **`@prisma/adapter-pg` & `pg`**: Allows Prisma to communicate efficiently with the serverless Neon PostgreSQL database via connection pooling.

### Payments & Monetization
- **`stripe` (v22)**: Official Stripe Node.js SDK used to generate secure Checkout Sessions and verify incoming webhook signatures.

### UI & Utilities
- **`recharts`**: Renders the interactive revenue and analytics charts on the dashboard.
- **`lucide-react`**: Provides clean, modern SVG icons used throughout the interface.
- **`next-themes`**: Handles system-aware Dark/Light mode toggling without hydration mismatch flashes.
- **`nodemailer`**: Connects to Gmail SMTP to send HTML-formatted workspace invitation emails.

## 4. External APIs & Webhooks Used

### 1. Google Gemini API (`generativelanguage.googleapis.com`)
- **Usage**: Used in `src/lib/gemini.ts` to generate Blog Posts, Tweets, LinkedIn updates, and Emails.
- **Integration**: The app injects the workspace's specific `BrandVoice` as "system instructions" into the API request to ensure strict adherence to tone and vocabulary.

### 2. Stripe API (`api.stripe.com`)
- **Usage**: Handles the SaaS subscription lifecycle.
- **Webhook Endpoint**: `POST /api/stripe/webhook`
- **Events Listened To**:
  - `checkout.session.completed`: Upgrades the workspace plan and grants initial AI credits.
  - `customer.subscription.updated`: Syncs active subscription status and replenishes credits.

### 3. Google & GitHub OAuth APIs
- **Usage**: Used by NextAuth to authenticate users without passwords.
- **Integration**: Requires specific Client IDs and Secrets configured in the respective developer consoles.

### 4. Gmail SMTP Server (`smtp.gmail.com`)
- **Usage**: Sends workspace invitation emails to colleagues.
- **Integration**: Uses NodeMailer authenticated via a 16-character Google App Password.

## 5. Database Blueprint

The database is structured to support multi-tenancy and data isolation.

### Key Relationships
- **`User` ↔ `WorkspaceMember` ↔ `Workspace`**: A User can belong to many Workspaces, and a Workspace has many Users. The junction table `WorkspaceMember` holds the specific `Role` (ADMIN vs MEMBER).
- **`Workspace` → `BrandVoice`**: A strict 1-to-1 relationship defining the AI rules for that specific tenant.
- **`Workspace` → `Campaign` → `ContentDocument`**: Hierarchical data model where a tenant owns a campaign, and a campaign contains multiple generated documents.
- **`Workspace` → Billing Fields**: Stripe IDs (`stripeCustomerId`, `stripeSubscriptionId`) and `creditsRemaining` are stored directly on the `Workspace` model to enforce tenant-level limits.

## 6. Deployment Strategy

- **Platform**: Vercel (Optimized for Next.js 16 Edge runtime and Server Actions).
- **Environment Variables**: Managed securely via Vercel dashboard.
- **Build Step**: The `postinstall` script runs `prisma generate` automatically during the Vercel build process to compile the Prisma Client before the Next.js build begins.
- **Database Connection**: Uses Neon's connection pooler URL (`-pooler` in the host string) for standard queries to prevent connection exhaustion in serverless environments.
