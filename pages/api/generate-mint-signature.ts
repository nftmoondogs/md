import { ThirdwebSDK } from "@thirdweb-dev/sdk";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function generateMintSignature(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // De-construct body from request
  const { address } = JSON.parse(req.body);

  // Get the Early Access NFT Edition Drop contract
  const etheriumSDK = new ThirdwebSDK("goerli");
  const moondogsnfts = etheriumSDK.getNFTCollection(
    "0xe0c1b0c3366a9dB3566D4b4216334055c21C0Cba"
  );
  const totala = new ThirdwebSDK("goerli");
  const total = totala.getNFTCollection (
    "0xe0c1b0c3366a9dB3566D4b4216334055c21C0Cba"
  );

  // Check to see if the wallet address has an early access NFT
  const allowList = ["0x7dE5f242a6191cE1ecf3bD912F40dd7E67e0A7cF", "0x724532765476"]
  const balance = await moondogsnfts.balanceOf(address)
  const tl = await total.totalSupply()
  const addressInAllowlist = allowList.includes(address) && balance.toNumber() == 1 || balance.toNumber() == 0 || tl.toNumber() < 32
  const userHasToken = balance.toNumber() == 1 || tl.toNumber() < 34
 




  // Now use the SDK on Goerli to get the signature drop
  const goerliSDK = ThirdwebSDK.fromPrivateKey(
    process.env.PRIVATE_KEY as string,
    "goerli"
  );
  const signatureDrop = goerliSDK.getSignatureDrop(
    "0xe0c1b0c3366a9dB3566D4b4216334055c21C0Cba"
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
      message: "User does not have an early access NFT",
    });
  }
}
