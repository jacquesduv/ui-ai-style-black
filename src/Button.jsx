import React from 'react';

const Button = function({ children, onClick }) { return (
  <button onClick={onClick} style={{ padding: '10px', backgroundColor: 'blue', color: 'white' }}>
    {children}
  </button>
) };

export default Button;
