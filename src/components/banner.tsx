import React from "react";
import "./banner.css";
interface Props {
  message: string;
}

const Banner: React.FC<Props> = ({ message }) => {
  return (
    <div className="banner">
      <button>Hi</button>
    </div>
  );
};

export default Banner;
