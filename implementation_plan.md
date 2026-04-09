# Multi-Tenant SaaS Analytics Dashboard

Welcome to the start of our journey to build a production-grade multi-tenant SaaS application. As a Senior Engineer, I'll be guiding you through building this with a focus on deep understanding, clean code, and scalable architecture. 

We will follow your requested roadmap strictly. Here is the implementation plan for our workflow:

### Project Roadmap
1. **Phase 1: SaaS Architecture & Setup (Current)**
2. **Phase 2: Database Schema & Multi-Tenant Design**
3. **Phase 3: Auth Setup with NextAuth**
4. **Phase 4: Role-Based Access Control**
5. **Phase 5: Dashboard Layout & Navigation**
6. **Phase 6: Analytics Backend & Charts**
7. **Phase 7: Subscription Plans & Feature Gating**
8. **Phase 8: Stripe Integration (Mock → Real)**
9. **Phase 9: Performance, Security & Best Practices**
10. **Phase 10: Deployment Checklist**

---

## Step 1: High-Level SaaS Architecture Overview

Before writing code, we need to understand the fundamental architecture of a SaaS.

### What are we building?
A multi-tenant application allows multiple organizations (tenants) to use the same application simultaneously while keeping their data completely isolated. Think of Slack or Notion—you have workspaces, and your data is scoped to your workspace.

### Core Architectural Decisions & The "Why"
1. **Next.js (App Router):** We'll use React Server Components (RSCs) and Server Actions to fetch and mutate data securely on the server. This reduces client-side JavaScript, improving performance and SEO.
2. **PostgreSQL & Prisma:** We will use a **Shared Database, Shared Schema** approach for multi-tenancy. All organizations live in the same tables, but every row has a `workspaceId` or `tenantId`. This is the most common and easiest to maintain approach for early-stage SaaS, as opposed to siloed databases (database-per-tenant) which require complex infrastructure.
3. **NextAuth (Auth.js):** To handle standard user authentication (credentials) and OAuth (Google, GitHub), simplifying token management and session security.
4. **Stripe:** For billing. Webhooks will be crucial here to sync our database with Stripe's state (e.g., when a subscription is canceled or created).

> [!NOTE]
> **Common Beginner Mistake:** Trying to implement separate databases for each tenant early on. Unless you have strict compliance requirements (like HIPAA/SOC2 enterprise customers), a shared schema with strict row-level tracking (`tenantId`) is highly scalable and much simpler to maintain.

---

## The Master Folder Structure

We will use the Next.js `app` router. Let's look at the structure we are going to build.

```text
saas-next/
├── prisma/                 # Database schema and migrations
│   └── schema.prisma       # Defining our Users, Workspaces, Subscriptions
├── src/
│   ├── app/                # Next.js App Router (Pages, Layouts, API Routes)
│   │   ├── (auth)/         # Grouped route for Login/Signup (no layout impact)
│   │   ├── (dashboard)/    # Grouped route for the protected dashboard
│   │   │   └── [workspaceId]/ # Dynamic route for tenant-specific data
│   │   ├── api/            # API endpoints (e.g., Stripe Webhooks)
│   │   └── page.tsx        # Public marketing landing page
│   ├── components/         # Reusable UI components
│   │   ├── ui/             # Generic UI (Buttons, Inputs, Modals)
│   │   ├── dashboard/      # Domain-specific (Charts, Overview Cards)
│   │   └── auth/           # Login forms, signup forms
│   └── lib/                # Core utilities, backend logic, configurations
│       ├── prisma.ts       # Prisma client instantiation
│       ├── auth.ts         # NextAuth configuration
│       ├── stripe.ts       # Stripe client setup
│       └── utils.ts        # Helper functions (date formatting, styling)
├── middleware.ts           # Intercepts requests for route protection
├── package.json
└── tailwind.config.ts
```

> [!IMPORTANT]
> **Security Consideration - Middleware:** We will rely heavily on `middleware.ts`. In a multi-tenant app, it is the first line of defense to ensure unauthenticated users don't access `/dashboard` and authenticated users don't access tenant data they aren't authorized to view.

---

## User Review Required

Does this high-level architecture and folder structure make sense? Are you ready to initialize the Next.js project and move on to Step 2 (Database schema & multi-tenant design)?
