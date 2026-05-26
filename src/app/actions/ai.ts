"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateContent } from "@/lib/gemini";
import { revalidatePath } from "next/cache";

export async function saveBrandVoiceAction(workspaceId: string, formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Unauthorized" };

  const tone = formData.get("tone") as string;
  const targetAudience = formData.get("targetAudience") as string;
  const doNotUseWords = formData.get("doNotUseWords") as string;
  const coreValues = formData.get("coreValues") as string;

  // Validate admin access
  const membership = await prisma.workspaceMember.findUnique({
    where: { userId_workspaceId: { userId: session.user.id, workspaceId } },
  });

  if (!membership || membership.role !== "ADMIN") {
    return { error: "Only admins can update brand settings." };
  }

  await prisma.brandVoice.upsert({
    where: { workspaceId },
    update: { tone, targetAudience, doNotUseWords, coreValues },
    create: { workspaceId, tone, targetAudience, doNotUseWords, coreValues },
  });

  revalidatePath(`/dashboard/[workspaceSlug]/brand`, "page");
  return { success: true };
}

export async function createCampaignAction(workspaceId: string, formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Unauthorized" };

  const name = formData.get("name") as string;
  const topic = formData.get("topic") as string;
  const selectedTypes = formData.getAll("types") as string[];
  
  if (!name || !topic) return { error: "Name and topic are required." };
  if (!selectedTypes || selectedTypes.length === 0) return { error: "Please select at least one content type." };

  const membership = await prisma.workspaceMember.findUnique({
    where: { userId_workspaceId: { userId: session.user.id, workspaceId } },
  });

  if (!membership) return { error: "Unauthorized" };

  // Fetch the Brand Voice
  const brandVoice = await prisma.brandVoice.findUnique({ where: { workspaceId } });

  // 1. Create the Campaign Record
  const campaign = await prisma.campaign.create({
    data: {
      workspaceId,
      name,
      topic,
      status: "IN_PROGRESS",
    },
  });

  try {
    // 2. Generate Content asynchronously
    // In a production app, we would use a background job (like Inngest/BullMQ).
    // Run all generations in parallel based on selected types
    const generationPromises = selectedTypes.map(async (typeStr) => {
      const type = typeStr as "BLOG" | "TWEET" | "LINKEDIN" | "EMAIL";
      const generatedText = await generateContent({
        topic,
        type,
        brandVoice,
      });

      return prisma.contentDocument.create({
        data: {
          campaignId: campaign.id,
          workspaceId,
          title: `${type} Draft`,
          content: generatedText,
          type: type,
          status: "DRAFT",
          createdById: session.user.id,
        },
      });
    });

    await Promise.all(generationPromises);

    // Update campaign status
    await prisma.campaign.update({
      where: { id: campaign.id },
      data: { status: "COMPLETED" },
    });

  } catch (err) {
    console.error("Campaign generation failed:", err);
    return { error: "Failed to generate some or all content." };
  }

  revalidatePath(`/dashboard/[workspaceSlug]/campaigns`, "page");
  return { success: true, campaignId: campaign.id };
}

export async function updateDocumentStatusAction(
  documentId: string,
  status: "DRAFT" | "IN_REVIEW" | "APPROVED",
  workspaceId: string
) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Unauthorized" };

  const membership = await prisma.workspaceMember.findUnique({
    where: { userId_workspaceId: { userId: session.user.id, workspaceId } },
  });

  if (!membership) return { error: "Unauthorized" };

  // Only Admins can approve
  if (status === "APPROVED" && membership.role !== "ADMIN") {
    return { error: "Only Admins can approve content." };
  }

  await prisma.contentDocument.update({
    where: { id: documentId },
    data: { status },
  });

  revalidatePath(`/dashboard/[workspaceSlug]/campaigns/[campaignId]`, "page");
  return { success: true };
}

export async function updateDocumentContentAction(
  documentId: string,
  content: string,
  workspaceId: string
) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Unauthorized" };

  const document = await prisma.contentDocument.findUnique({
    where: { id: documentId },
  });

  if (!document) return { error: "Document not found" };

  // Strict check: Only the user who generated it can edit it
  if (document.createdById !== session.user.id) {
    return { error: "Only the creator of this draft can edit it." };
  }

  if (document.status !== "DRAFT") {
    return { error: "Only DRAFT documents can be edited." };
  }

  await prisma.contentDocument.update({
    where: { id: documentId },
    data: { content },
  });

  revalidatePath(`/dashboard/[workspaceSlug]/campaigns/[campaignId]`, "page");
  return { success: true };
}

export async function deleteDocumentAction(
  documentId: string,
  workspaceId: string
) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Unauthorized" };

  const document = await prisma.contentDocument.findUnique({
    where: { id: documentId },
  });

  if (!document) return { error: "Document not found" };

  // Strict check: Only the user who generated it can delete it
  if (document.createdById !== session.user.id) {
    return { error: "Only the creator of this draft can delete it." };
  }

  await prisma.contentDocument.delete({
    where: { id: documentId },
  });

  revalidatePath(`/dashboard/[workspaceSlug]/campaigns/[campaignId]`, "page");
  return { success: true };
}

export async function deleteCampaignAction(campaignId: string, workspaceId: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Unauthorized" };

  const membership = await prisma.workspaceMember.findUnique({
    where: { userId_workspaceId: { userId: session.user.id, workspaceId } },
  });

  if (!membership || membership.role !== "ADMIN") {
    return { error: "Only admins can delete campaigns." };
  }

  const campaign = await prisma.campaign.findUnique({
    where: { id: campaignId },
  });

  if (!campaign || campaign.workspaceId !== workspaceId) {
    return { error: "Campaign not found" };
  }

  await prisma.campaign.delete({
    where: { id: campaignId },
  });

  revalidatePath(`/dashboard/[workspaceSlug]/campaigns`, "page");
  return { success: true };
}
