import React from 'react';
import './Table.css';

interface TableProps {
  children: [];
}

export const Table: React.FC<TableProps> = ({ children }) => {
  return <table className="ai-table">{children}</table>;
};
