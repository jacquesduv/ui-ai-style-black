import React from 'react';
import '../styles/body.css';
import Header from './header/Header.js';

function Body({children}) {
  return (
    <div className="body">
      <div className="top-section">
        <Header></Header>
      </div>
      <div className="left-section"></div>
      <div className="mid-section">{children}</div>
      <div className="right-section"></div>
      <div className="bottom-section"></div>
    </div>
  );
}

export default Body;