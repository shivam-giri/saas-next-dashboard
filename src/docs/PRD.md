# Product Requirements Document (PRD): SaaSify

## 1. Executive Summary & App Overview

**SaaSify** is a production-grade, multi-tenant AI-powered SaaS platform. The core idea behind the application is to provide marketing teams, agencies, and founders with a unified workspace to manage their brand identity and automatically generate high-quality, on-brand content (Blog Posts, Tweets, LinkedIn posts, and Marketing Emails) using advanced AI. 

The application is built to handle the entire lifecycle of content creation: from initial AI generation guided by a strict "Brand Voice" to a full review and approval workflow involving team members and workspace administrators. It monetizes this value through a Stripe-powered credit and subscription system.

## 2. Exactly What We Have Built

We have developed a full-stack, scalable Next.js 16 application with the following core pillars fully implemented:

1. **Robust Authentication & Security**: Passwordless magic links, traditional credentials, and social logins (Google & GitHub) powered by NextAuth v5.
2. **True Multi-Tenancy**: Users can create and switch between multiple workspaces. Data, billing, and content are strictly isolated per workspace.
3. **Role-Based Access Control & Team Collaboration**: Workspace Admins can invite Members via secure email links. Admins have overarching control to manage billing, brand voice, and review/approve AI content.
4. **AI Content Engine**: Integration with Google Gemini 2.5 Flash to dynamically generate specific content formats that strictly adhere to a workspace's custom "Brand Voice" rules.
5. **Content Workflow**: A tiered organizational structure where "Campaigns" group together multiple "Content Documents". Documents go through a specific lifecycle (`DRAFT` → `IN_REVIEW` → `APPROVED`), complete with an admin feedback loop (commenting system).
6. **Monetization & Analytics**: A credit-based usage system hooked into Stripe subscriptions and webhooks, accompanied by an analytics dashboard to track revenue and usage.

## 3. Feature List

### 🔐 Authentication & Onboarding
- **Multi-Provider Login**: Email/Password, Google OAuth, GitHub OAuth, and Magic Links.
- **Onboarding Flow**: Forces new users to create their first workspace before accessing the dashboard.

### 🏢 Workspace & Team Management
- **Workspace Switcher**: Seamless UI to jump between different workspaces.
- **Role Management**: `ADMIN` and `MEMBER` roles with distinct permissions.
- **Email Invitations**: Secure, single-use, 7-day expiring email invitations powered by Nodemailer and Gmail SMTP.
- **Pending Invites Dashboard**: Admins can view and revoke pending invitations.

### 🎨 Brand Voice Configuration
- **Custom Brand Identity**: Admins define Tone, Target Audience, Core Values, and "Do Not Use" words.
- **AI Context**: This brand voice is automatically injected as system instructions into all Gemini AI generation requests for the workspace.

### 🤖 AI Content Generation
- **Campaign Creation**: Users input a single topic/prompt and select desired formats (Blog, Tweet, LinkedIn, Email).
- **Synchronous Generation**: The AI generates all selected formats simultaneously, deducting the appropriate number of credits from the workspace.
- **Mock Mode**: Graceful fallback when the Gemini API key is missing.

### 📝 Document Review & Approval Workflow
- **Lifecycle Statuses**: Documents start as `DRAFT`, are submitted to `IN_REVIEW`, and finally marked as `APPROVED`.
- **Inline Editing**: The original creator can freely edit a document while it is in the `DRAFT` state.
- **Admin Feedback Loop**: Admins can review documents and leave an `adminComment` (feedback/requested changes) directly on the document card. Members can read this feedback and adjust the draft.
- **Publish Ready**: One-click copy-to-clipboard functionality for approved content.

### 💳 Billing & Analytics
- **Credit System**: AI generations cost credits. Free tiers have hard limits.
- **Stripe Integration**: Checkout sessions and webhooks (`checkout.session.completed`, `customer.subscription.updated`) for upgrading plans and replenishing credits.
- **Dashboard Analytics**: Visual revenue and usage charts built with Recharts.

### 🌓 User Experience
- **Dark/Light Mode**: System-aware theme toggling with persistent state.
- **Responsive Design**: Polished UI built with Tailwind CSS 4.

## 4. User Flows

### A. The Creator Flow
1. **Sign Up**: User signs up via Google OAuth.
2. **Onboarding**: User is prompted to name and create their first Workspace.
3. **Brand Setup**: User navigates to the Brand tab and defines their startup's tone and restricted words.
4. **Generation**: User creates a Campaign called "Product Launch", requests a Blog Post and a Tweet, and provides a topic description. The AI generates the content and deducts 2 credits.
5. **Review**: The user reviews the content, makes manual edits in the text area, and marks it as ready.

### B. The Team Collaboration Flow
1. **Invite**: The Workspace Admin goes to the Team tab and invites a colleague (`colleague@example.com`) as a Member.
2. **Acceptance**: The colleague clicks the link in their email and is immediately dropped into the workspace.
3. **Drafting**: The Member generates a new Campaign. They tweak the generated Draft and click "Submit for Review".
4. **Feedback**: The Admin reviews the document. They aren't satisfied, so they leave a comment in the "Admin Feedback" box and click "Reject" (sending it back to `DRAFT`).
5. **Approval**: The Member sees the feedback, updates the text, and resubmits. The Admin clicks "Approve".

## 5. Technical Stack Overview

- **Core**: Next.js 16.2 (App Router), React 19, TypeScript 5
- **Styling**: Tailwind CSS 4, Lucide React (Icons), `next-themes`
- **Database**: PostgreSQL (hosted on Neon.tech)
- **ORM**: Prisma 7
- **Authentication**: NextAuth v5 (Beta) + `@auth/prisma-adapter`
- **AI Integration**: Google Gemini 2.5 Flash (`@google/genai`)
- **Payments**: Stripe SDK v22
- **Data Visualization**: Recharts

## 6. Database Schema Summary

- **Auth Layer**: `User`, `Account`, `Session`, `VerificationToken`, `PasswordResetToken`
- **Tenant Layer**: `Workspace`, `WorkspaceMember`, `WorkspaceInvitation`
- **Feature Layer**: 
  - `BrandVoice` (1-to-1 with Workspace)
  - `Campaign` (1-to-Many with Workspace)
  - `ContentDocument` (1-to-Many with Campaign, contains `adminComments` and `status`)
