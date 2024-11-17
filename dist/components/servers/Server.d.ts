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
export declare const Server: React.FC<ServerProps>;
export {};
