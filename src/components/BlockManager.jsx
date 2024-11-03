// src/components/BlockManager.jsx
import React, { useState } from 'react';

const BlockManager = ({ blocks = [], onSelectBlock, onDeleteBlock }) => {  // Default to an empty array
    const [sortBy, setSortBy] = useState('id'); // Default sorting by ID

    // Sort blocks based on the selected attribute
    const sortedBlocks = [...blocks].sort((a, b) => {
        if (sortBy === 'targetRate') {
            return b.targetRate - a.targetRate;
        }
        return a[sortBy] > b[sortBy] ? 1 : -1;
    });

    return (
        <div className="p-3 border border-secondary rounded">
            <h5>Block List</h5>
            <div className="d-flex justify-content-between mb-2">
                <label>Sort by:</label>
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="form-select form-select-sm">
                    <option value="id">ID</option>
                    <option value="targetRate">Target Rate</option>
                    <option value="lat">Latitude</option>
                    <option value="lng">Longitude</option>
                </select>
            </div>

            <ul className="list-group">
                {sortedBlocks.map((block) => (
                    <li key={block.id} className="list-group-item d-flex justify-content-between align-items-center">
                        <div>
                            <strong>ID:</strong> {block.id}, <strong>Rate:</strong> {block.targetRate}
                            <br />
                            <small>Lat: {block.lat.toFixed(5)}, Lng: {block.lng.toFixed(5)}</small>
                        </div>
                        <div>
                            <button className="btn btn-sm btn-info mr-2" onClick={() => onSelectBlock(block)}>Select</button>
                            <button className="btn btn-sm btn-danger" onClick={() => onDeleteBlock(block.id)}>Delete</button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default BlockManager;

