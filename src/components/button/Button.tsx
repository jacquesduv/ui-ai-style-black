import React from 'react';
import './Button.css';

interface ButtonProps {
  label: string;
  onClick: any;
  className: string;
}

export const Button: React.FC<ButtonProps> = ({ label, onClick, className }) => {
  return <button className={`ai-button ${className}`} onClick={onClick}>{label}</button>;
};
