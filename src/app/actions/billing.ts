"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export async function createCheckoutSession(workspaceId: string) {
 const session = await auth();
 if (!session?.user?.id) throw new Error("Unauthorized");

 const resolvedHeaders = await headers();
 const domain = resolvedHeaders.get("origin") || "http://localhost:3000";

 // Verify they are actually an admin of this workspace!
 const membership = await prisma.workspaceMember.findFirst({
 where: { userId: session.user.id, workspaceId, role: "ADMIN" },
 include: { workspace: true },
 });

 if (!membership) throw new Error("Unauthorized or not Admin");

 const workspace = membership.workspace;

 let stripeCustomerId = workspace.stripeCustomerId;

 // Let's create a Customer in Strip if we haven't already
 if (!stripeCustomerId) {
 const customer = await stripe.customers.create({
 name: workspace.name,
 metadata: { workspaceId: workspace.id }, // Super important for webhooks!
 });
 
 await prisma.workspace.update({
 where: { id: workspace.id },
 data: { stripeCustomerId: customer.id },
 });
 
 stripeCustomerId = customer.id;
 }

 // Create the checkout session
 const stripeSession = await stripe.checkout.sessions.create({
 customer: stripeCustomerId,
 mode: "subscription",
 payment_method_types: ["card"],
 line_items: [
 {
 // This is a dummy Stripe Price ID for now
 price: process.env.STRIPE_PRICE_ID || "price_mock_123",
 quantity: 1,
 },
 ],
 subscription_data: {
 metadata: { workspaceId: workspace.id },
 },
 metadata: { workspaceId: workspace.id },
 success_url: `${domain}/dashboard/${workspace.slug}/billing?success=true`,
 cancel_url: `${domain}/dashboard/${workspace.slug}/billing?canceled=true`,
 });

 // Redirect the browser to Stripe Checkout!
 if (stripeSession.url) {
 redirect(stripeSession.url);
 } else {
 throw new Error("Failed to create Stripe session");
 }
}
