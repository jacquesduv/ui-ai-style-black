import React from 'react';
import './Table.css';

interface TDProps {
  children: [];
  className: string;
}

export const TD: React.FC<TDProps> = ({ children, className }) => {
  return <td className={className}>{children}</td>;
};