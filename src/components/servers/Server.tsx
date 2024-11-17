import React from 'react';
import './Server.css';

interface ServerProps {
  url: string;
  ipAddress: string;
  port: string;
  prod: string;
  type: string;
  network: string;
  style: any;
  error: boolean;
}

export const Server: React.FC<ServerProps> = ({
  url,
  ipAddress,
  port,
  prod,
  type,
  network,
  style,
  error
}) => {
  if (error) style = { ...style, backgroundColor: 'var(--red-light-dim)' };
  return <div className="ai-server" style={style} >
    <label className="ai-server-url">{url}</label>
    <label className="ai-server-ip">{ipAddress}</label>
    <label className="ai-server-port">{port}</label>
    <label className="ai-server-prod">{prod}</label>
    <label className="ai-server-type">{type}</label>
    <label className="ai-server-network">{network}</label>
  </div>;
};
