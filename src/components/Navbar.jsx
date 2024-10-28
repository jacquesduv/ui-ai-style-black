// src/components/Navbar.jsx
import React from 'react';
import { Navbar, Nav } from 'react-bootstrap';

const NavbarComponent = () => {
    return (
        <Navbar bg="primary" variant="dark" expand="lg">
            <Navbar.Brand href="#home">Part File Editor</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="me-auto">
                    <Nav.Link href="#home">Home</Nav.Link>
                    <Nav.Link href="#settings">Settings</Nav.Link>
                    <Nav.Link href="#help">Help</Nav.Link>
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    );
};

export default NavbarComponent;

