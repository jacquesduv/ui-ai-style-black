// src/App.js
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Container } from "react-bootstrap";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import SettingsPage from "./pages/SettingsPage";
import HelpPage from "./pages/HelpPage";
import { BlockProvider } from "./context/BlockContext";
import { GridProvider } from "./context/GridContext";
import "./App.css";

const App = () => {
  return (
    <BlockProvider>
      <GridProvider>
        <Router>
          <Navbar />
          <Container fluid className="mt-4">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/help" element={<HelpPage />} />
              {/* Fallback route for 404 page */}
              <Route path="*" element={<h3>Page Not Found</h3>} />
            </Routes>
          </Container>
        </Router>
        {/* Toast Notifications Container */}
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar
          newestOnTop
          closeOnClick
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </GridProvider>
    </BlockProvider>
  );
};

export default App;
