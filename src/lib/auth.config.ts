import type { NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";

// Notice this is just a configuration object, no database adapter is imported here!
export const authConfig = {
  providers: [Google],
  session: {
    // We are using database sessions for now.
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
