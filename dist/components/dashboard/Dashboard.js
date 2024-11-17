import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import './Dashboard.css';
import { Background } from '../backgrounds/Background';
import { Navbar } from '../navbar/Navbar';
import { Main } from '../main/Main';
export const Dashboard = ({ children, imgLogo, primaryTitle, secondaryTitle }) => {
    return _jsxs(Background, { className: "ai-background-default", children: [_jsx(Navbar, { imgLogo: imgLogo, primaryTitle: primaryTitle, secondaryTitle: secondaryTitle }), _jsx(Main, { children: children })] });
};
