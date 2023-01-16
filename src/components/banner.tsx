import React from "react";
import "./banner.css";
interface Props {
  handleClick: () => void;
}

const Banner: React.FC<Props> = ({ handleClick }) => {
  return (
    <div className="banner">
      <button onClick={handleClick}>Mint NFT</button>
    </div>
  );
};

export default Banner;
