import { useState } from "react";
import React from "react";
import "./banner.css";
interface Props {
  handleClick: (referrer: string) => void;
  referrer: string;
}

const Banner: React.FC<Props> = (props: Props) => {
  const { handleClick, referrer } = props;
  return (
    <div className="banner">
      <button onClick={(_) => handleClick(referrer)}>Mint NFT</button>
    </div>
  );
};

export default Banner;
