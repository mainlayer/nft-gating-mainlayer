/**
 * NFT ownership verification.
 *
 * Replace the placeholder implementation with a call to your preferred
 * NFT indexer (e.g. Alchemy, Moralis, SimpleHash).
 */

export interface NftCheckResult {
  owns: boolean;
  tokenId: string | null;
  contractAddress: string;
}

/**
 * Verify whether `walletAddress` holds at least one token from `contractAddress`.
 *
 * @param walletAddress  The wallet to check.
 * @param contractAddress  The NFT collection contract.
 */
export async function checkNftOwnership(
  walletAddress: string,
  contractAddress: string
): Promise<NftCheckResult> {
  // TODO: replace with a real NFT indexer call
  // Example using Alchemy:
  //   const alchemy = new Alchemy({ apiKey: process.env.ALCHEMY_KEY });
  //   const nfts = await alchemy.nft.getNftsForOwner(walletAddress, {
  //     contractAddresses: [contractAddress],
  //   });
  //   const owns = nfts.totalCount > 0;
  //   const tokenId = owns ? nfts.ownedNfts[0].tokenId : null;

  // Placeholder: always returns false until a real indexer is wired in
  return {
    owns: false,
    tokenId: null,
    contractAddress,
  };
}
