import React from 'react';
import './Navbar.css';

interface NavbarProps {
  label: string;
  onClick: any;
  className: string;
}

export const Navbar: React.FC<NavbarProps> = ({ label, onClick, className }) => {
  return <div className={`ai-panel ${className}`} onClick={onClick}>{label}</div>;
};
