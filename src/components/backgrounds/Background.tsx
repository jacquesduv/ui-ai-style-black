import React from 'react';
import './Button.css';

interface ButtonProps {
  children: [];
}

export const Button: React.FC<ButtonProps> = ({ children }) => {
  return <div className="background">{children}</div>;
};
