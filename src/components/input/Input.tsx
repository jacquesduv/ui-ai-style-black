import React from 'react';
import './Input.css';

interface InputProps {
  label: string;
  onClick: any;
  onChange: any;
  className: string;
}

export const Input: React.FC<InputProps> = ({ label, onClick, onChange, className }) => {
  return <input className={`ai-input ${className}`} onClick={onClick} onChange={onChange} value={label} />;
};
