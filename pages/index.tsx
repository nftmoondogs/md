
import {
  useAddress,
  useMetamask,
  useSignatureDrop,
  useNetwork,
  useNetworkMismatch,
} from "@thirdweb-dev/react";
import {
  ChainId,
  SignedPayload721WithQuantitySignature,
} from "@thirdweb-dev/sdk";
import type { NextPage } from "next";
import styles from "../styles/Home.module.css";

const Home: NextPage = () => {
  const address = useAddress();
  const connectWithMetamask = useMetamask();
  const isMismatch = useNetworkMismatch();
  const [, switchNetwork] = useNetwork();

  const signatureDrop = useSignatureDrop(
    "0x3987B9c21873AfAE5Cf587BA50C2407fe6a0f7ef"
  );

  async function claim() {
    if (!address) {
      connectWithMetamask();
      return;
    }

    if (isMismatch) {
      switchNetwork?.(ChainId.Mainnet);
      return;
    }

    try {
      const tx = await signatureDrop?.claimTo(address, 1);
      alert(`Succesfully minted Moondogs NFT!`);
    } catch (error: any) {
      alert(error?.message);
    }
  }

  async function claimWithSignature() {
    if (!address) {
      connectWithMetamask();
      return;
    }

    if (isMismatch) {
      switchNetwork && switchNetwork(ChainId.Mainnet);
      return;
    }

    const signedPayloadReq = await fetch(`/api/generate-mint-signature`, {
      method: "POST",
      body: JSON.stringify({
        address: address,
      }),
    });

    console.log(signedPayloadReq);

    if (signedPayloadReq.status === 400) {
      alert(
        "looks like you're not eligible for a free mint yet, If your address is not on vip list then you can try to mint at least 1 moondogs nft and get another moondogs for free by pressing the green claim button"
      );
      return;
    } else {
      try {
        const signedPayload =
          (await signedPayloadReq.json()) as SignedPayload721WithQuantitySignature;

        console.log(signedPayload);

        const nft = await signatureDrop?.signature.mint(signedPayload);

        alert(`Succesfully minted Moondogs NFT!`);
      } catch (error: any) {
        alert(error?.message);
      }
    }
  }

  return (
    <div className={styles.container}>
     
      {address ? (
        <div className={styles.nftBoxGrid}>
          {/* Mint a new NFT */}

         
          <div className={`${styles.hidden}`}>
<iframe src="https://gateway.ipfscdn.io/ipfs/Qma5FgmS9s3hkQrURfG4XDnh5Dxp9Fx9ZjBYkPFUNdQwfi/signature-drop.html?contract=0x3987B9c21873AfAE5Cf587BA50C2407fe6a0f7ef&chainId=1" className={`${styles.mintdapp}`}></iframe>
</div>


          <div
            className={styles.optionSelectBox}
            role="button"
            onClick={() => claimWithSignature()}
          >
            <h1 className={styles.h1}>Vip Mint</h1>

            <p className={styles.selectBoxDescription}>
              If your address is in the vip list then you can mint for free.
            </p>

            <button
        className={`${styles.mainButton} ${styles.spacerTop}`} 
      > Mint</button>

<p className="pt-96"> </p>

<div className={styles.smallonly}>

<h1 className={styles.h1}>WL Mint</h1>

            <p className={styles.selectBoxDescription}>
            0.0069 eth per mint max 5
            </p>


            <a href="https://gateway.ipfscdn.io/ipfs/Qma5FgmS9s3hkQrURfG4XDnh5Dxp9Fx9ZjBYkPFUNdQwfi/signature-drop.html?contract=0x3987B9c21873AfAE5Cf587BA50C2407fe6a0f7ef&chainId=1" target="_blank" rel="noreferrer"><button type="button" className={`${styles.wlmint} ${styles.spacerTop}`} 
      > Mint </button></a>


</div>

<p className="pt-96"> </p>



<h1 className={styles.h1}>Airdrop</h1>

            <p className={styles.selectBoxDescription}>
            If you minted atleast 1 Moondogs then you are eligible to claim another one for free using this button
            </p>

            <button
        className={`${styles.airdrop} ${styles.spacerTop}`} 
      > Claim </button>

<p className="pb-10"> </p>
           
          </div>

        

        </div>




      ) : (
        <button
          className={styles.mainButton}
          onClick={() => connectWithMetamask()}
        >
          Connect Wallet
        </button>
      )
      }
      <p className="pt-96"> </p>
<p className="pt-96"> </p>
<p className="pt-96"> </p>
<p className="pt-96"> </p>
    </div>
    
  );
};

export default Home;
