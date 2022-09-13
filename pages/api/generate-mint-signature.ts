import { ThirdwebSDK } from "@thirdweb-dev/sdk";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function generateMintSignature(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // De-construct body from request
  const { address } = JSON.parse(req.body);

  // Get the Early Access NFT Edition Drop contract
  const etheriumSDK = new ThirdwebSDK("rinkeby");
  const moondogsnfts = etheriumSDK.getNFTCollection(
    "0x11848a838537a2D8DcB0598bD9CB16E0Ed05Cc18"
  );
  const totala = new ThirdwebSDK("rinkeby");
  const total = totala.getNFTCollection (
    "0x11848a838537a2D8DcB0598bD9CB16E0Ed05Cc18"
  );

  // Check to see if the wallet address has an early access NFT
  const allowList = ["0x7dE5f242a6191cE1ecf3bD912F40dd7E67e0A7cF", "0x7dE5f242a6191cE1ecf3bD912F40dd7E67e0A7cF"]
  const balance = await moondogsnfts.balanceOf(address)
  const tl = await total.totalSupply()
  const addressInAllowlist = allowList.includes(address) && tl.toNumber() < 1000 && balance.toNumber() == 0 || balance.toNumber() == 1
  const userHasToken = balance.toNumber() == 1 && tl.toNumber() < 1000
 




  // Now use the SDK on Goerli to get the signature drop
  const rinkebySDK = ThirdwebSDK.fromPrivateKey(
    process.env.PRIVATE_KEY as string,
    "rinkeby"
  );
  const signatureDrop = rinkebySDK.getSignatureDrop(
    "0x11848a838537a2D8DcB0598bD9CB16E0Ed05Cc18"
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
