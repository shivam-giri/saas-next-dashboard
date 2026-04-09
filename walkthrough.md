# SaaS Dashboard - Bootcamp Progress Notes (Phases 1-3)

This document serves as your permanent reference guide for the steps we took to start our multi-tenant SaaS application from scratch.

> [!TIP]
> Keep this document handy! It represents the "first hour" of building any production-grade SaaS. If you ever need to spin up a new startup idea quickly, these are the exact architectural steps to replicate.

---

## Phase 1: Project Initialization

**Goal**: Set up the fundamental Next.js framework environment with TypeScript and Tailwind CSS. We opted for the modern App Router architecture (`/src/app`).

### Execution Commands:
```bash
# 1. Initialize the newest Next.js application in the current directory
npx create-next-app@latest ./ --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --yes
```

---

## Phase 2: Database Schema & Multi-Tenant Design

**Goal**: Model our data structurally using Prisma ORM. We opted for the **Shared Database Architecture** (all tenants share tables, separated by a `workspaceId`).

### Execution Commands:
```bash
# 2. Install Prisma development tooling and the runtime client library
npm install -D prisma
npm install @prisma/client

# 3. Initialize Prisma configuration (creates prisma/schema.prisma and .env)
npx prisma init
```

### Key Architectural Concepts Applied:
- We added `User`, `Account`, and `Session` tables, which represent the minimum required schema for **NextAuth**.
- We added `Workspace` and linked users via a join table called `WorkspaceMember`.
- The `WorkspaceMember` table contains an `enum Role { ADMIN MEMBER }` providing foundational **Role-Based Access Control (RBAC)** capabilities scoped to specific tenants.

---

## Phase 3: Auth Setup with NextAuth & Prisma

**Goal**: Link a real database (Neon PostgreSQL), configure secure login using Google OAuth, and protect specific URLs.

### Manual Setup:
- We signed up for [Neon.tech](https://neon.tech) and Google Cloud Console.
- We updated our `.env` file with `DATABASE_URL`, `AUTH_GOOGLE_ID`, and `AUTH_GOOGLE_SECRET`.

### Execution Commands:
```bash
# 4. Generate a cryptographically secure random session password
npx auth secret

# 5. Push our Prisma schema into the Neon Database (creates the SQL tables)
npx prisma db push --force-reset

# 6. Generate the TypeScript type definitions for our Prisma models
npx prisma generate

# 7. Install NextAuth (beta version 5), the Prisma adapter, and the Prisma Postgres adapter
npm install next-auth@beta @auth/prisma-adapter pg @prisma/adapter-pg
npm install -D @types/pg
```

### Core Security & Code Configuration:
1. **`src/lib/prisma.ts`**: We instantiated a global, singleton Prisma Client. Because we are using the newest Prisma 7 patterns, we utilized the **Driver Adapter Pattern** (`PrismaPg`) to manage database connections properly in modern Serverless runtimes like Vercel Cloud functions. 
2. **`src/lib/auth.ts`**: We defined our NextAuth configuration, passing in the `PrismaAdapter(prisma)` and Google login configuration.
3. **`src/app/api/auth/[...nextauth]/route.ts`**: Created the catch-all dynamic Next.js App Router API endpoint, automatically handling OAuth callback URLs and session token resolution.
4. **`middleware.ts`**: Set up Edge route security. If any user tries to load `.com/dashboard/*` and they don't have an active browser cookie session matching our database, they are redirected automatically back to the login screen.
