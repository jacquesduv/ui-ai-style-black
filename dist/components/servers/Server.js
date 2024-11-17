import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import './Server.css';
export const Server = ({ url, ipAddress, port, prod, type, network, style, error }) => {
    if (error)
        style = { ...style, backgroundColor: 'var(--red-light-dim)' };
    return _jsxs("div", { className: "ai-server", style: style, children: [_jsx("label", { className: "ai-server-url", children: url }), _jsx("label", { className: "ai-server-ip", children: ipAddress }), _jsx("label", { className: "ai-server-port", children: port }), _jsx("label", { className: "ai-server-prod", children: prod }), _jsx("label", { className: "ai-server-type", children: type }), _jsx("label", { className: "ai-server-network", children: network })] });
};
