import React from "react";
import { Container, Row, Col, Button } from "reactstrap";
import Banner from "./banner";
import "./landing.css";

interface Props {
  handleClick: (referrer: string) => void;
  referrer: string;
  selectedFile: File | null;
}

const LandingPage: React.FC<Props> = (props: Props) => {
  const { handleClick, referrer, selectedFile } = props;
  return (
    <div className="landing-page">
      <div className="jumbotron">
        <Container>
          <Row>
            <Col sm="12" md={{ size: 6, offset: 3 }}>
              <h1 className="display-3 text-center text-black">
                Welcome to CryptoTrader
              </h1>
              <p className="lead text-center text-black">
                CryptoTrader is the most secure and user-friendly platform for
                buying and selling cryptocurrencies.
              </p>
              <hr className="my-2" />
              <p className="text-center text-black">
                Our platform offers a wide range of cryptocurrencies, low fees,
                and 24/7 customer support.
              </p>
              <p className="lead text-center">
                <Button color="primary" size="lg">
                  Create an account
                </Button>
              </p>
            </Col>
          </Row>
        </Container>
        <div className="banner">
          <Banner
            handleClick={handleClick}
            referrer={referrer}
            selectedFile={selectedFile}
          />
        </div>
        <Container>
          <Row>
            <Col sm="12" md={{ size: 6, offset: 3 }}>
              <h2 className="text-center text-black">Tutorial</h2>
              <p className="text-center text-black">
                Learn how to use our platform with our step-by-step tutorial.
              </p>
              <div className="text-center">
                <Button color="secondary" size="lg">
                  Watch tutorial
                </Button>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
};

export default LandingPage;
