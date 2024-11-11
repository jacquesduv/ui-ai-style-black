// src/App.jsx
import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import AppNavbar from "./components/Navbar";
import MapDisplay from "./components/MapDisplay";
import HelpPage from "./components/HelpPage";
import SettingsPage from "./components/SettingsPage";
import { GridBlockProvider } from "./context/GridBlockContext";
import { ToastContainer } from "react-toastify";
import { notifyInfo } from "./utils/ToastNotifications";
import "react-toastify/dist/ReactToastify.css";
import "./styles/App.css";

const App = () => {
  return (
    <GridBlockProvider>
      <Router>
        <AppNavbar />
        <div className="app-container">
          <RoutesWithNotifications />
        </div>
        <ToastContainer autoClose={3000} position="top-right" />
      </Router>
    </GridBlockProvider>
  );
};

// Component to handle route change notifications
const RoutesWithNotifications = () => {
  const location = useLocation();

  useEffect(() => {
    notifyInfo(`Navigated to ${location.pathname}`);
  }, [location]);

  return (
    <Routes>
      {/* Home route displays the main map editor */}
      <Route path="/" element={<MapDisplay />} />

      {/* Help route for documentation or support */}
      <Route path="/help" element={<HelpPage />} />

      {/* Settings route for managing grid settings */}
      <Route path="/settings" element={<SettingsPage />} />
    </Routes>
  );
};

export default App;
