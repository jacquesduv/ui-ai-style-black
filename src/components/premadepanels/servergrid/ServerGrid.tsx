import React from 'react';
import { useEffect } from 'react';
import './ServerGrid.css';
import { Panel } from '../../panel/Panel';
import { Server } from '../../servers/Server';

interface ServerGridItem {
    url: string;
    ipAddress: string;
    port: string;
    prod: string;
    type: string;
    network: string;
  }

interface ServerGridProps {
    lbl_top1: string;
    lbl_top2: string;
    lbl_top3: string;
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    items: ServerGridItem[];
    prod: string;
    type: string;
    network: string;
}

export const ServerGrid: React.FC<ServerGridProps> = ({
    lbl_top1,
    lbl_top2,
    lbl_top3,
    x1, x2, y1, y2,
    items
}) => {

  return <Panel lbl_top1={lbl_top1} lbl_top2={lbl_top2} lbl_top3={lbl_top3} x1={x1} y1={y1} x2={x2} y2={y2}>
    <div className="ai-servergrid" style={{
        gridAutoColumns: `${(100/Math.floor((x2-x1)*1.6) - 1)}%`,
        gridAutoRows: `${(100/((y2-y1)*3.0) - 1)}%`
    }}>
    {items.map((item, index) => {
        const column = index % Math.floor((x2-x1)*1.6);
        const row = Math.floor(index / Math.floor((x2-x1)*1.6));
        return (
        <Server
            key={`server-${index}`}
            url={item.url}
            ipAddress={item.ip}
            type={item.type}
            port={item.port}
            prod={item.level}
            network={item.network}
            style={{
                gridColumnStart: (column + 1),
                gridColumnEnd: (column + 2),
                gridRowStart: (row + 1),
                gridRowEnd: (row + 2)
            }}
            error={item.error}
        />
    )})}
  
  </div>
</Panel>;
};