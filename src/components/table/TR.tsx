import React from 'react';
import './Table.css';

interface TRProps {
  children: [];
}

export const TR: React.FC<TRProps> = ({ children, className }) => {
  return <tr className={className}>{children}</tr>;
};