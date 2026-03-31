/**
 * NFT ownership verification via on-chain indexer.
 *
 * This module handles NFT collection membership checks. Wire in your preferred
 * indexer (Alchemy, Moralis, SimpleHash, or direct RPC calls).
 */

export interface NftCheckResult {
  owns: boolean;
  tokenId: string | null;
  contractAddress: string;
  balance?: number;
}

/**
 * Verify whether `walletAddress` holds at least one token from `contractAddress`.
 *
 * Currently a placeholder. Replace with one of:
 * - Alchemy SDK (recommended for EVM)
 * - Moralis API
 * - SimpleHash API
 * - Direct RPC contract calls using ethers.js
 *
 * @param walletAddress The wallet address to check (must be valid EVM address)
 * @param contractAddress The NFT collection contract address
 * @returns Result indicating ownership and token details
 * @throws Error if the indexer call fails
 *
 * @example
 * // Using Alchemy (recommended)
 * const alchemy = new Alchemy({
 *   apiKey: process.env.ALCHEMY_API_KEY,
 *   network: Network.ETH_MAINNET,
 * });
 *
 * const nfts = await alchemy.nft.getNftsForOwner(walletAddress, {
 *   contractAddresses: [contractAddress],
 * });
 *
 * return {
 *   owns: nfts.totalCount > 0,
 *   tokenId: nfts.ownedNfts?.[0]?.tokenId ?? null,
 *   contractAddress,
 *   balance: nfts.totalCount,
 * };
 */
export async function checkNftOwnership(
  walletAddress: string,
  contractAddress: string
): Promise<NftCheckResult> {
  // Validate inputs
  if (!walletAddress || !walletAddress.match(/^0x[a-fA-F0-9]{40}$/)) {
    throw new Error(`Invalid wallet address: ${walletAddress}`);
  }
  if (!contractAddress || !contractAddress.match(/^0x[a-fA-F0-9]{40}$/)) {
    throw new Error(`Invalid contract address: ${contractAddress}`);
  }

  // TODO: Replace with your NFT indexer implementation
  // For now, returns false until integrated

  return {
    owns: false,
    tokenId: null,
    contractAddress,
    balance: 0,
  };
}
