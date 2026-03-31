# nft-gating-mainlayer
![CI](https://github.com/mainlayer/nft-gating-mainlayer/actions/workflows/ci.yml/badge.svg) ![License](https://img.shields.io/badge/license-MIT-blue)

Gate content by NFT ownership OR Mainlayer subscription — users get access either way, and Mainlayer handles billing for non-NFT holders.

## Install

```bash
npm install @mainlayer/sdk
```

## Quickstart

```typescript
import { GatedContent } from "./src/components/GatedContent";

// In your Next.js page:
export default function Page() {
  const wallet = useConnectedWallet(); // your wallet hook
  return (
    <GatedContent wallet={wallet}>
      <PremiumContent />
    </GatedContent>
  );
}
```

Set environment variables:

```bash
MAINLAYER_API_KEY=ml_your_key
NFT_CONTRACT_ADDRESS=0xYourCollection
MAINLAYER_PLAN_ID=pro
```

## How it works

- `GET /api/access?wallet=0x...` checks NFT ownership first, then falls back to a Mainlayer subscription check
- `GatedContent` component handles the loading/granted/denied UI states
- Wire in any NFT indexer in `src/lib/nft-check.ts`

📚 [mainlayer.fr](https://mainlayer.fr)
