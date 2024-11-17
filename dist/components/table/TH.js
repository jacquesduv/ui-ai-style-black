import { jsx as _jsx } from "react/jsx-runtime";
import React from 'react';
import './Table.css';
export const TH = ({ children, className }) => {
    return _jsx("th", { className: className, children: children });
};
