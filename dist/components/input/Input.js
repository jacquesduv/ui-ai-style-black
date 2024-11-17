import { jsx as _jsx } from "react/jsx-runtime";
import React from 'react';
import './Input.css';
export const Input = ({ label, onClick, onChange, className }) => {
    return _jsx("input", { className: `ai-input ${className}`, onClick: onClick, onChange: onChange, value: label });
};
