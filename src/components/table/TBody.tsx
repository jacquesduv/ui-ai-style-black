import React from 'react';
import './Table.css';

interface TBodyProps {
  children: [];
}

export const TBody: React.FC<TBodyProps> = ({ children }) => {
  return <tbody>{children}</tbody>;
};
