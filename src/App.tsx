import React from "react";
import "./App.css";
import Banner from "./components/banner";

const App: React.FC = () => {
  return (
    <div className="app">
      <Banner message="Welcome to my app!" />
    </div>
  );
};

export default App;
