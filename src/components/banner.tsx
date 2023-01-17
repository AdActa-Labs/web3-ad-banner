import { useState } from "react";
import React from "react";
import "./banner.css";
interface Props {
  handleClick: (referrer: string) => void;
}

const Banner: React.FC<Props> = (props: Props) => {
  const { handleClick } = props;
  const [referrer, setReferrer] = useState("");
  return (
    <div className="banner">
      <input
        type="text"
        name="referral"
        placeholder="Referral Reward Destination"
        value={referrer}
        onChange={(s) => setReferrer(s.target.value)}
      />
      <button onClick={(_) => handleClick(referrer)}>Mint NFT</button>
    </div>
  );
};

export default Banner;
