import { jsx as _jsx } from "react/jsx-runtime";
import React from 'react';
import './Table.css';
export const Table = ({ children }) => {
    return _jsx("table", { className: "ai-table", children: children });
};
