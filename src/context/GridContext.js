// src/context/GridContext.js
import React, { createContext, useContext, useState, useEffect } from "react";
import {
  generateGridCells,
  snapToGridCell,
  isBlockWithinCell,
  batchUpdateCellsStatus,
  getCellCenterById,
} from "../utils/gridUtils";
import {
  notifySuccess,
  notifyError,
  notifyInfo,
  notifyWarn,
} from "../utils/ToastNotifications";

// Create context for grid
const GridContext = createContext();

// Custom hook to use the GridContext
export const useGridContext = () => useContext(GridContext);

// GridProvider component that manages the state of grid cells, including generating, selecting, and updating grid cells
export const GridProvider = ({ children }) => {
  const [gridCells, setGridCells] = useState([]);
  const [selectedCell, setSelectedCell] = useState(null);
  const [selectedCells, setSelectedCells] = useState([]); // For multi-selection
  const [cellSize, setCellSize] = useState({
    latOffset: 0.001,
    lngOffset: 0.001,
  });
  const [gridDimensions, setGridDimensions] = useState({ rows: 10, cols: 10 });
  const [gridCenter, setGridCenter] = useState({
    lat: -27.945563,
    lng: 25.661019,
  });

  /**
   * Generates the grid cells based on the current grid center, cell size, and grid dimensions.
   */
  const generateGridCellsHandler = () => {
    const cells = generateGridCells(
      gridCenter,
      cellSize,
      gridDimensions.rows,
      gridDimensions.cols,
    );
    setGridCells(cells);
    notifySuccess("Grid generated successfully!");
  };

  // Generate grid cells whenever grid center, cell size, or grid dimensions change
  useEffect(() => {
    generateGridCellsHandler();
  }, [gridCenter, cellSize, gridDimensions]);

  /**
   * Selects a grid cell based on the latitude and longitude of a click.
   * @param {number} clickedLat - Latitude of the clicked point.
   * @param {number} clickedLng - Longitude of the clicked point.
   */
  const selectCell = (clickedLat, clickedLng) => {
    const cell = snapToGridCell(clickedLat, clickedLng, gridCells);

    if (cell) {
      setSelectedCell(cell);
      notifySuccess(`Cell ${cell.id} selected!`);
    } else {
      notifyWarn("No cell found at this location.");
    }
  };

  /**
   * Toggle selection for multiple cells.
   * @param {Object} cell - The cell to toggle selection.
   */
  const toggleSelectCell = (cell) => {
    if (selectedCells.some((selected) => selected.id === cell.id)) {
      setSelectedCells((prev) =>
        prev.filter((selected) => selected.id !== cell.id),
      );
    } else {
      setSelectedCells((prev) => [...prev, cell]);
    }
  };

  /**
   * Batch update the status of multiple selected cells.
   * @param {string} status - New status to set (e.g., "applied").
   */
  const updateMultipleCellsStatus = (status) => {
    const cellIds = selectedCells.map((cell) => cell.id);
    const updatedCells = batchUpdateCellsStatus(cellIds, gridCells, status);
    setGridCells(updatedCells);
    setSelectedCells([]);
    notifySuccess(`Status updated for ${cellIds.length} cells.`);
  };

  /**
   * Updates the status of a single grid cell.
   * @param {string} cellId - The ID of the cell to update.
   * @param {string} status - New status to set.
   */
  const updateCellStatus = (cellId, status) => {
    setGridCells((prevCells) =>
      prevCells.map((cell) =>
        cell.id === cellId ? { ...cell, status } : cell,
      ),
    );
  };

  /**
   * Clears the entire grid and resets selections.
   */
  const clearGrid = () => {
    generateGridCellsHandler();
    setSelectedCell(null);
    setSelectedCells([]);
    notifyInfo("Grid cleared.");
  };

  /**
   * Clear the currently selected cell.
   */
  const clearSelectedCell = () => {
    setSelectedCell(null);
    notifyInfo("Selected cell cleared.");
  };

  /**
   * Get the center coordinates of a cell by its ID.
   * @param {string} cellId - The ID of the cell to get the center for.
   * @returns {Object|null} The center coordinates or null if not found.
   */
  const getCellCenter = (cellId) => {
    return getCellCenterById(cellId, gridCells);
  };

  // Provide the state and actions to the GridContext consumer
  const value = {
    gridCells,
    selectedCell,
    selectedCells,
    setSelectedCell,
    setSelectedCells,
    selectCell,
    toggleSelectCell,
    updateCellStatus,
    updateMultipleCellsStatus,
    generateGridCells: generateGridCellsHandler,
    clearGrid,
    clearSelectedCell,
    getCellCenter,
    gridCenter,
    setGridCenter,
    cellSize,
    setCellSize,
    gridDimensions,
    setGridDimensions,
  };

  return <GridContext.Provider value={value}>{children}</GridContext.Provider>;
};
