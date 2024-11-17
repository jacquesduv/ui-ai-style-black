import React from 'react';
import './ServerGrid.css';
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
export declare const ServerGrid: React.FC<ServerGridProps>;
export {};
