import React from 'react';
import './Select.css';

interface SelectProps {
  label: string;
  onClick: any;
  onChange: any;
  className: string;
}

export const Select: React.FC<SelectProps> = ({ label, onClick, onChange, className }) => {
  return <select className={`ai-select ${className}`} onClick={onClick} onChange={onChange}>{label}</select>;
};
