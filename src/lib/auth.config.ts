import type { NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";
import GitHub from "next-auth/providers/github";

// Edge-safe providers only (no Prisma, no nodemailer)
export const authConfig = {
  providers: [Google, GitHub],
  pages: {
    signIn: "/auth/signin",
    newUser: "/onboarding",
  },
  session: {
    strategy: "database",
  },
  callbacks: {
    session({ session, user }) {
      if (session.user && user) {
        session.user.id = user.id;
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
