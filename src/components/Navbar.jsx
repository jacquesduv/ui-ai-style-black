// src/components/Navbar.jsx
import React from "react";
import { NavLink } from "react-router-dom";
import { Navbar, Nav, Container } from "react-bootstrap";
import { notifySuccess } from "../utils/ToastNotifications";
import "../styles/Navbar.css";

const AppNavbar = () => {
  const handleLogoClick = () => {
    notifySuccess("Welcome to the Farming Map Editor!");
  };

  return (
    <Navbar bg="primary" variant="dark" expand="lg" className="mb-4">
      <Container>
        <Navbar.Brand onClick={handleLogoClick} className="navbar-logo">
          Farming Map Editor
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive ? "nav-link active" : "nav-link"
              }
              end
            >
              Home
            </NavLink>
            <NavLink
              to="/settings"
              className={({ isActive }) =>
                isActive ? "nav-link active" : "nav-link"
              }
            >
              Settings
            </NavLink>
            <NavLink
              to="/help"
              className={({ isActive }) =>
                isActive ? "nav-link active" : "nav-link"
              }
            >
              Help
            </NavLink>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default AppNavbar;
