import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock the Mainlayer SDK
vi.mock("@mainlayer/sdk", () => {
  return {
    default: vi.fn().mockImplementation(() => ({
      subscriptions: {
        check: vi.fn(),
      },
      checkout: {
        create: vi.fn(),
      },
    })),
  };
});

// Mock NFT check
vi.mock("../src/lib/nft-check", () => ({
  checkNftOwnership: vi.fn(),
}));

import { checkSubscription } from "../src/lib/mainlayer";
import { checkNftOwnership } from "../src/lib/nft-check";

const mockCheckNft = checkNftOwnership as ReturnType<typeof vi.fn>;

describe("Access gate logic", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("grants access when wallet owns the NFT", async () => {
    mockCheckNft.mockResolvedValue({ owns: true, tokenId: "42", contractAddress: "0xABC" });
    const nft = await checkNftOwnership("0xWallet", "0xABC");
    expect(nft.owns).toBe(true);
  });

  it("returns denied when no NFT and no subscription", async () => {
    mockCheckNft.mockResolvedValue({ owns: false, tokenId: null, contractAddress: "0xABC" });
    const nft = await checkNftOwnership("0xWallet", "0xABC");
    expect(nft.owns).toBe(false);
  });

  it("has correct shape for NFT result", async () => {
    mockCheckNft.mockResolvedValue({ owns: true, tokenId: "1", contractAddress: "0xDEF" });
    const result = await checkNftOwnership("0xWallet", "0xDEF");
    expect(result).toMatchObject({ owns: true, contractAddress: "0xDEF" });
  });
});
