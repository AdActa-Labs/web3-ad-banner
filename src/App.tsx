import React, { useState } from "react";
import "./App.css";
import Banner from "./components/banner";
import { ethers } from "ethers";
// import MintAdNFT from "./artifacts/contracts/MintAdNFT.sol/MintAdNFT.json";
import MintAdNFT from "./utils/MintAdNFT.sol/MintAdNFT.json";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { Input, Modal, ModalBody, ModalHeader, Spinner } from "reactstrap";
import LandingPage from "components/landing";

// Might need to change this per deployment
const contractAddress = "0xd786e5a610a77A45732f30c081B3c8CCf0c43A00";
const metadataURIRoute = "https://gateway.pinata.cloud/ipfs/";
const defaultIpfsHash = "QmRNczmdyRGHPiMmiDjEZbiv6hKTmVeNcPNqkE1LiaKrTi";

const provider = new ethers.providers.Web3Provider(window.ethereum);

// get the end user
const signer = provider.getSigner();

// get the smart contract
const contract = new ethers.Contract(contractAddress, MintAdNFT.abi, signer);

const App: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [ipfsHash, setIpfsHash] = useState<string | null>(null);
  const [referrer, setReferrer] = useState("");
  const [popupOpen, setPopupOpen] = useState(false);
  const [mintSuccess, setMintSuccess] = useState(false);
  const [mintError, setMintError] = useState(false);
  const [resultHash, setResultHash] = useState("");

  // Function to mint token
  const mintToken = async (referrer: string) => {
    const connection = contract.connect(signer);
    const addr = connection.address;
    console.log("signer is %s", await signer.getAddress());
    const metadataURI = metadataURIRoute + (ipfsHash ?? defaultIpfsHash);
    console.log("ipfs link is %s", metadataURI);

    const result = await contract.payToMint(await signer.getAddress(), referrer, metadataURI, {
      value: ethers.utils.parseEther("0.05"),
    });
    setPopupOpen(true);
    try {
      await result.wait();
      setResultHash(result.hash);
      setMintSuccess(true);
    } catch (e) {
      setMintError(true);
    }

    console.log("Minted NFT with transaction: ", result, result.hash);
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
            pinata_api_key: `${process.env.REACT_APP_PINATA_API_KEY}`,
            pinata_secret_api_key: `${process.env.REACT_APP_PINATA_SECRET_API_KEY}`,
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
        <h1>Sandbox Landing Page</h1>
        <br />
        <LandingPage
          handleClick={mintToken}
          referrer={referrer}
          selectedFile={selectedFile}
        />
        <br />
        <h1>Publisher Tools</h1>
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

        <Modal isOpen={popupOpen} toggle={() => setPopupOpen(false)}>
          <ModalHeader>Minting NFT</ModalHeader>
          <ModalBody>
            {mintSuccess ? (
              <div>
                NFT minted successfully!&nbsp;
                <a href={`https://goerli.etherscan.io/tx/${resultHash}`}>
                  Click to view NFT Here.
                </a>
              </div>
            ) : mintError ? (
              <div>Error minting NFT</div>
            ) : (
              <div>
                Processing...
                <Spinner />
              </div>
            )}
          </ModalBody>
        </Modal>
      </div>
    </>
  );
};

export default App;
