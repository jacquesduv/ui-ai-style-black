import React from 'react';
import './Dashboard.css';
import { Background } from '../backgrounds/Background';
import { Navbar } from '../navbar/Navbar';
import { Main } from '../main/Main';

interface DashboardProps {
  children: [];
  imgLogo: string;
}

export const Dashboard: React.FC<DashboardProps> = ({
  children,
  imgLogo,
  primaryTitle,
  secondaryTitle
}) => {
  return <Background className="ai-background-default">
    <Navbar
    imgLogo={imgLogo}
    primaryTitle={primaryTitle}
    secondaryTitle={secondaryTitle}
    ></Navbar><Main>{children}</Main></Background>;
};
