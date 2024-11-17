import { jsx as _jsx } from "react/jsx-runtime";
import React from 'react';
import './Select.css';
export const Select = ({ label, onClick, onChange, className }) => {
    return _jsx("select", { className: `ai-select ${className}`, onClick: onClick, onChange: onChange, children: label });
};
