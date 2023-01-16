import React from "react";
import "./banner.css";
interface Props {
  message: string;
}

const LOCAL_CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

const Banner: React.FC<Props> = ({ message }) => {
  const mintToken = async () => {};

  return (
    <div className="banner">
      <input
        type="text"
        name="referral"
        placeholder="Referral Reward Destination"
      />
      <button onClick={mintToken}>Mint NFT</button>
    </div>
  );
};

export default Banner;
