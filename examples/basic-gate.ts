/**
 * Basic example: check access for a wallet address.
 *
 * Run:
 *   MAINLAYER_API_KEY=ml_... NFT_CONTRACT_ADDRESS=0x... npx ts-node examples/basic-gate.ts
 */

import { checkSubscription } from "../src/lib/mainlayer";
import { checkNftOwnership } from "../src/lib/nft-check";

const WALLET = process.env.DEMO_WALLET ?? "0xDemoWallet000000000000000000000000000000";
const NFT_CONTRACT = process.env.NFT_CONTRACT_ADDRESS ?? "0xNFTContract";

async function main() {
  console.log(`Checking access for wallet: ${WALLET}`);

  const nft = await checkNftOwnership(WALLET, NFT_CONTRACT);
  if (nft.owns) {
    console.log("Access granted via NFT ownership (token:", nft.tokenId, ")");
    return;
  }

  const sub = await checkSubscription(WALLET);
  if (sub.active) {
    console.log("Access granted via Mainlayer subscription (plan:", sub.plan, ")");
    return;
  }

  console.log("Access denied — no NFT and no active subscription.");
}

main().catch(console.error);
