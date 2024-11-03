import React from 'react';
import './Background.css';

interface BackgroundProps {
  children: [];
}

export const Background: React.FC<BackgroundProps> = ({ children }) => {
  return <div className="background">{children}</div>;
};
