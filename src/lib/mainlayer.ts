import MainlayerSDK from "@mainlayer/sdk";

/**
 * Initialize Mainlayer SDK client.
 * Requires MAINLAYER_API_KEY environment variable.
 */
const apiKey = process.env.MAINLAYER_API_KEY;
if (!apiKey) {
  throw new Error(
    "MAINLAYER_API_KEY environment variable is required. " +
    "Get your key at https://dashboard.mainlayer.fr"
  );
}

const mainlayer = new MainlayerSDK({ apiKey });

export interface SubscriptionStatus {
  active: boolean;
  plan: string | null;
  expiresAt: string | null;
  status?: "active" | "trialing" | "past_due" | "cancelled";
}

/**
 * Check whether a wallet address holds an active Mainlayer subscription.
 *
 * @param walletAddress The wallet address to check
 * @returns Subscription status including active state, plan, and expiration
 * @throws Error if the API call fails
 *
 * @example
 * const status = await checkSubscription("0x...");
 * if (status.active) {
 *   console.log(`Active on plan: ${status.plan}`);
 *   console.log(`Expires: ${status.expiresAt}`);
 * }
 */
export async function checkSubscription(
  walletAddress: string
): Promise<SubscriptionStatus> {
  if (!walletAddress) {
    throw new Error("Wallet address is required");
  }

  try {
    const result = await mainlayer.subscriptions.check({ customer: walletAddress });

    return {
      active: result.status === "active" || result.status === "trialing",
      plan: result.plan ?? null,
      expiresAt: result.current_period_end ?? null,
      status: result.status,
    };
  } catch (error) {
    console.error("[mainlayer] Subscription check failed:", error);
    throw new Error(
      `Failed to check subscription for ${walletAddress}: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}

/**
 * Create a Mainlayer checkout session for a new subscription.
 *
 * @param walletAddress The customer wallet address
 * @param planId The plan ID to subscribe to
 * @param successUrl URL to redirect to after successful payment
 * @param cancelUrl URL to redirect to if user cancels payment
 * @returns Object with checkout URL
 * @throws Error if the session creation fails
 *
 * @example
 * const { url } = await createCheckoutSession(
 *   "0x...",
 *   "pro-monthly",
 *   "https://myapp.com/success",
 *   "https://myapp.com/billing"
 * );
 * // Redirect user to url
 */
export async function createCheckoutSession(
  walletAddress: string,
  planId: string,
  successUrl: string,
  cancelUrl: string
): Promise<{ url: string; sessionId?: string }> {
  if (!walletAddress || !planId || !successUrl || !cancelUrl) {
    throw new Error("All parameters (wallet, plan, URLs) are required");
  }

  try {
    const session = await mainlayer.checkout.create({
      customer: walletAddress,
      plan: planId,
      success_url: successUrl,
      cancel_url: cancelUrl,
    });

    return {
      url: session.url,
      sessionId: session.id,
    };
  } catch (error) {
    console.error("[mainlayer] Checkout creation failed:", error);
    throw new Error(
      `Failed to create checkout for ${planId}: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}

export default mainlayer;
