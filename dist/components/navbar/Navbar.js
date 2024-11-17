import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import './Navbar.css';
import { FaUser } from 'react-icons/fa';
export const Navbar = ({ label, onClick, className, imgLogo, primaryTitle, secondaryTitle }) => {
    return _jsxs("div", { className: `ai-navbar ${className}`, onClick: onClick, children: [_jsxs("div", { className: "ai-navbar-logo-section", children: [_jsx("img", { className: "ai-navbar-logo-img", src: imgLogo, children: label }), _jsx("div", { className: "ai-navbar-logo-title-primary", children: primaryTitle }), _jsx("div", { className: "ai-navbar-logo-title-secondary", children: secondaryTitle })] }), _jsx("div", { className: "ai-navbar-lightbar", children: _jsxs("div", { className: "ai-navbar-lightbar-red", children: [_jsx("span", { className: "ai-navbar-lightbar-icon", children: _jsx(FaUser, {}) }), _jsx("span", { className: "ai-navbar-lightbar-text", children: "jacques.duv@gmail.com" })] }) })] });
};
