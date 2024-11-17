import { jsx as _jsx } from "react/jsx-runtime";
import React from 'react';
import './Button.css';
export const Button = ({ label, onClick, className }) => {
    return _jsx("button", { className: `ai-button ${className}`, onClick: onClick, children: label });
};
