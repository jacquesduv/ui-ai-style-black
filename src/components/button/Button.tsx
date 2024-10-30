import React from 'react';
import './Button.css';

interface ButtonProps {
  label: string;
}

export const Button: React.FC<ButtonProps> = ({ label }) => {
  return <button className="button">{label}</button>;
};
