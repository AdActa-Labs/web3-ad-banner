import { useState } from "react";
import React from "react";
import "./banner.css";
interface Props {
  handleClick: (referrer: string) => void;
  referrer: string;
  selectedFile: File | null;
}

const Banner: React.FC<Props> = (props: Props) => {
  const { handleClick, referrer, selectedFile } = props;

  let backgroundImageURL = null;
  if (selectedFile) {
    backgroundImageURL = URL.createObjectURL(selectedFile);
  }
  const defaultImageURL = "https://i.imgur.com/D9hEB14.png";

  return (
    <div
      className="banner"
      style={{
        backgroundImage: backgroundImageURL
          ? `url(${backgroundImageURL})`
          : `url(${defaultImageURL})`,
      }}
    >
      <button onClick={(_) => handleClick(referrer)}>Mint NFT</button>
    </div>
  );
};

export default Banner;
