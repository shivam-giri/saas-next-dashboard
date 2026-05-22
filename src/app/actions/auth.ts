"use server";

import { signIn } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { AuthError } from "next-auth";
import { redirect } from "next/navigation";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { sendPasswordResetEmail } from "@/lib/mailer";

export async function signUpAction(prevState: any, formData: FormData) {
 const email = (formData.get("email") as string)?.toLowerCase().trim();
 const password = formData.get("password") as string;
 const confirmPassword = formData.get("confirmPassword") as string;
 const name = formData.get("name") as string;
 const callbackUrl = (formData.get("callbackUrl") as string) || "/dashboard";

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
 email,
 name,
 password: hashedPassword,
 },
 });

 // Redirect to sign-in so the user logs in with their new credentials
 const signInUrl = callbackUrl !== "/dashboard" 
  ? `/auth/signin?callbackUrl=${encodeURIComponent(callbackUrl)}` 
  : "/auth/signin";
 redirect(signInUrl);
}

export async function signInCredentialsAction(prevState: any, formData: FormData) {
 const email = (formData.get("email") as string)?.toLowerCase().trim();
 const password = formData.get("password") as string;
 const callbackUrl = (formData.get("callbackUrl") as string) || "/dashboard";

 try {
 await signIn("credentials", {
 email,
 password,
 redirectTo: callbackUrl,
 });
 } catch (error) {
 if (isRedirectError(error)) throw error; // propagate Next.js NEXT_REDIRECT
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

 // Fallback redirect (only reached if signIn() returns without throwing)
 redirect(callbackUrl);
}

export async function signInMagicLinkAction(prevState: any, formData: FormData) {
 const email = (formData.get("email") as string)?.toLowerCase().trim();
 const callbackUrl = (formData.get("callbackUrl") as string) || "/dashboard";

 if (!email) return { error: "Email is required." };

 try {
 await signIn("nodemailer", { email, redirectTo: callbackUrl });
 } catch (error) {
 if (isRedirectError(error)) throw error;
 if (error instanceof AuthError) {
 return { error: "Failed to send magic link. Please try again." };
 }
 throw error;
 }
}

export async function forgotPasswordAction(prevState: any, formData: FormData) {
 const email = (formData.get("email") as string)?.toLowerCase().trim();

 if (!email) return { error: "Email is required." };

 // Always return success to prevent user-enumeration
 const successMsg = { success: "If that email exists, a reset link has been sent." };

 const user = await prisma.user.findUnique({ where: { email } });

 // User not found OR is an OAuth-only account (no password set) — silently succeed
 if (!user || !user.password) return successMsg;

 // Delete any existing tokens for this email before creating a new one
 await prisma.passwordResetToken.deleteMany({ where: { email } });

 const token = await prisma.passwordResetToken.create({
  data: {
   email,
   expiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
  },
 });

 const resetUrl = `${process.env.NEXTAUTH_URL}/auth/reset-password?token=${token.token}`;

 try {
  await sendPasswordResetEmail(email, resetUrl);
 } catch {
  return { error: "Failed to send reset email. Please try again." };
 }

 return successMsg;
}

export async function resetPasswordAction(prevState: any, formData: FormData) {
 const token = (formData.get("token") as string)?.trim();
 const password = formData.get("password") as string;
 const confirmPassword = formData.get("confirmPassword") as string;

 if (!token) return { error: "Invalid or missing reset token." };
 if (!password || password.length < 8)
  return { error: "Password must be at least 8 characters long." };
 if (password !== confirmPassword) return { error: "Passwords do not match." };

 const record = await prisma.passwordResetToken.findUnique({ where: { token } });

 if (!record) return { error: "This reset link is invalid." };
 if (record.expiresAt < new Date()) return { error: "This reset link has expired. Please request a new one." };

 const hashedPassword = await bcrypt.hash(password, 10);

 await prisma.$transaction([
  prisma.user.update({
   where: { email: record.email },
   data: { password: hashedPassword },
  }),
  prisma.passwordResetToken.delete({ where: { token } }),
 ]);

 redirect("/auth/signin?reset=success");
}
