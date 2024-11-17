import React from 'react';
import './Panel.css';
interface PanelProps {
    lbl_top1: string;
    lbl_top2: string;
    lbl_top3: string;
    onClick: any;
    className: string;
    x1: number;
    y1: number;
    x2: number;
    y2: number;
}
export declare const Panel: React.FC<PanelProps>;
export {};
