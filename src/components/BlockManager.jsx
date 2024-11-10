// src/components/BlockManager.jsx
import React from "react";
import { useBlockContext } from "../context/BlockContext";
import { useGridContext } from "../context/GridContext";
import {
  notifySuccess,
  notifyInfo,
  notifyWarn,
} from "../utils/ToastNotifications";
import { Button } from "react-bootstrap";

const BlockManager = () => {
  const { blocks, setSelectedBlock, deleteBlock, clearBlocks } =
    useBlockContext();
  const { clearCell, setSelectedCell } = useGridContext();

  // Select a block
  const handleSelectBlock = (block) => {
    setSelectedBlock(block);
    setSelectedCell(null); // Deselect any grid cell if a block is selected
    notifyInfo(`Selected Block ID: ${block.id}`);
  };

  // Delete a block
  const handleDeleteBlock = (blockId) => {
    deleteBlock(blockId);
    notifySuccess("Block deleted successfully!");
  };

  // Clear all blocks
  const handleClearAllBlocks = () => {
    if (blocks.length === 0) {
      notifyWarn("No blocks to clear.");
      return;
    }
    clearBlocks();
    notifyInfo("All blocks cleared.");
  };

  // Clear the selected grid cell
  const handleClearSelectedCell = () => {
    clearCell(null);
    setSelectedCell(null);
    notifyInfo("Selected cell cleared.");
  };

  return (
    <div className="block-manager p-3 border rounded">
      <h5>Block Manager</h5>
      <div className="block-list">
        {blocks.length > 0 ? (
          blocks.map((block) => (
            <div
              key={block.id}
              className="block-item border-bottom p-2 d-flex justify-content-between align-items-center"
            >
              <div>
                <strong>ID:</strong> {block.id} <br />
                <small>
                  <strong>Coordinates:</strong> ({block.lat.toFixed(5)},{" "}
                  {block.lng.toFixed(5)})
                </small>
                <br />
                <strong>Target Rate:</strong> {block.targetRate}
              </div>
              <div>
                <Button
                  variant="info"
                  size="sm"
                  className="mr-2"
                  onClick={() => handleSelectBlock(block)}
                >
                  Select
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleDeleteBlock(block.id)}
                >
                  Delete
                </Button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-muted">
            No blocks available. Add blocks using the map.
          </p>
        )}
      </div>

      <div className="mt-3 d-flex justify-content-between">
        <Button
          variant="warning"
          onClick={handleClearAllBlocks}
          disabled={blocks.length === 0}
        >
          Clear All Blocks
        </Button>
        <Button variant="secondary" onClick={handleClearSelectedCell}>
          Clear Selected Cell
        </Button>
      </div>
    </div>
  );
};

export default BlockManager;
