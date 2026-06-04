<div align="center">

<h1>⚡ SaaSify</h1>

<p><strong>A production-grade, multi-tenant AI-powered SaaS platform built with Next.js 16</strong></p>

<p>
  <img src="https://img.shields.io/badge/Next.js-16.2-black?logo=next.js&logoColor=white" alt="Next.js" />
  <img src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Prisma-7-2D3748?logo=prisma&logoColor=white" alt="Prisma" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-4-38BDF8?logo=tailwindcss&logoColor=white" alt="Tailwind" />
  <img src="https://img.shields.io/badge/PostgreSQL-Neon-00E699?logo=postgresql&logoColor=white" alt="Neon" />
  <img src="https://img.shields.io/badge/Gemini_AI-2.5_Flash-4285F4?logo=google&logoColor=white" alt="Gemini AI" />
  <img src="https://img.shields.io/badge/Stripe-Billing-635BFF?logo=stripe&logoColor=white" alt="Stripe" />
</p>

<p>
  <a href="https://github.com/shivam-giri/saas-next-dashboard"><strong>View on GitHub →</strong></a>
</p>

</div>

---

## 📖 Overview

**SaaSify** is a full-stack, multi-tenant SaaS dashboard that combines workspace management, role-based access control, Stripe subscriptions, and **AI-powered content generation** — all in a single, production-ready application.

It is built on the cutting edge of the Next.js ecosystem: the **App Router**, **Server Actions** for all mutations, **NextAuth v5** for authentication, and **Prisma 7** with a serverless PostgreSQL adapter for the database layer.

> **AI Highlight:** Users can define a custom **Brand Voice** for their workspace and use **Google Gemini 2.5 Flash** to generate on-brand blog posts, tweets, LinkedIn posts, and marketing emails — all managed through a full campaign and document workflow.

---

## ✨ Features

### 🔐 Authentication — 4 Sign-in Methods
- **Email + Password** — Traditional credentials with bcrypt hashing
- **Google OAuth** — One-click Google sign-in via NextAuth v5
- **GitHub OAuth** — Developer-friendly GitHub sign-in
- **Magic Link** — Passwordless login via tokenized email (Gmail SMTP)

### 🏢 Multi-Tenant Workspaces
- Create and manage multiple workspaces per account
- Seamless workspace switching from the sidebar
- Role-based access control: **Admin** and **Member**
- Per-workspace data isolation (content, campaigns, billing)

### 📧 Email Invitation System
- Admins send tokenized invitation links to any email address
- Time-limited (7 days), single-use secure tokens stored in the database
- Branded HTML invitation emails via Nodemailer + Gmail SMTP
- Pending invitations dashboard with revoke capability
- Auto-accepts on click — links new or existing users directly into the workspace

### 🤖 AI Content Generation (Gemini)
- Powered by **Google Gemini 2.5 Flash** via `@google/genai`
- Generate four content types: **Blog Post**, **Tweet Thread**, **LinkedIn Post**, **Marketing Email**
- Each generation is guided by the workspace's custom **Brand Voice** (tone, target audience, core values, banned words)
- Credit system: workspaces consume credits per generation; Stripe subscriptions replenish them
- Graceful fallback to mock mode when `GEMINI_API_KEY` is not set

### 🎯 Campaign & Document Management
- Organize AI-generated content into **Campaigns** with statuses: `DRAFT`, `IN_PROGRESS`, `COMPLETED`
- Each campaign holds multiple **Content Documents** with their own lifecycle: `DRAFT`, `IN_REVIEW`, `APPROVED`
- Full CRUD via Server Actions — no exposed API routes needed

### 🎨 Brand Voice Configuration
- Per-workspace brand identity: tone, target audience, core values, and forbidden words
- Automatically applied as system instructions to every Gemini generation request
- Editable from the workspace **Brand** settings page

### 📊 Analytics Dashboard
- Interactive revenue charts powered by **Recharts**
- Key metrics: revenue, active users, growth trends
- Per-workspace data isolation

### 💳 Stripe Billing
- Subscription plans via Stripe Checkout
- Webhook handler for lifecycle events (`checkout.session.completed`, `customer.subscription.updated`)
- Billing portal access from within the dashboard
- Subscription status reflected in real-time via database sync

### 🛡️ Security & Architecture
- Database sessions stored in PostgreSQL via `@auth/prisma-adapter`
- Edge-compatible middleware (`middleware.ts`) for route protection
- All mutations handled by **Server Actions** — no API keys or secrets reach the client
- Password reset flow with time-limited, single-use tokens

