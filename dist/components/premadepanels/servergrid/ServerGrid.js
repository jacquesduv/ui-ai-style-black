import { jsx as _jsx } from "react/jsx-runtime";
import React from 'react';
import './ServerGrid.css';
import { Panel } from '../../panel/Panel';
import { Server } from '../../servers/Server';
export const ServerGrid = ({ lbl_top1, lbl_top2, lbl_top3, x1, x2, y1, y2, items }) => {
    return _jsx(Panel, { lbl_top1: lbl_top1, lbl_top2: lbl_top2, lbl_top3: lbl_top3, x1: x1, y1: y1, x2: x2, y2: y2, children: _jsx("div", { className: "ai-servergrid", style: {
                gridAutoColumns: `${(100 / Math.floor((x2 - x1) * 1.6) - 1)}%`,
                gridAutoRows: `${(100 / ((y2 - y1) * 3.0) - 1)}%`
            }, children: items.map((item, index) => {
                const column = index % Math.floor((x2 - x1) * 1.6);
                const row = Math.floor(index / Math.floor((x2 - x1) * 1.6));
                return (_jsx(Server, { url: item.url, ipAddress: item.ip, type: item.type, port: item.port, prod: item.level, network: item.network, style: {
                        gridColumnStart: (column + 1),
                        gridColumnEnd: (column + 2),
                        gridRowStart: (row + 1),
                        gridRowEnd: (row + 2)
                    }, error: item.error }, `server-${index}`));
            }) }) });
};
