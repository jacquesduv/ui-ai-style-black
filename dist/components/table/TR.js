import { jsx as _jsx } from "react/jsx-runtime";
import React from 'react';
import './Table.css';
export const TR = ({ children, className }) => {
    return _jsx("tr", { className: className, children: children });
};
