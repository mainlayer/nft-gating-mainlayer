import MainlayerSDK from "@mainlayer/sdk";

const mainlayer = new MainlayerSDK({
  apiKey: process.env.MAINLAYER_API_KEY!,
});

export interface SubscriptionStatus {
  active: boolean;
  plan: string | null;
  expiresAt: string | null;
}

/**
 * Check whether a wallet address holds an active Mainlayer subscription.
 */
export async function checkSubscription(
  walletAddress: string
): Promise<SubscriptionStatus> {
  const result = await mainlayer.subscriptions.check({ customer: walletAddress });
  return {
    active: result.status === "active",
    plan: result.plan ?? null,
    expiresAt: result.current_period_end ?? null,
  };
}

/**
 * Create a Mainlayer checkout session for a new subscription.
 */
export async function createCheckoutSession(
  walletAddress: string,
  planId: string,
  successUrl: string,
  cancelUrl: string
): Promise<{ url: string }> {
  const session = await mainlayer.checkout.create({
    customer: walletAddress,
    plan: planId,
    success_url: successUrl,
    cancel_url: cancelUrl,
  });
  return { url: session.url };
}

export default mainlayer;
