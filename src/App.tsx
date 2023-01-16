import React from "react";
import "./app.css";
import Banner from "./components/banner";

import { ethers } from "ethers";
import MintAdNFT from "./artifacts/contracts/MintAdNFT.sol/MintAdNFT.json";

// Might need to change this per deployment
const contractAddress = "0x5fbdb2315678afecb367f032d93f642f64180aa3";

const provider = new ethers.providers.Web3Provider(window.ethereum);

// get the end user
const signer = provider.getSigner();

// get the smart contract
const contract = new ethers.Contract(contractAddress, MintAdNFT.abi, signer);

const metadataURI =
  "https://gateway.pinata.cloud/ipfs/QmYMYxUvKTkYeXrDudoLeDQbhyPoS14axthyQG3eVUyyyX?_gl=1*946rra*_ga*MTA0MzUwOTI0My4xNjczODk5Mzc4*_ga_5RMPXG14TE*MTY3Mzg5OTM3Ny4xLjEuMTY3MzkwMDE1Mi4xOS4wLjA.";
const mintToken = async () => {
  const connection = contract.connect(signer);
  const addr = connection.address;
  const result = await contract.payToMint(addr, metadataURI, {
    value: ethers.utils.parseEther("0.05"),
  });

  await result.wait();

  console.log("Minted NFT with transaction: ", result.hash);
};

const App: React.FC = () => {
  return (
    <div className="app">
      <Banner handleClick={mintToken} />
    </div>
  );
};

export default App;
