// src/context/GridBlockContext.js

import React, { createContext, useContext, useState, useEffect } from "react";
import {
  generateGridCells,
  snapToGridCell,
  getCellCenterById,
} from "../utils/gridUtils";
import { generatePartFile } from "../utils/fileUtils";
import {
  notifySuccess,
  notifyError,
  notifyWarn,
  notifyInfo,
} from "../utils/ToastNotifications";

const GridBlockContext = createContext();
export const useGridBlockContext = () => useContext(GridBlockContext);

// Provider component that manages the state of grid cells and blocks
export const GridBlockProvider = ({ children }) => {
  const [gridCells, setGridCells] = useState([]);
  const [gridParams, setGridParams] = useState(null);
  const [selectedCell, setSelectedCell] = useState(null);
  const [selectedCells, setSelectedCells] = useState([]);
  const [cellSize, setCellSize] = useState({ width: 100, height: 100 });
  const [gridDimensions, setGridDimensions] = useState({ rows: 10, cols: 10 });
  const [gridCenter, setGridCenter] = useState({
    latitude: -27.945563,
    longitude: 25.661019,
  });
  const [blocks, setBlocks] = useState([]);
  const [selectedBlock, setSelectedBlock] = useState(null);

  // Load grid settings and blocks from localStorage
  useEffect(() => {
    loadGridSettingsFromStorage();
    loadBlocksFromStorage();
  }, []);

  useEffect(
    () => saveGridSettingsToStorage(),
    [gridCenter, cellSize, gridDimensions],
  );
  useEffect(() => saveBlocksToStorage(), [blocks]);

  const loadGridSettingsFromStorage = () => {
    const savedGridSettings = JSON.parse(localStorage.getItem("gridSettings"));
    if (savedGridSettings) {
      setGridCenter(savedGridSettings.gridCenter);
      setCellSize(savedGridSettings.cellSize);
      setGridDimensions(savedGridSettings.gridDimensions);
      notifySuccess("Grid settings restored from previous session.");
    } else {
      generateGridCellsHandler();
    }
  };

  const saveGridSettingsToStorage = () => {
    const gridSettings = { gridCenter, cellSize, gridDimensions };
    localStorage.setItem("gridSettings", JSON.stringify(gridSettings));
  };

  const loadBlocksFromStorage = () => {
    const savedBlocks = JSON.parse(localStorage.getItem("blocks"));
    if (savedBlocks) {
      setBlocks(savedBlocks);
      notifySuccess("Blocks restored from previous session.");
    }
  };

  const saveBlocksToStorage = () => {
    localStorage.setItem("blocks", JSON.stringify(blocks));
  };

  const generateGridCellsHandler = () => {
    const { cells, gridParams: params } = generateGridCells(
      gridCenter,
      cellSize,
      gridDimensions.rows,
      gridDimensions.cols,
    );
    setGridCells(cells);
    setGridParams(params);
    clearBlocksOnGridChange();
    notifySuccess("Grid generated successfully!");
  };

  const clearBlocksOnGridChange = () => {
    if (blocks.length > 0) {
      if (
        window.confirm(
          "Changing the grid will clear all existing blocks. Do you want to proceed?",
        )
      ) {
        setBlocks([]);
        notifyInfo("Blocks cleared due to grid change.");
      }
    }
  };

  const selectCell = (clickedLat, clickedLng) => {
    if (!gridParams) return notifyError("Grid parameters not available.");
    const cell = snapToGridCell(clickedLat, clickedLng, gridParams, gridCells);

    if (cell) {
      setSelectedCell(cell);
      notifySuccess(`Cell ${cell.id} selected!`);
    } else {
      notifyWarn("No cell found at this location.");
    }
  };

  const toggleSelectCell = (cell) => {
    const isSelected = selectedCells.some(
      (selected) => selected.id === cell.id,
    );
    const updatedSelection = isSelected
      ? selectedCells.filter((selected) => selected.id !== cell.id)
      : [...selectedCells, cell];

    setSelectedCells(updatedSelection);
    updateSelectedCell(cell.id, isSelected ? "unselected" : "selected");
  };

  const updateCellStatus = (cellId, status) => {
    setGridCells((prevCells) =>
      prevCells.map((cell) =>
        cell.id === cellId ? { ...cell, status } : cell,
      ),
    );
  };

  const updateSelectedCell = (cellId, status) => {
    setGridCells((prevCells) =>
      prevCells.map((cell) =>
        cell.id === cellId ? { ...cell, status } : cell,
      ),
    );
  };

  const updateMultipleCellsStatus = (status, targetRate = null) => {
    const cellIds = selectedCells.map((cell) => cell.id);

    setGridCells((prevCells) =>
      prevCells.map((cell) =>
        cellIds.includes(cell.id) ? { ...cell, status, targetRate } : cell,
      ),
    );

    const updatedBlocks = updateBlockListBasedOnCellStatus(
      cellIds,
      status,
      targetRate,
    );
    setBlocks(updatedBlocks);

    setSelectedCells([]);
    notifySuccess(`Status updated for ${cellIds.length} cells.`);
  };

  const updateBlockListBasedOnCellStatus = (cellIds, status, targetRate) => {
    let updatedBlocks = blocks.filter((block) => !cellIds.includes(block.id));

    if (status === "selected" && targetRate !== null) {
      const newBlocks = selectedCells.map((cell) => ({
        id: cell.id,
        targetRate,
        coordinates: cell.coordinates,
        originalCoordinates: cell.originalCoordinates,
      }));
      updatedBlocks = [...updatedBlocks, ...newBlocks];
    }

    return updatedBlocks;
  };

  const addBlock = (newBlock) => {
    const { lat, lng, targetRate } = newBlock;
    if (!gridParams || !gridCells)
      return notifyError(
        "Grid is not available. Please generate the grid first.",
      );

    const snappedCell = snapToGridCell(lat, lng, gridParams, gridCells);
    if (!snappedCell) return notifyWarn("No grid cell found at this location.");

    const isDuplicate = blocks.some((block) => block.id === snappedCell.id);
    if (isDuplicate)
      return notifyWarn("Block already exists at this location.");

    const blockWithId = {
      id: snappedCell.id,
      targetRate,
      coordinates: snappedCell.coordinates,
      originalCoordinates: snappedCell.originalCoordinates,
    };

    setBlocks((prevBlocks) => [...prevBlocks, blockWithId]);
    updateSelectedCell(snappedCell.id, "selected");
    notifySuccess("Block added!");
  };

  const updateBlock = (updatedBlock) => {
    setBlocks((prevBlocks) =>
      prevBlocks.map((block) =>
        block.id === updatedBlock.id ? updatedBlock : block,
      ),
    );
    updateSelectedCell(updatedBlock.id, "selected");
    notifySuccess("Block updated!");
  };

  const deleteBlock = (blockId) => {
    setBlocks((prevBlocks) =>
      prevBlocks.filter((block) => block.id !== blockId),
    );
    updateSelectedCell(blockId, "unselected");

    if (selectedBlock && selectedBlock.id === blockId) {
      setSelectedBlock(null);
    }

    notifyInfo("Block deleted!");
  };

  const clearBlocks = () => {
    setBlocks([]);
    setSelectedBlock(null);
    localStorage.removeItem("blocks");

    setGridCells((prevCells) =>
      prevCells.map((cell) => ({
        ...cell,
        status: "unselected",
        targetRate: null,
      })),
    );

    notifyInfo("All blocks cleared");
  };

  const saveBlocksAsPartFile = () => {
    if (blocks.length === 0) return notifyWarn("No blocks to save!");

    try {
      generatePartFile(blocks);
      notifySuccess("Part file generated successfully!");
    } catch (error) {
      console.error("Error generating part file:", error);
      notifyError("Failed to generate part file.");
    }
  };

  const value = {
    grid: {
      cells: gridCells,
      params: gridParams,
      center: gridCenter,
      dimensions: gridDimensions,
      cellSize,
      selectCell,
      toggleSelectCell,
      updateCellStatus,
      updateMultipleCellsStatus,
      generateGridCells: generateGridCellsHandler,
    },
    blocks: {
      items: blocks,
      selected: selectedBlock,
      add: addBlock,
      update: updateBlock,
      delete: deleteBlock,
      clear: clearBlocks,
      saveAsPartFile: saveBlocksAsPartFile,
    },
    settings: {
      setGridCenter,
      setCellSize,
      setGridDimensions,
    },
  };

  return (
    <GridBlockContext.Provider value={value}>
      {children}
    </GridBlockContext.Provider>
  );
};
