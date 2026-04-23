"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export async function createWorkspaceAction(formData: FormData) {
 const session = await auth();
 const userId = session?.user?.id;
 if (!userId) {
 throw new Error("Unauthorized");
 }

 const workspaceName = formData.get("workspaceName") as string;
 if (!workspaceName || workspaceName.trim() === "") {
 throw new Error("Workspace name is required");
 }

 // Auto-generate a URL-friendly slug (e.g. "My Startup" -> "my-startup")
 const slug = workspaceName.toLowerCase().replace(/[^a-z0-9]+/g, "-");

 // Run a database transaction to create the Workspace AND the Membership simultaneously
 await prisma.$transaction(async (tx) => {
 // Ensure slug doesn't already exist
 const existing = await tx.workspace.findUnique({ where: { slug } });
 if (existing) {
 throw new Error("Workspace already exists");
 }

 const newWorkspace = await tx.workspace.create({
 data: {
 name: workspaceName,
 slug: slug,
 },
 });

 // The user creating this workspace is instantly granted the ADMIN role
 await tx.workspaceMember.create({
 data: {
 userId: userId,
 workspaceId: newWorkspace.id,
 role: "ADMIN",
 },
 });
 });

 // Successful creation! Redirect them to their brand new dashboard.
 redirect(`/dashboard/${slug}`);
}
