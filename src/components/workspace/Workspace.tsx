import React from 'react';
import './Workspace.css';

interface WorkspaceProps {
  children: [];
}

export const Workspace: React.FC<WorkspaceProps> = ({ children }) => {
  return <div className="ai-workspace-area">{children}</div>;
};
