"use server";

import { signIn } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { AuthError } from "next-auth";
import { redirect } from "next/navigation";
import { isRedirectError } from "next/dist/client/components/redirect-error";

export async function signUpAction(prevState: any, formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;
  const name = formData.get("name") as string;

  if (!email || !password || !name) {
    return { error: "Name, email, and password are required." };
  }

  if (password.length < 8) {
    return { error: "Password must be at least 8 characters long." };
  }

  if (password !== confirmPassword) {
    return { error: "Passwords do not match." };
  }

  const existingUser = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
  });

  if (existingUser) {
    return { error: "An account with this email already exists." };
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.user.create({
    data: {
      email: email.toLowerCase(),
      name,
      password: hashedPassword,
    },
  });

  // Sign in immediately after creation.
  // In NextAuth v5 beta + database sessions, signIn() may not throw NEXT_REDIRECT
  // reliably, so we catch AuthErrors explicitly then redirect manually.
  try {
    await signIn("credentials", {
      email: email.toLowerCase(),
      password,
      // No redirectTo here — we handle it below
    });
  } catch (error) {
    if (isRedirectError(error)) throw error; // propagate Next.js redirects
    if (error instanceof AuthError) {
      return { error: "Sign-in after registration failed. Please sign in manually." };
    }
    return { error: "Something went wrong." };
  }

  // Explicit redirect — reached only when signIn succeeds without throwing
  redirect("/onboarding");
}

export async function signInCredentialsAction(prevState: any, formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const callbackUrl = (formData.get("callbackUrl") as string) || "/dashboard";

  try {
    await signIn("credentials", {
      email: email.toLowerCase(),
      password,
      // No redirectTo — we redirect explicitly below so both code paths work
    });
  } catch (error) {
    if (isRedirectError(error)) throw error; // propagate if NextAuth does throw
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid email or password." };
        default:
          return { error: "Something went wrong. Please try again." };
      }
    }
    return { error: "Something went wrong. Please try again." };
  }

  // signIn() returned normally (success without throwing) — redirect manually
  redirect(callbackUrl);
}

export async function signInMagicLinkAction(prevState: any, formData: FormData) {
  const email = formData.get("email") as string;
  const callbackUrl = (formData.get("callbackUrl") as string) || "/dashboard";

  if (!email) return { error: "Email is required." };

  try {
    await signIn("nodemailer", { email: email.toLowerCase(), redirectTo: callbackUrl });
  } catch (error) {
    if (isRedirectError(error)) throw error;
    if (error instanceof AuthError) {
      return { error: "Failed to send magic link. Please try again." };
    }
    throw error;
  }
}
