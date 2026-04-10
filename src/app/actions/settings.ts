"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export async function updateWorkspaceAction(formData: FormData, currentSlug: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const newName = formData.get("name") as string;
  let newSlug = formData.get("slug") as string;

  if (!newName || !newSlug) throw new Error("Name and Slug are required");

  // Format slug strictly
  newSlug = newSlug.toLowerCase().replace(/[^a-z0-9-]/g, "");

  // Verify admin
  const currentUserMembership = await prisma.workspaceMember.findFirst({
    where: {
      userId: session.user.id,
      workspace: { slug: currentSlug },
    },
  });

  if (currentUserMembership?.role !== "ADMIN") {
    throw new Error("Only admins can update workspace settings.");
  }

  // If the slug changed, verify uniqueness
  if (currentSlug !== newSlug) {
    const existing = await prisma.workspace.findUnique({
      where: { slug: newSlug },
    });
    if (existing) {
      throw new Error("Workspace slug is already taken.");
    }
  }

  await prisma.workspace.update({
    where: {
      id: currentUserMembership.workspaceId,
    },
    data: {
      name: newName,
      slug: newSlug,
    },
  });

  if (currentSlug !== newSlug) {
    redirect(`/dashboard/${newSlug}/settings`);
  }
}

export async function deleteWorkspaceAction(formData: FormData, currentSlug: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  // Verify admin
  const currentUserMembership = await prisma.workspaceMember.findFirst({
    where: {
      userId: session.user.id,
      workspace: { slug: currentSlug },
    },
    include: {
      workspace: true
    }
  });

  if (currentUserMembership?.role !== "ADMIN") {
    throw new Error("Only admins can delete workspaces.");
  }

  const confirmText = formData.get("confirmText") as string;
  if (confirmText !== currentUserMembership.workspace.name) {
      throw new Error("Confirmation text did not match the workspace name exactly.");
  }

  // Delete the workspace. Due to onDelete: Cascade the WorkspaceMembers will also be removed.
  await prisma.workspace.delete({
    where: {
      id: currentUserMembership.workspaceId,
    },
  });

  redirect("/onboarding");
}
