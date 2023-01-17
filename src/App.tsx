import React, { useState } from "react";
import "./App.css";
import Banner from "./components/banner";
import { ethers } from "ethers";
import MintAdNFT from "./artifacts/contracts/MintAdNFT.sol/MintAdNFT.json";
import axios from "axios";
import { Input } from "reactstrap";

// Might need to change this per deployment
const contractAddress = "0xd786e5a610a77A45732f30c081B3c8CCf0c43A00";
const metadataURIRoute = "https://gateway.pinata.cloud/ipfs/";
const defaultIpfsHash =
  "QmYMYxUvKTkYeXrDudoLeDQbhyPoS14axthyQG3eVUyyyX?_gl=1*946rra*_ga*MTA0MzUwOTI0My4xNjczODk5Mzc4*_ga_5RMPXG14TE*MTY3Mzg5OTM3Ny4xLjEuMTY3MzkwMDE1Mi4xOS4wLjA.";

const provider = new ethers.providers.Web3Provider(window.ethereum);

// get the end user
const signer = provider.getSigner();

// get the smart contract
const contract = new ethers.Contract(contractAddress, MintAdNFT.abi, signer);

const App: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [ipfsHash, setIpfsHash] = useState<string | null>(null);
  const [referrer, setReferrer] = useState("");

  // Function to mint token
  const mintToken = async (referrer: string) => {
    const connection = contract.connect(signer);
    const addr = connection.address;
    console.log("signer is %s", signer._address);
    const metadataURI = metadataURIRoute + (ipfsHash ?? defaultIpfsHash);
    console.log("ipfs link is %s", metadataURI);

    const result = await contract.payToMint(addr, referrer, metadataURI, {
      value: ethers.utils.parseEther("0.05"),
    });

    await result.wait();

    console.log("Minted NFT with transaction: ", result.hash);
  };

  // Function to upload file to IPFS
  const uploadClick = async (event: { preventDefault: () => void }) => {
    event?.preventDefault();
    if (selectedFile) {
      console.log("starting upload of image");
      try {
        const imageFormData = new FormData();
        imageFormData.append("file", selectedFile);

        const resFile = await axios({
          method: "post",
          url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
          data: imageFormData,
          headers: {
            pinata_api_key: `${process.env.REACT_APP_PINATA_API_KEY}`,
            pinata_secret_api_key: `${process.env.REACT_APP_PINATA_SECRET_API_KEY}`,
            "Content-Type": "multipart/form-data",
          },
        });

        const imgHash = `ipfs://${resFile.data.IpfsHash}`;
        console.log(imgHash);
        // Create metadata IPFS now
        console.log("starting upload of metadata");
        const metadataJson = {
          description: "A NFT that can be minted without leaving the page",
          image: `https://gateway.pinata.cloud/ipfs/${resFile.data.IpfsHash}`,
          name: "MintAdNFT",
          attributes: [
            {
              trait_type: "Enthusiasm",
              value: "Mooning",
            },
            {
              display_type: "lead_generation",
              trait_type: "Enthusiasm",
              value: 9001,
            },
          ],
        };

        const resJsonFile = await axios({
          method: "post",
          url: "https://api.pinata.cloud/pinning/pinJSONToIPFS",
          data: JSON.stringify(metadataJson),
          headers: {
            pinata_api_key: "bea10982476eadb16b93",
            pinata_secret_api_key:
              "b64ea6f8ea37c0cf035057f2141a7c774e05a2e2507e484e9d5f1d739104615f",
            "Content-Type": "application/json",
          },
        });
        console.log("finished metadata upload", resJsonFile.data.IpfsHash);

        setIpfsHash(resJsonFile.data.IpfsHash);
      } catch (error) {
        console.log("Error sending File to IPFS: ");
        console.log(error);
      }
    } else {
      console.log("No file selected");
    }
  };

  return (
    <>
      <div className="app">
        <Banner handleClick={mintToken} referrer={referrer} />
        <div className="publisher-entry">
          <h3>Publisher Address</h3>
          <Input
            type="text"
            className="publisher-field"
            name="referral"
            placeholder="Referral Reward Destination"
            value={referrer}
            onChange={(event: any) => setReferrer(event.target.value)}
          />
        </div>
        <form onSubmit={uploadClick} className="upload-form">
          <div className="upload-form__input-container">
            <input
              type="file"
              onChange={(e) => setSelectedFile(e.target.files![0])}
              required
              className="upload-form__input"
            />
            <button type="submit" className="upload-form__button">
              Upload NFT
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default App;
