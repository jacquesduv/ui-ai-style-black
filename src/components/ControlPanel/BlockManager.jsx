// src/components/BlockManager.jsx
import React from "react";
import { useGridBlockContext } from "../context/GridBlockContext";
import { notifyInfo } from "../utils/ToastNotifications";
import "../styles/ControlPanel.css";

const BlockManager = () => {
  const { blocks, selectedBlock, setSelectedBlock, deleteBlock } =
    useGridBlockContext();

  const handleSelectBlock = (block) => {
    setSelectedBlock(block);
    notifyInfo(`Block ${block.id} selected.`);
  };

  const handleDeleteBlock = (e, blockId) => {
    e.stopPropagation();
    deleteBlock(blockId);
  };

  return (
    <div className="block-manager">
      <h3>Block Manager</h3>
      {blocks.length === 0 ? (
        <p>No blocks added yet.</p>
      ) : (
        <ul>
          {blocks.map((block) => (
            <li
              key={block.id}
              className={selectedBlock?.id === block.id ? "selected" : ""}
              onClick={() => handleSelectBlock(block)}
            >
              Block {block.id}: Lat {block.coordinates[0].latitude.toFixed(5)},
              Lng {block.coordinates[0].longitude.toFixed(5)}, Rate{" "}
              {block.targetRate}
              <button
                className="delete-button"
                onClick={(e) => handleDeleteBlock(e, block.id)}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default BlockManager;
