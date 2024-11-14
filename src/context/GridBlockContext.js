// src/context/GridBlockContext.js

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { generateGridCells, snapToGridCell } from "../utils/gridUtils";
import { generatePartFile } from "../utils/fileUtils";
import {
  notifySuccess,
  notifyError,
  notifyWarn,
  notifyInfo,
} from "../utils/ToastNotifications";

// Create the context for grid and block management
const GridBlockContext = createContext();

/**
 * Custom hook to access the GridBlockContext
 * @returns {Object} The context value
 */
export const useGridBlockContext = () => useContext(GridBlockContext);

/**
 * Provider component that manages the state of grid cells and blocks
 * @param {Object} props - The component props
 * @param {React.ReactNode} props.children - The child components
 * @returns {JSX.Element} The GridBlockContext provider
 */
export const GridBlockProvider = ({ children }) => {
  // State variables for grid management
  const [gridCells, setGridCells] = useState([]);
  const [gridParams, setGridParams] = useState(null);
  const [selectedCells, setSelectedCells] = useState([]);
  const [cellSize, setCellSize] = useState({ width: 100, height: 100 });
  const [gridDimensions, setGridDimensions] = useState({ rows: 10, cols: 10 });
  const [gridCenter, setGridCenter] = useState({
    latitude: -27.945563,
    longitude: 25.661019,
  });

  // State variables for block management
  const [blocks, setBlocks] = useState([]);
  const [selectedBlock, setSelectedBlock] = useState(null);

  /**
   * Load grid settings from localStorage and initialize the grid
   */
  const loadGridSettingsFromStorage = useCallback(() => {
    const savedGridSettings = JSON.parse(localStorage.getItem("gridSettings"));
    if (savedGridSettings) {
      setGridCenter(savedGridSettings.gridCenter);
      setCellSize(savedGridSettings.cellSize);
      setGridDimensions(savedGridSettings.gridDimensions);
      generateGridCellsHandler(
        savedGridSettings.gridCenter,
        savedGridSettings.cellSize,
        savedGridSettings.gridDimensions,
        false, // Don't clear blocks on initial load
      );
      notifySuccess("Grid settings restored from previous session.");
    } else {
      generateGridCellsHandler(gridCenter, cellSize, gridDimensions);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array ensures this runs only once

  /**
   * Save grid settings to localStorage
   */
  const saveGridSettingsToStorage = useCallback(() => {
    const gridSettings = { gridCenter, cellSize, gridDimensions };
    localStorage.setItem("gridSettings", JSON.stringify(gridSettings));
  }, [gridCenter, cellSize, gridDimensions]);

  /**
   * Load blocks from localStorage
   */
  const loadBlocksFromStorage = useCallback(() => {
    const savedBlocks = JSON.parse(localStorage.getItem("blocks"));
    if (savedBlocks) {
      setBlocks(savedBlocks);
      notifySuccess("Blocks restored from previous session.");
    }
  }, []);

  /**
   * Save blocks to localStorage
   */
  const saveBlocksToStorage = useCallback(() => {
    try {
      localStorage.setItem("blocks", JSON.stringify(blocks));
    } catch (error) {
      console.error("Failed to save blocks:", error);
      notifyError("Error saving blocks to local storage.");
    }
  }, [blocks]);

  // Effects to load data on mount
  useEffect(() => {
    loadGridSettingsFromStorage();
    loadBlocksFromStorage();
  }, [loadGridSettingsFromStorage, loadBlocksFromStorage]);

  // Effect to save grid settings whenever they change
  useEffect(() => {
    saveGridSettingsToStorage();
  }, [gridCenter, cellSize, gridDimensions, saveGridSettingsToStorage]);

  // Effect to save blocks whenever they change
  useEffect(() => {
    saveBlocksToStorage();
  }, [blocks, saveBlocksToStorage]);

  /**
   * Generate grid cells based on current settings
   * @param {Object} center - The center point of the grid
   * @param {Object} size - The size of each cell
   * @param {Object} dimensions - The number of rows and columns
   * @param {boolean} [shouldClearBlocks=true] - Whether to clear blocks on grid change
   */
  const generateGridCellsHandler = (
    center = gridCenter,
    size = cellSize,
    dimensions = gridDimensions,
    shouldClearBlocks = true,
  ) => {
    const { cells, gridParams: params } = generateGridCells(
      center,
      size,
      dimensions.rows,
      dimensions.cols,
    );
    setGridCells(cells);
    setGridParams(params);
    if (shouldClearBlocks) {
      clearBlocksOnGridChange();
    }
    notifySuccess("Grid generated successfully!");
  };

  /**
   * Clear blocks when the grid changes, after user confirmation
   */
  const clearBlocksOnGridChange = () => {
    if (blocks.length > 0) {
      if (
        window.confirm(
          "Changing the grid will clear all existing blocks. Do you want to proceed?",
        )
      ) {
        clearBlocks();
      }
    }
  };

  /**
   * Select a cell based on a clicked latitude and longitude
   * @param {number} clickedLat - The latitude of the click event
   * @param {number} clickedLng - The longitude of the click event
   */
  const selectCell = (clickedLat, clickedLng) => {
    if (!gridParams) {
      notifyError("Grid parameters not available.");
      return;
    }
    const cell = snapToGridCell(clickedLat, clickedLng, gridParams, gridCells);

    if (cell) {
      selectBlockByCell(cell);
      notifySuccess(`Cell ${cell.id} selected!`);
    } else {
      notifyWarn("No cell found at this location.");
    }
  };

  /**
   * Toggle the selection state of a cell for multi-selection
   * @param {Object} cell - The cell to toggle
   */
  const toggleSelectCell = (cell) => {
    const isSelected = selectedCells.some(
      (selected) => selected.id === cell.id,
    );
    const updatedSelection = isSelected
      ? selectedCells.filter((selected) => selected.id !== cell.id)
      : [...selectedCells, cell];

    setSelectedCells(updatedSelection);
    updateCellStatus(cell.id, isSelected ? "unselected" : "selected");
  };

  /**
   * Clear the selectedCells array
   */
  const clearSelectedCells = () => {
    setSelectedCells([]);
  };

  /**
   * Update the status of a single cell
   * @param {string} cellId - The ID of the cell to update
   * @param {string} status - The new status ('selected' or 'unselected')
   */
  const updateCellStatus = (cellId, status) => {
    setGridCells((prevCells) =>
      prevCells.map((cell) =>
        cell.id === cellId ? { ...cell, status } : cell,
      ),
    );
  };

  /**
   * Update the status and target rate of multiple selected cells
   * @param {string} status - The new status for the cells
   * @param {number|null} [targetRate=null] - The target rate to set
   */
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

    clearSelectedCells(); // Clear selectedCells after update
    notifySuccess(`Status updated for ${cellIds.length} cells.`);
  };

  /**
   * Update the block list based on cell status changes
   * @param {Array<string>} cellIds - IDs of the cells to update
   * @param {string} status - The new status ('selected' or 'unselected')
   * @param {number|null} targetRate - The target rate to set
   * @returns {Array<Object>} The updated list of blocks
   */
  const updateBlockListBasedOnCellStatus = (cellIds, status, targetRate) => {
    // Remove blocks corresponding to the cells
    let updatedBlocks = blocks.filter((block) => !cellIds.includes(block.id));

    if (status === "selected" && targetRate !== null) {
      // Add new blocks for the selected cells
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

  /**
   * Add a new block to the grid at a specified location
   * @param {Object} newBlock - The new block to add
   * @param {number} newBlock.lat - Latitude of the block
   * @param {number} newBlock.lng - Longitude of the block
   * @param {number} newBlock.targetRate - Target rate for the block
   */
  const addBlock = (newBlock) => {
    const { lat, lng, targetRate } = newBlock;
    if (!gridParams || !gridCells) {
      notifyError("Grid is not available. Please generate the grid first.");
      return;
    }

    const snappedCell = snapToGridCell(lat, lng, gridParams, gridCells);
    if (!snappedCell) {
      notifyWarn("No grid cell found at this location.");
      return;
    }

    const isDuplicate = blocks.some((block) => block.id === snappedCell.id);
    if (isDuplicate) {
      notifyWarn("Block already exists at this location.");
      return;
    }

    const blockWithId = {
      id: snappedCell.id,
      targetRate,
      coordinates: snappedCell.coordinates,
      originalCoordinates: snappedCell.originalCoordinates,
    };

    setBlocks((prevBlocks) => [...prevBlocks, blockWithId]);
    updateCellStatus(snappedCell.id, "selected");
    notifySuccess("Block added!");
  };

  /**
   * Update an existing block's information
   * @param {Object} updatedBlock - The block with updated information
   */
  const updateBlock = (updatedBlock) => {
    setBlocks((prevBlocks) =>
      prevBlocks.map((block) =>
        block.id === updatedBlock.id ? updatedBlock : block,
      ),
    );
    updateCellStatus(updatedBlock.id, "selected");
    notifySuccess("Block updated!");

    // If the updated block is the selectedBlock, update it
    if (selectedBlock && selectedBlock.id === updatedBlock.id) {
      setSelectedBlock(updatedBlock);
    }
  };

  /**
   * Delete a block by its ID
   * @param {string} blockId - The ID of the block to delete
   */
  const deleteBlock = (blockId) => {
    setBlocks((prevBlocks) =>
      prevBlocks.filter((block) => block.id !== blockId),
    );
    updateCellStatus(blockId, "unselected");

    if (selectedBlock && selectedBlock.id === blockId) {
      deselectBlock();
    }

    // Clear from selectedCells if present
    setSelectedCells((prev) => prev.filter((cell) => cell.id !== blockId));
    notifyInfo("Block deleted!");
  };

  /**
   * Clear all blocks from the grid
   */
  const clearBlocks = () => {
    setBlocks([]);
    deselectBlock();
    localStorage.removeItem("blocks");

    setGridCells((prevCells) =>
      prevCells.map((cell) => ({
        ...cell,
        status: "unselected",
        targetRate: null,
      })),
    );

    clearSelectedCells(); // Clear selectedCells after clearing blocks
    notifySuccess("All blocks have been cleared.");
  };

  /**
   * Save the current blocks as a .prt file
   */
  const saveBlocksAsPartFile = () => {
    if (blocks.length === 0) {
      notifyWarn("No blocks to save!");
      return;
    }

    try {
      generatePartFile(blocks);
      notifySuccess("Part file generated successfully!");
    } catch (error) {
      console.error("Error generating part file:", error);
      notifyError("Failed to generate part file.");
    }
  };

  /**
   * Select a block by cell
   * @param {Object} cell - The cell corresponding to the block
   */
  const selectBlockByCell = (cell) => {
    const block = blocks.find((b) => b.id === cell.id);
    if (block) {
      selectBlock(block);
    } else {
      deselectBlock();
    }
  };

  /**
   * Set the selectedBlock to the provided block
   * @param {Object} block - The block to select
   */
  const selectBlock = (block) => {
    setSelectedBlock(block);
  };

  /**
   * Clear the selectedBlock by setting it to null
   */
  const deselectBlock = () => {
    setSelectedBlock(null);
  };

  // Context value to be provided to consuming components
  const value = {
    grid: {
      cells: gridCells,
      params: gridParams,
      center: gridCenter,
      dimensions: gridDimensions,
      cellSize,
      selectCell,
      toggleSelectCell,
      clearSelectedCells,
      updateCellStatus,
      updateMultipleCellsStatus,
      generateGridCells: generateGridCellsHandler,
    },
    blocks: {
      items: blocks,
      selected: selectedBlock,
      select: selectBlock,
      deselect: deselectBlock,
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
