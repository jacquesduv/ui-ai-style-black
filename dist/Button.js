import React from 'react';
const Button = ({
  children,
  onClick
}) => /*#__PURE__*/React.createElement("button", {
  onClick: onClick,
  style: {
    padding: '10px',
    backgroundColor: 'blue',
    color: 'white'
  }
}, children);
export default Button;