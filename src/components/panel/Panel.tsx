import React from 'react';
import './Panel.css';

interface PanelProps {
  label: string;
  onClick: any;
  className: string;
}

export const Panel: React.FC<PanelProps> = ({ label, onClick, className }) => {
  return <div className={`ai-panel ${className}`} onClick={onClick}>{label}</div>;
};
