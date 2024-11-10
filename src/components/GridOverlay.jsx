// src/components/GridOverlay.jsx
import React, { useState, useEffect } from "react";
import { Polygon, InfoWindow } from "@react-google-maps/api";
import { useBlockContext } from "../context/BlockContext";
import { useGridContext } from "../context/GridContext";
import {
  notifySuccess,
  notifyError,
  notifyInfo,
  notifyWarn,
} from "../utils/ToastNotifications";
import { isBlockWithinCell, getCellCenterById } from "../utils/gridUtils";

const GridOverlay = ({ onSelectCell }) => {
  const {
    gridCells,
    selectedCell,
    setSelectedCell,
    selectCell,
    updateCellStatus,
  } = useGridContext();
  const { blocks, addBlock } = useBlockContext();

  const [targetRate, setTargetRate] = useState(1000);
  const [multiSelect, setMultiSelect] = useState(false);
  const [selectedCells, setSelectedCells] = useState([]);

  // Handle cell click, with multi-select support
  const handleCellClick = (cell) => {
    if (multiSelect) {
      toggleMultiSelect(cell);
    } else {
      selectCell(cell.center.lat, cell.center.lng);
      onSelectCell(cell);
      notifyInfo(`Selected Cell: ${cell.id}`);
    }
  };

  // Toggle cell selection in multi-select mode
  const toggleMultiSelect = (cell) => {
    setSelectedCells((prev) =>
      prev.some((selected) => selected.id === cell.id)
        ? prev.filter((selected) => selected.id !== cell.id)
        : [...prev, cell],
    );
  };

  // Handle adding a block to the selected cell
  const handleAddBlock = () => {
    if (selectedCell) {
      addBlockToCell(selectedCell);
      setSelectedCell(null);
    }
  };

  // Add block to a specific cell
  const addBlockToCell = (cell) => {
    const newBlock = {
      id: `${cell.id}-block`,
      lat: cell.center.lat,
      lng: cell.center.lng,
      targetRate,
    };

    if (blocks.some((block) => isBlockWithinCell(block, cell))) {
      notifyWarn("Block already exists in this cell.");
      return;
    }

    addBlock(newBlock);
    updateCellStatus(cell.id, "applied");
    notifySuccess(`Block added to cell ${cell.id}!`);
  };

  // Clear all selected cells
  const clearSelectedCells = () => {
    setSelectedCells([]);
    notifyInfo("Cleared selected cells.");
  };

  // Handle batch block addition
  const handleBatchAddBlocks = () => {
    selectedCells.forEach((cell) => {
      if (!blocks.some((block) => isBlockWithinCell(block, cell))) {
        addBlockToCell(cell);
      }
    });
    notifySuccess("Blocks added to all selected cells!");
    clearSelectedCells();
  };

  return (
    <>
      {gridCells.map((cell) => {
        const isSelected = selectedCell?.id === cell.id;
        const hasBlock = blocks.some((block) => isBlockWithinCell(block, cell));
        const isMultiSelected = selectedCells.some(
          (selected) => selected.id === cell.id,
        );

        const fillColor = hasBlock
          ? "#00FF00" // Green for applied cells
          : isSelected
            ? "#FFD700" // Yellow for selected cells
            : isMultiSelected
              ? "#00BFFF" // Blue for multi-selected cells
              : "#FF0000"; // Red for empty cells

        return (
          <Polygon
            key={cell.id}
            path={cell.coordinates}
            options={{
              fillColor,
              fillOpacity: 0.4,
              strokeColor: "#000000",
              strokeOpacity: 0.8,
              strokeWeight: 1,
            }}
            onClick={() => handleCellClick(cell)}
          />
        );
      })}

      {/* InfoWindow for the selected cell */}
      {selectedCell && (
        <InfoWindow
          position={getCellCenterById(selectedCell)}
          onCloseClick={() => setSelectedCell(null)}
        >
          <div>
            <h6>Cell Details</h6>
            <p>
              <strong>ID:</strong> {selectedCell.id}
            </p>
            <p>
              <strong>Center:</strong> ({selectedCell.center.lat.toFixed(5)},{" "}
              {selectedCell.center.lng.toFixed(5)})
            </p>
            <p>
              <strong>Set Target Rate:</strong>
              <input
                type="number"
                value={targetRate}
                onChange={(e) => setTargetRate(parseInt(e.target.value, 10))}
                style={{ width: "80px", marginLeft: "10px" }}
              />
            </p>
            <button className="btn btn-primary mt-2" onClick={handleAddBlock}>
              Add Block Here
            </button>
          </div>
        </InfoWindow>
      )}

      {/* Batch Actions for multi-selected cells */}
      {selectedCells.length > 0 && (
        <div className="batch-actions mt-3">
          <button
            className="btn btn-secondary mr-2"
            onClick={clearSelectedCells}
          >
            Clear Selected Cells
          </button>
          <button className="btn btn-success" onClick={handleBatchAddBlocks}>
            Add Blocks to Selected Cells
          </button>
        </div>
      )}
    </>
  );
};

export default GridOverlay;
