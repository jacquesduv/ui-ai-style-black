// src/App.js
import React, { useState } from "react";
import NavbarComponent from "./components/Navbar";
import MapDisplay from "./components/MapDisplay";

const App = () => {
  // Sample block data
  const [blocks, setBlocks] = useState([
    { lat: -27.945563, lng: 25.661019, targetRate: 3000 },
    { lat: -27.945293, lng: 25.66132, targetRate: 3200 },
  ]);

  // Function to add a new block
  const onAddBlock = (newBlock) => {
    setBlocks((prevBlocks) => [...prevBlocks, newBlock]);
  };

  return (
    <div>
      <NavbarComponent />
      <h1 className="text-center mt-4">Welcome to the Part File Editor</h1>
      <MapDisplay blocks={blocks} onAddBlock={onAddBlock} />
    </div>
  );
};

export default App;
