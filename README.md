<div align="center">

<h1>⚡ SaaSify</h1>

<p><strong>A production-grade, multi-tenant SaaS dashboard built with Next.js 16</strong></p>

<p>
  <img src="https://img.shields.io/badge/Next.js-16.2-black?logo=next.js&logoColor=white" alt="Next.js" />
  <img src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Prisma-7-2D3748?logo=prisma&logoColor=white" alt="Prisma" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-4-38BDF8?logo=tailwindcss&logoColor=white" alt="Tailwind" />
  <img src="https://img.shields.io/badge/PostgreSQL-Neon-00E699?logo=postgresql&logoColor=white" alt="Neon" />
</p>

<p>
  <a href="https://github.com/shivam-giri/saas-next-dashboard"><strong>GitHub →</strong></a>
</p>

</div>

---

## ✨ Features

### 🔐 Authentication — 4 Sign-in Methods
- **Email + Password** — Traditional credentials with bcrypt hashing
- **Google OAuth** — One-click Google sign-in via NextAuth v5
- **GitHub OAuth** — Developer-friendly GitHub sign-in
- **Email Magic Link** — Passwordless login via Gmail SMTP

### 🏢 Multi-Tenant Workspaces
- Create and manage multiple workspaces per account
- Workspace switching from a unified sidebar
- Role-based access control: **Owner**, **Admin**, **Member**

### 📧 Email Invitation System
- Admins send tokenized invitation links to any email address
- Time-limited (7 days), single-use secure tokens
- Branded HTML invitation emails via Nodemailer / Gmail SMTP
- Pending invitations dashboard with revoke capability
- Auto-accepts on click — links new users directly into the workspace

### 📊 Analytics Dashboard
- Interactive charts powered by **Recharts**
- Real-time metrics: revenue, active users, growth trends
- Per-workspace data isolation

### 💳 Stripe Billing
- Subscription plans with Stripe Checkout
- Webhook handler for lifecycle events (`subscription.updated`, `checkout.session.completed`)
- Billing portal access from the dashboard

### 🛡️ Security
- Database sessions stored in PostgreSQL via PrismaAdapter
- Edge-compatible middleware for route protection
- Server Actions for all mutations — no exposed API keys on the client

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 16 (App Router, Turbopack) |
| **Language** | TypeScript 5 |
| **Styling** | Tailwind CSS 4 |
| **Auth** | NextAuth v5 (beta) + PrismaAdapter |
| **Database** | PostgreSQL via [Neon](https://neon.tech) (serverless) |
| **ORM** | Prisma 7 with pg driver adapter |
| **Email** | Nodemailer + Gmail SMTP |
| **Payments** | Stripe SDK v22 |
| **Charts** | Recharts |
| **Icons** | Lucide React |
| **Deployment** | Vercel |

---

## 🚀 Getting Started

### Prerequisites

- Node.js 20+
- A [Neon](https://neon.tech) PostgreSQL database
- Google & GitHub OAuth applications
- Stripe account (for billing)
- Gmail account with [App Password](https://myaccount.google.com/apppasswords) enabled

### 1. Clone & Install

```bash
git clone https://github.com/shivam-giri/saas-next-dashboard.git
cd saas-next-dashboard
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the root:

```env
# Database
DATABASE_URL="postgresql://..."

# NextAuth
AUTH_SECRET="your-secret"
NEXTAUTH_URL="http://localhost:3000"

# Google OAuth
AUTH_GOOGLE_ID="..."
AUTH_GOOGLE_SECRET="..."

# GitHub OAuth
AUTH_GITHUB_ID="..."
AUTH_GITHUB_SECRET="..."

# Stripe
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_PRICE_ID="price_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# Email (Gmail SMTP)
SMTP_USER="you@gmail.com"
SMTP_PASS="your-16-char-app-password"
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
src/
├── app/
│   ├── auth/              # Sign-in & Sign-up pages
│   ├── dashboard/         # Protected workspace dashboard
│   │   └── [workspaceSlug]/
│   │       ├── analytics/
│   │       ├── billing/
│   │       └── team/      # Member & invitation management
│   ├── invite/[token]/    # Email invitation acceptance route
│   ├── onboarding/        # New user workspace creation
│   └── api/               # Stripe webhook + NextAuth handlers
├── components/
│   └── dashboard/         # Sidebar, charts, invite form, etc.
├── lib/
│   ├── auth.ts            # Full NextAuth config (Credentials + Email)
│   ├── auth.config.ts     # Edge-safe config (Google + GitHub)
│   ├── mailer.ts          # Nodemailer transporter + email templates
│   └── prisma.ts          # Prisma client singleton
└── app/actions/           # Server Actions (auth, workspace, team, stripe)

prisma/
├── schema.prisma          # Database schema
└── migrations/            # Migration history
```

---

## 🌐 Deployment (Vercel)

1. Push your code to GitHub
2. Import the repo at [vercel.com/new](https://vercel.com/new)
3. Add all environment variables in the Vercel dashboard
4. Update OAuth callback URLs to your production domain:
   - Google: `https://your-app.vercel.app/api/auth/callback/google`
   - GitHub: `https://your-app.vercel.app/api/auth/callback/github`
5. Create a Stripe webhook pointing to `https://your-app.vercel.app/api/webhooks/stripe`

> **Note:** `prisma generate` runs automatically via the `postinstall` script during Vercel builds.

---

## 📸 Routes Overview

| Route | Description |
|---|---|
| `/` | Public landing page |
| `/auth/signin` | Unified sign-in (Password, Magic Link, Google, GitHub) |
| `/auth/signup` | New account registration |
| `/onboarding` | Create first workspace after sign-up |
| `/dashboard/[slug]` | Workspace analytics overview |
| `/dashboard/[slug]/team` | Team management & invitations |
| `/dashboard/[slug]/billing` | Subscription & billing |
| `/invite/[token]` | Email invitation acceptance |

---

## 📄 License

BIT © [Shivam Giri](https://github.com/shivam-giri)
