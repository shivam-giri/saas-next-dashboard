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
    // JWT strategy works with ALL providers (Credentials + OAuth).
    // Database strategy breaks Credentials logins because NextAuth cannot
    // create a DB Session without a linked Account row.
    strategy: "jwt",
  },
  callbacks: {
    // Encode the DB user id into the JWT token on sign-in
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    // Expose the user id to the client session
    session({ session, token }) {
      if (session.user && token.id) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