### 🌓 Dark / Light Mode
- System-aware theme switching via `next-themes`
- Persistent user preference across sessions
- One-click toggle in the top navigation bar

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 16.2 (App Router, Turbopack) |
| **Language** | TypeScript 5 |
| **Styling** | Tailwind CSS 4 |
| **Auth** | NextAuth v5 (beta) + `@auth/prisma-adapter` |
| **Database** | PostgreSQL via [Neon](https://neon.tech) (serverless) |
| **ORM** | Prisma 7 with `pg` driver adapter |
| **AI** | Google Gemini 2.5 Flash (`@google/genai`) |
| **Email** | Nodemailer + Gmail SMTP |
| **Payments** | Stripe SDK v22 |
| **Charts** | Recharts |
| **Icons** | Lucide React |
| **Theme** | next-themes |
| **Deployment** | Vercel |

---

## 🗄️ Database Schema

The PostgreSQL schema is managed with Prisma and includes the following core models:

```
User              — Auth, profile, bcrypt password
Account           — OAuth provider accounts (NextAuth)
Session           — DB sessions (NextAuth)
VerificationToken — Magic link tokens
PasswordResetToken — Password reset tokens

Workspace         — Tenant unit with Stripe billing fields & AI credits
WorkspaceMember   — User ↔ Workspace junction with Role (ADMIN | MEMBER)
WorkspaceInvitation — Tokenized email invites with expiry

BrandVoice        — Per-workspace AI brand guidelines
Campaign          — Groups of content (DRAFT | IN_PROGRESS | COMPLETED)
ContentDocument   — AI-generated pieces (BLOG | TWEET | LINKEDIN | EMAIL)
                    with status (DRAFT | IN_REVIEW | APPROVED)
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js 20+**
- A [Neon](https://neon.tech) PostgreSQL database (free tier available)
- Google & GitHub OAuth applications
- A [Stripe](https://stripe.com) account (test mode is fine)
- A Gmail account with an [App Password](https://myaccount.google.com/apppasswords) enabled
- A [Google AI Studio](https://aistudio.google.com/app/apikey) API key for Gemini

### 1. Clone & Install

```bash
git clone https://github.com/shivam-giri/saas-next-dashboard.git
cd saas-next-dashboard
npm install
```

> `prisma generate` runs automatically via the `postinstall` script.

### 2. Configure Environment Variables

Create a `.env` file in the project root:

```env
# ─── Database ───────────────────────────────────────────────
DATABASE_URL="postgresql://user:password@host/dbname?sslmode=require"

# ─── NextAuth ───────────────────────────────────────────────
AUTH_SECRET="generate-with: openssl rand -base64 32"
NEXTAUTH_URL="http://localhost:3000"

# ─── Google OAuth ───────────────────────────────────────────
AUTH_GOOGLE_ID="your-google-client-id"
AUTH_GOOGLE_SECRET="your-google-client-secret"

# ─── GitHub OAuth ───────────────────────────────────────────
AUTH_GITHUB_ID="your-github-client-id"
AUTH_GITHUB_SECRET="your-github-client-secret"

# ─── Stripe ─────────────────────────────────────────────────
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_PRICE_ID="price_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# ─── Email (Gmail SMTP) ─────────────────────────────────────
SMTP_USER="you@gmail.com"
SMTP_PASS="your-16-char-app-password"

# ─── Google Gemini AI ────────────────────────────────────────
GEMINI_API_KEY="your-gemini-api-key"
# If omitted, the app runs in mock mode — AI responses are simulated locally.
```

### 3. Set Up the Database

```bash
npx prisma migrate dev
```

### 4. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📁 Project Structure

```
saas-next/
├── prisma/
│   ├── schema.prisma          # Full database schema
│   └── migrations/            # Migration history
│
├── src/
│   ├── app/
│   │   ├── page.tsx               # Public landing page
│   │   ├── layout.tsx             # Root layout (ThemeProvider)
│   │   │
│   │   ├── auth/
│   │   │   ├── signin/            # Sign-in (Password, Magic Link, OAuth)
│   │   │   └── signup/            # New account registration
│   │   │
│   │   ├── onboarding/            # Create first workspace after sign-up
│   │   ├── invite/[token]/        # Email invitation acceptance route
│   │   │
│   │   ├── dashboard/
│   │   │   ├── page.tsx           # Workspace redirect handler
│   │   │   └── [workspaceSlug]/
│   │   │       ├── layout.tsx     # Dashboard shell (Sidebar + TopNav)
│   │   │       ├── page.tsx       # Analytics overview & revenue charts
│   │   │       ├── team/          # Member management & invitations
│   │   │       ├── billing/       # Stripe subscription & billing portal
│   │   │       ├── brand/         # Brand Voice configuration
│   │   │       ├── campaigns/     # Campaign & document management
│   │   │       └── settings/      # Workspace settings
│   │   │
│   │   ├── actions/               # Server Actions (no client-exposed APIs)
│   │   │   ├── auth.ts            # Sign-in, sign-up, password reset
│   │   │   ├── workspace.ts       # Workspace creation & lookup
│   │   │   ├── team.ts            # Invitations, member roles, removal
│   │   │   ├── billing.ts         # Stripe Checkout & billing portal
│   │   │   ├── ai.ts              # Gemini generation, campaign & doc CRUD
│   │   │   └── settings.ts        # Workspace settings updates
│   │   │
│   │   └── api/
│   │       ├── auth/[...nextauth]/ # NextAuth handler
│   │       └── webhooks/stripe/    # Stripe webhook handler
│   │
│   ├── components/
│   │   ├── theme-provider.tsx      # next-themes wrapper
│   │   ├── theme-toggle.tsx        # Dark/Light mode toggle button
│   │   └── dashboard/
│   │       ├── sidebar.tsx         # Workspace switcher + nav links
│   │       ├── topnav.tsx          # Top navigation bar
│   │       ├── RevenueChart.tsx    # Recharts revenue chart
│   │       ├── invite-form.tsx     # Invite member form
│   │       ├── pending-invitations.tsx
│   │       ├── plan-badge.tsx      # Subscription plan indicator
│   │       ├── plan-badge-context.tsx
│   │       └── credits-badge.tsx   # Remaining AI credits display
│   │
│   ├── lib/
│   │   ├── auth.ts            # Full NextAuth config (Credentials + Magic Link)
│   │   ├── auth.config.ts     # Edge-safe config (Google + GitHub providers)
│   │   ├── prisma.ts          # Prisma client singleton
│   │   ├── mailer.ts          # Nodemailer + branded HTML email templates
│   │   ├── gemini.ts          # Google Gemini AI generation logic
│   │   └── stripe.ts          # Stripe client singleton
│   │
│   ├── types/                 # Shared TypeScript types
│   ├── middleware.ts           # Edge middleware — route protection
│   └── generated/prisma/      # Auto-generated Prisma client output
```

---

## 🌐 Routes Overview

| Route | Auth | Description |
|---|---|---|
| `/` | Public | Landing page |
| `/auth/signin` | Public | Sign-in (Password, Magic Link, Google, GitHub) |
| `/auth/signup` | Public | New account registration |
| `/onboarding` | Protected | Create first workspace |
| `/invite/[token]` | Public | Accept email workspace invitation |
| `/dashboard/[slug]` | Protected | Analytics overview & revenue charts |
| `/dashboard/[slug]/team` | Protected | Team members & invitation management |
| `/dashboard/[slug]/billing` | Protected | Stripe subscription & billing portal |
| `/dashboard/[slug]/brand` | Protected | Brand Voice configuration for AI |
| `/dashboard/[slug]/campaigns` | Protected | Campaign & AI content management |
| `/dashboard/[slug]/settings` | Protected (Admin) | Workspace settings |

---

## 🚢 Deployment (Vercel)

1. Push your code to GitHub
2. Import the repo at [vercel.com/new](https://vercel.com/new)
3. Add **all** environment variables in the Vercel dashboard
4. Update OAuth callback URLs to your production domain:
   - Google: `https://your-app.vercel.app/api/auth/callback/google`
   - GitHub: `https://your-app.vercel.app/api/auth/callback/github`
5. Create a **Stripe webhook** pointing to:
   `https://your-app.vercel.app/api/webhooks/stripe`
   — subscribe to `checkout.session.completed` and `customer.subscription.updated`

> **Note:** `prisma generate` runs automatically via the `postinstall` script during Vercel builds — no extra build command needed.

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to open an issue or submit a pull request.

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add some amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

---

## 📄 License

MIT © [Shivam Giri](https://github.com/shivam-giri)
