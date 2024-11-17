import React from 'react';
import './Table.css';

interface THProps {
  children: [];
  className: string;
}

export const TH: React.FC<THProps> = ({ children, className }) => {
  return <th className={className}>{children}</th>;
};