import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2026-03-25.dahlia" as any,
  typescript: true,
});

/**
 * Utility function to determine if a workspace has an active Pro subscription
 */
export function hasActiveSubscription(
  stripeSubscriptionId?: string | null,
  stripeCurrentPeriodEnd?: Date | null
) {
  if (!stripeSubscriptionId || !stripeCurrentPeriodEnd) {
    return false;
  }

  // Check if the current date is before the end of the billing period
  // We add a 1-day grace period to prevent false negatives across timezones
  return stripeCurrentPeriodEnd.getTime() + 86_400_000 > Date.now();
}
