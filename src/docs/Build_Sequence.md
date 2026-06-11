# Implementation Plan & Build Sequence: SaaSify

This document outlines the step-by-step build sequence used to construct the SaaSify application. It serves as a retrospective blueprint for how the application was architected from the ground up, organized into logical, incremental phases.

---

## Phase 1: Foundation & Database Architecture

**Goal**: Establish the core repository, tooling, and database schema.

1. **Initialize Project**: 
   - Scaffold a Next.js 16 project using the App Router, React 19, TypeScript, and Tailwind CSS 4.
   - Install necessary UI utilities (`lucide-react`, `next-themes`).
2. **Configure Database**:
   - Provision a serverless PostgreSQL database on Neon.tech.
   - Initialize Prisma ORM (`npx prisma init`) and configure the `DATABASE_URL`.
3. **Define Schema**:
   - Write the `schema.prisma` file defining the core entities: Users, Auth tokens, Workspaces, WorkspaceMembers, BrandVoice, Campaigns, and ContentDocuments.
   - Execute the first migration (`npx prisma db push`) to build the tables in Neon.
4. **Setup Prisma Client**:
   - Create a singleton Prisma client instance in `src/lib/prisma.ts` to prevent connection exhaustion during hot reloads.

---

## Phase 2: Authentication & Edge Security

**Goal**: Secure the application and implement passwordless/social logins.

1. **Install NextAuth (Auth.js)**:
   - Install `next-auth@beta` and `@auth/prisma-adapter`.
2. **Configure Providers**:
   - Set up Google OAuth and GitHub OAuth credentials.
   - Configure Nodemailer with Gmail SMTP for Magic Link sign-ins.
3. **Build Auth UI**:
   - Create public pages for `/auth/signin` and `/auth/signup`.
4. **Implement Middleware**:
   - Create `middleware.ts` to run at the Edge. Ensure all `/dashboard` and `/onboarding` routes redirect unauthenticated users back to `/auth/signin`.

---

## Phase 3: Multi-Tenancy & Dashboard Shell

**Goal**: Allow users to create tenants (Workspaces) and build the core UI layout.

1. **The Onboarding Flow**:
   - Build the `/onboarding` route. Force new users with zero workspaces to create one.
   - Write the `createWorkspaceAction` Server Action, ensuring the creator is automatically assigned the `ADMIN` role in `WorkspaceMember`.
2. **Dashboard Layout**:
   - Implement `/dashboard/[workspaceSlug]/layout.tsx`.
   - Build the global **Sidebar** (with Workspace Switcher) and **TopNav** (with Theme Toggle and generic User Profile dropdown).
3. **Analytics Shell**:
   - Implement the `recharts` revenue and active user charts on the main dashboard overview page.

---

## Phase 4: Brand Voice & AI Integration

**Goal**: Connect the app to Google Gemini and enable custom AI generation.

1. **Brand Voice Settings**:
   - Build the `/dashboard/[workspaceSlug]/brand` page containing forms to save Tone, Target Audience, and Banned Words to the database.
2. **Integrate Gemini SDK**:
   - Install `@google/genai` and initialize the client in `src/lib/gemini.ts`.
3. **The Generation Server Action**:
   - Write the core Server Action that takes a user's prompt, fetches the workspace's `BrandVoice`, and constructs a structured system instruction.
   - Call the Gemini API to generate the requested formats (Blog, Tweet, etc.).
   - Save the raw results into the database as `ContentDocument` rows grouped under a new `Campaign`.

---

## Phase 5: Document Workflow & Admin Feedback

**Goal**: Allow users to review, edit, and approve the AI-generated content.

1. **Campaign UI**:
   - Build the `/dashboard/[workspaceSlug]/campaigns` list view.
2. **Document Cards**:
   - Build the detailed campaign view displaying individual documents.
   - Implement inline editing so users can modify the AI output directly in a `<textarea>`.
3. **Approval Lifecycle & Feedback**:
   - Wire up status toggle buttons (`DRAFT` → `IN_REVIEW` → `APPROVED`).
   - Implement the Admin Feedback loop: allow admins to write an `adminComment` on the document card that members can read and address.

---

## Phase 6: Team Collaboration (Multiplayer)

**Goal**: Allow Admins to invite colleagues into their workspace.

1. **Invite UI**:
   - Build the Team Management page. Add an "Invite Member" form and a table showing pending invitations.
2. **Invitation Action**:
   - Create a Server Action that generates a secure, randomized `cuid()` token and saves it to `WorkspaceInvitation` with a 7-day expiration.
   - Use Nodemailer to send a branded HTML email containing the `invite/[token]` link.
3. **Acceptance Route**:
   - Build the public `/invite/[token]` dynamic route.
   - Verify the token. If the user isn't logged in, redirect to signup/signin. Once logged in, consume the token and create a `WorkspaceMember` record.

---

## Phase 7: Monetization (Stripe Billing)

**Goal**: Gate AI usage behind credits and subscription plans.

1. **Credit Enforcement**:
   - Update the AI Generation Server Action to check `workspace.creditsRemaining`. Throw an error if credits are zero.
2. **Stripe Integration**:
   - Add the Stripe Node.js SDK.
   - Create a Server Action to generate a Stripe Checkout Session for upgrading to the "Pro Plan".
3. **Stripe Webhooks**:
   - Build the API route `POST /api/webhooks/stripe`.
   - Verify the Stripe signature.
   - Listen for `checkout.session.completed` (to grant initial credits and save the subscription ID) and `customer.subscription.updated` (to replenish monthly credits).

---

## Phase 8: Testing, Polish & Deployment

**Goal**: Ensure production readiness.

1. **Strict React Purity**:
   - Resolve any Next.js 15+ Turbopack compiler warnings (e.g., impure `Date.now()` calls in render functions or cascading effects in Theme Toggles).
2. **SEO & Metadata**:
   - Add dynamic Next.js Metadata for page titles and descriptions.
3. **Deployment**:
   - Connect the repository to Vercel.
   - Supply all environment variables (Stripe, Google Auth, Gemini, Neon).
   - Ensure `prisma generate` runs in the build pipeline.
