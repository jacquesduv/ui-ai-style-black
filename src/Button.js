import React from 'react';

const Button = ({ children, onClick }) => (
  <button onClick={onClick} style={{ padding: '10px', backgroundColor: 'blue', color: 'white' }}>
    {children}
  </button>
);

export default Button;
