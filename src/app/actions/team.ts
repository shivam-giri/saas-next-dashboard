"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function inviteUserAction(formData: FormData, workspaceSlug: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const email = formData.get("email") as string;
  const role = formData.get("role") as "ADMIN" | "MEMBER";

  if (!email) throw new Error("Email is required");
  if (!["ADMIN", "MEMBER"].includes(role)) throw new Error("Invalid role");

  // Verify the current user is an admin of the workspace
  const currentUserMembership = await prisma.workspaceMember.findFirst({
    where: {
      userId: session.user.id,
      workspace: { slug: workspaceSlug },
    },
  });

  if (currentUserMembership?.role !== "ADMIN") {
    throw new Error("Only admins can invite new members.");
  }

  // Find the target user
  const targetUser = await prisma.user.findUnique({
    where: { email },
  });

  if (!targetUser) {
    throw new Error("No user found with that email address. They must log in first.");
  }

  // Add the user to the workspace
  try {
    await prisma.workspaceMember.create({
      data: {
        userId: targetUser.id,
        workspaceId: currentUserMembership.workspaceId,
        role: role,
      },
    });
  } catch (err: any) {
    if (err.code === "P2002") {
      throw new Error("User is already a member of this workspace.");
    }
    throw new Error("Failed to invite user.");
  }

  revalidatePath(`/dashboard/${workspaceSlug}/team`);
}

export async function removeMemberAction(memberId: string, workspaceSlug: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  // Verify the current user is an admin
  const currentUserMembership = await prisma.workspaceMember.findFirst({
    where: {
      userId: session.user.id,
      workspace: { slug: workspaceSlug },
    },
  });

  if (currentUserMembership?.role !== "ADMIN") {
    throw new Error("Only admins can remove members.");
  }

  // Optional: Prevent removing yourself if you are the last admin, but keeping it simple for now
  if (currentUserMembership.id === memberId) {
    throw new Error("You cannot remove yourself through this dashboard. Please contact support.");
  }

  // Remove the member
  await prisma.workspaceMember.delete({
    where: {
      id: memberId,
      // Security measure: Ensure the member we're deleting actually belongs to the same workspace
      workspaceId: currentUserMembership.workspaceId, 
    },
  });

  revalidatePath(`/dashboard/${workspaceSlug}/team`);
}
