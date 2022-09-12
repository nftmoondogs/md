
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';


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
    "0xe0c1b0c3366a9dB3566D4b4216334055c21C0Cba"
  );

  async function claim() {
    if (!address) {
      connectWithMetamask();
      return;
    }

    if (isMismatch) {
      switchNetwork?.(ChainId.Goerli);
      return;
    }

    try {
      const tx = await signatureDrop?.claimTo(address, 1);
      alert(`Succesfully minted NFT!`);
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
      switchNetwork && switchNetwork(ChainId.Goerli);
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
        "Looks like you don't own an early access NFT :( You don't qualify for the free mint."
      );
      return;
    } else {
      try {
        const signedPayload =
          (await signedPayloadReq.json()) as SignedPayload721WithQuantitySignature;

        console.log(signedPayload);

        const nft = await signatureDrop?.signature.mint(signedPayload);

        alert(`Succesfully minted NFT!`);
      } catch (error: any) {
        alert(error?.message);
      }
    }
  }

  return (
    <div className={styles.container}>
      {/* Top Section */}
      <h1 className={`${styles.h1}`}>Moondogs Vip And Wl Minting</h1>

      <p className={`${styles.describe} ${styles.colorr}`}>
        WL Spots owners can mint max 5 moondogs for 0.0069 eth per NFT from the left.  <br className="sm:block hidden" /> </p>

        <p className={styles.describe}>
        While the Vip spots holders can mint max 1 moondogs for free from the vip section on the right  <br className="sm:block hidden" />  </p>

        <p className={styles.describe}>
        First 1000 minters can mint one NFT for free using the Claim Button. </p> 
      

      {address ? (
        <div className={styles.nftBoxGrid}>
          {/* Mint a new NFT */}
          <div>
<iframe src="https://gateway.ipfscdn.io/ipfs/Qma5FgmS9s3hkQrURfG4XDnh5Dxp9Fx9ZjBYkPFUNdQwfi/signature-drop.html?contract=0xe0c1b0c3366a9dB3566D4b4216334055c21C0Cba&chainId=5" className={styles.mintdapp}></iframe>
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
<p className="pt-96"> </p>


<h1 className={styles.h1}>Airdrop</h1>

            <p className={styles.selectBoxDescription}>
            First 1000 minters are eligible to mint one NFT for free by clicking the button below
            </p>

            <button
        className={`${styles.airdrop} ${styles.spacerTop}`} 
      > Claim </button>


           
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
    </div>
  );
};

export default Home;
