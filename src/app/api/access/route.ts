import { NextRequest, NextResponse } from "next/server";
import { checkSubscription } from "@/lib/mainlayer";
import { checkNftOwnership } from "@/lib/nft-check";

const NFT_CONTRACT = process.env.NFT_CONTRACT_ADDRESS ?? "";
const MAINLAYER_PLAN_ID = process.env.MAINLAYER_PLAN_ID ?? "pro";

export interface AccessResponse {
  granted: boolean;
  reason: "nft" | "subscription" | "denied";
  walletAddress?: string;
  expiresAt?: string;
}

export interface AccessError {
  error: string;
  code: "invalid_wallet" | "service_error" | "no_access";
}

/**
 * GET /api/access?wallet=0x...
 *
 * Two-tier access gate:
 * 1. Checks for required NFT ownership (free)
 * 2. Falls back to Mainlayer subscription (paid)
 *
 * Returns 200 with granted:true if either gate passes,
 * 403 if neither gate passes, 400 for validation errors.
 */
export async function GET(
  request: NextRequest
): Promise<NextResponse<AccessResponse | AccessError>> {
  try {
    const wallet = request.nextUrl.searchParams.get("wallet");

    // Validate wallet address format
    if (!wallet || !wallet.match(/^0x[a-fA-F0-9]{40}$/)) {
      return NextResponse.json(
        { error: "Invalid wallet address format", code: "invalid_wallet" },
        { status: 400 }
      );
    }

    // Check NFT ownership first (free tier)
    const nftResult = await checkNftOwnership(wallet, NFT_CONTRACT);
    if (nftResult.owns) {
      return NextResponse.json(
        {
          granted: true,
          reason: "nft",
          walletAddress: wallet,
        },
        { status: 200 }
      );
    }

    // Fall back to Mainlayer subscription (paid tier)
    const subscription = await checkSubscription(wallet);
    if (subscription.active) {
      return NextResponse.json(
        {
          granted: true,
          reason: "subscription",
          walletAddress: wallet,
          expiresAt: subscription.expiresAt ?? undefined,
        },
        { status: 200 }
      );
    }

    // Neither gate passed
    return NextResponse.json(
      {
        error: "Access requires NFT ownership or active subscription",
        code: "no_access",
      },
      { status: 403 }
    );
  } catch (error) {
    console.error("[access-gate] Error:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Service error",
        code: "service_error",
      },
      { status: 500 }
    );
  }
}
