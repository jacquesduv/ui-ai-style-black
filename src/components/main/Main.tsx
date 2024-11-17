import React from 'react';
import './Main.css';

interface MainProps {
  children: any
}

export const Main: React.FC<MainProps> = ({children}) => {
  return <div className="ai-main">
    {children}
  </div>;
};
