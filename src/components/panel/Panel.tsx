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

export const Panel: React.FC<PanelProps> = ({ 
  lbl_top1, lbl_top2, lbl_top3, onClick, className,
  x1, y1, x2, y2, children
}) => {
  return <div className={`ai-panel x1-${x1} x2-${x2} y1-${y1} y2-${y2}`}>
      <div className="ai-panel-head-block"></div>
    <div className="ai-panel-head-hor">
      <div className="ai-panel-head-hor-lbl-left ai-panel-head-text-white ai-panel-head-base-primary">
        <strong>{lbl_top2}</strong>
      </div>
      <div className="ai-panel-head-hor-lbl-right ai-panel-head-text-white ai-panel-head-base-primary">
        <strong>{lbl_top3}</strong>
      </div>
    </div>
    <div className="ai-panel-head-vert">
      <div className="ai-panel-head-ver-back">
        <div className="ai-panel-head-ver-lbl-top-right ai-panel-head-base-primary">
          <strong>{lbl_top1}</strong>
        </div>
      </div>
    </div>
    <div className="ai-panel-body">
      <div className="ai-panel-body-back"></div>
      <div className="ai-panel-body-front scroll-overflow">{children}</div>
    </div>
  </div>;
};
