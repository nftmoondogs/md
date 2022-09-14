import { ThirdwebSDK } from "@thirdweb-dev/sdk";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function generateMintSignature(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // De-construct body from request
  const { address } = JSON.parse(req.body);

  // Get the Early Access NFT Edition Drop contract
  const etheriumSDK = new ThirdwebSDK("mainnet");
  const moondogsnfts = etheriumSDK.getNFTCollection(
    "0x3987B9c21873AfAE5Cf587BA50C2407fe6a0f7ef"
  );
  const totala = new ThirdwebSDK("mainnet");
  const total = totala.getNFTCollection (
    "0x3987B9c21873AfAE5Cf587BA50C2407fe6a0f7ef"
  );

  // Check to see if the wallet address has an early access NFT
  const allowList = ["0x7dE5f242a619191dd7E67e0A7cF", "0x7dE5f242a6191dd7E67e0A7cF"]
  const balance = await moondogsnfts.balanceOf(address)
  const tl = await total.totalSupply()
  const addressInAllowlist = allowList.includes(address) && tl.toNumber() < 1 && balance.toNumber() == 0
  const userHasToken = tl.toNumber() < 2 && balance.toNumber() == 1 || balance.toNumber() == 5  
 




  // Now use the SDK on Goerli to get the signature drop
  const mainnetSDK = ThirdwebSDK.fromPrivateKey(
    process.env.PRIVATE_KEY as string,
    "mainnet"
  );
  const signatureDrop = mainnetSDK.getSignatureDrop(
    "0x3987B9c21873AfAE5Cf587BA50C2407fe6a0f7ef"
  );

  // If the user has an early access NFT, generate a mint signature
  if (addressInAllowlist || userHasToken) {
    const mintSignature = await signatureDrop.signature.generate({
      to: address, // Can only be minted by the address we checked earlier
      price: "0", // Free!
      mintStartTime: new Date(0), // now
    });

    res.status(200).json(mintSignature);
  } else {
    res.status(400).json({
      message: "User does not have a Moondogs NFT",
    });
  }
}
