import React from 'react';
import './Navbar.css';
import { Button } from '../button/Button';
import { FaUser } from 'react-icons/fa';

interface NavbarProps {
  label: string;
  onClick: any;
  className: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  label,
  onClick,
  className,
  imgLogo,
  primaryTitle,
  secondaryTitle
}) => {
  return <div className={`ai-navbar ${className}`} onClick={onClick}>
    <div className="ai-navbar-logo-section">
      <img 
      className="ai-navbar-logo-img"
      src={imgLogo}>
        {label}
      </img>
      <div className="ai-navbar-logo-title-primary">{primaryTitle}</div>
      <div className="ai-navbar-logo-title-secondary">{secondaryTitle}</div>
    </div>
    <div className="ai-navbar-lightbar">
      <div className="ai-navbar-lightbar-red">
        <span className="ai-navbar-lightbar-icon"><FaUser/></span>
        <span className="ai-navbar-lightbar-text">jacques.duv@gmail.com</span>
      </div>
    </div>
  </div>;
};
