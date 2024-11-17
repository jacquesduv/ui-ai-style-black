import { jsx as _jsx } from "react/jsx-runtime";
import React from 'react';
import './Table.css';
export const TD = ({ children, className }) => {
    return _jsx("td", { className: className, children: children });
};
