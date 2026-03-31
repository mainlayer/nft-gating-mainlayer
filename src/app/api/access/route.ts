import { NextRequest, NextResponse } from "next/server";
import { checkSubscription } from "@/lib/mainlayer";
import { checkNftOwnership } from "@/lib/nft-check";

const NFT_CONTRACT = process.env.NFT_CONTRACT_ADDRESS ?? "";
const MAINLAYER_PLAN_ID = process.env.MAINLAYER_PLAN_ID ?? "pro";

export interface AccessResponse {
  granted: boolean;
  reason: "nft" | "subscription" | "denied";
}

/**
 * GET /api/access?wallet=0x...
 *
 * Returns access granted if the wallet holds the required NFT
 * OR has an active Mainlayer subscription.
 */
export async function GET(request: NextRequest): Promise<NextResponse<AccessResponse>> {
  const wallet = request.nextUrl.searchParams.get("wallet");

  if (!wallet) {
    return NextResponse.json(
      { granted: false, reason: "denied" },
      { status: 400 }
    );
  }

  // Check NFT ownership first (free gate)
  const nftResult = await checkNftOwnership(wallet, NFT_CONTRACT);
  if (nftResult.owns) {
    return NextResponse.json({ granted: true, reason: "nft" });
  }

  // Fall back to Mainlayer subscription gate
  const subscription = await checkSubscription(wallet);
  if (subscription.active) {
    return NextResponse.json({ granted: true, reason: "subscription" });
  }

  return NextResponse.json({ granted: false, reason: "denied" }, { status: 403 });
}
