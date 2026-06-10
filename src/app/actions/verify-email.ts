"use server";

import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export async function verifyEmailOTPAction(prevState: any, formData: FormData) {
  const email = (formData.get("email") as string)?.toLowerCase().trim();
  const otp = (formData.get("otp") as string)?.trim();

  if (!email || !otp) {
    return { error: "Missing email or verification code." };
  }

  const record = await prisma.verificationToken.findFirst({
    where: { 
      identifier: email,
      token: otp 
    },
  });

  if (!record) {
    return { error: "Invalid verification code." };
  }

  if (record.expires < new Date()) {
    return { error: "Verification code has expired. Please sign up again." };
  }

  // Update user
  await prisma.$transaction([
    prisma.user.update({
      where: { email: record.identifier },
      data: { emailVerified: new Date() },
    }),
    prisma.verificationToken.delete({
      where: {
        identifier_token: {
          identifier: record.identifier,
          token: record.token,
        },
      },
    }),
  ]);

  // Redirect to sign in with success message
  redirect("/auth/signin?verify=success");
}
