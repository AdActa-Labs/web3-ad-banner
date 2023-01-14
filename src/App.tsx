import React from "react";
import "./app.css";
import Banner from "./components/banner.tsx";

const App: React.FC = () => {
  return (
    <div className="app">
      <Banner message="Welcome to my app!" />
    </div>
  );
};

export default App;
