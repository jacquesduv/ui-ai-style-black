// src/App.js
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import NavbarComponent from "./components/Navbar";
import MapEditor from "./components/MapEditor";
import HelpPage from "./components/HelpPage";
import { BlockProvider } from "./context/BlockContext";

const App = () => {
  return (
    <BlockProvider>
      <Router>
        <NavbarComponent />
        <Routes>
          <Route path="/" element={<MapEditor />} />
          <Route path="/help" element={<HelpPage />} />
          <Route
            path="/settings"
            element={
              <div className="container mt-4">
                <h2>Settings Page</h2>
                <p>Settings content coming soon!</p>
              </div>
            }
          />
        </Routes>
      </Router>
    </BlockProvider>
  );
};

export default App;
