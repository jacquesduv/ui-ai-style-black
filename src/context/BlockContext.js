// src/context/BlockContext.js
import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "react-toastify";
import { generatePartFile } from "../utils/api";

// Create context for blocks
const BlockContext = createContext();

/**
 * Custom hook to use the BlockContext.
 *
 * @returns {Object} The value provided by the BlockContext, including blocks,
 * selected block, and various functions to manage blocks.
 */
export const useBlockContext = () => useContext(BlockContext);

/**
 * Helper function to snap coordinates to the nearest grid cell.
 *
 * @param {number} lat - Latitude to be snapped.
 * @param {number} lng - Longitude to be snapped.
 * @param {number} cellSize - The grid cell size to snap to.
 * @returns {Object} The snapped latitude and longitude.
 *
 * This function rounds the latitude and longitude to the nearest cellSize
 * to align with a grid system for precise placement of blocks.
 */
const snapToGrid = (lat, lng, cellSize) => {
  const snappedLat = Math.round(lat / cellSize) * cellSize;
  const snappedLng = Math.round(lng / cellSize) * cellSize;
  return { lat: snappedLat, lng: snappedLng };
};

/**
 * BlockProvider component that manages the state of blocks, including
 * adding, updating, deleting, and saving blocks, as well as syncing with
 * localStorage.
 *
 * @param {ReactNode} children - The children elements that will have access to the BlockContext.
 *
 * This component loads saved blocks from localStorage on initialization,
 * saves blocks whenever they change, and provides functions to modify
 * blocks and generate a part file.
 */
export const BlockProvider = ({ children }) => {
  const [blocks, setBlocks] = useState([]); // State to hold the list of blocks
  const [selectedBlock, setSelectedBlock] = useState(null); // State to hold the selected block
  const cellSize = 0.001; // Adjust grid cell size as needed for snapping

  // Load blocks from local storage on initialization
  useEffect(() => {
    const savedBlocks = JSON.parse(localStorage.getItem("blocks"));
    if (savedBlocks) {
      setBlocks(savedBlocks);
      toast.success("Blocks restored from previous session.");
    }
  }, []);

  // Save blocks to local storage whenever blocks change
  useEffect(() => {
    localStorage.setItem("blocks", JSON.stringify(blocks));
  }, [blocks]);

  /**
   * Adds a new block, snapping its coordinates to the grid and checking for duplicates.
   *
   * @param {Object} newBlock - The block object containing latitude, longitude, and target rate.
   *
   * This function ensures that the new block is snapped to the nearest grid cell,
   * and prevents adding duplicate blocks at the same location.
   */
  const addBlock = (newBlock) => {
    const { lat, lng, targetRate } = newBlock;

    // Snap to grid before adding
    const snappedCoords = snapToGrid(lat, lng, cellSize);

    // Check if block already exists at the snapped coordinates
    const isDuplicate = blocks.some(
      (block) =>
        block.lat === snappedCoords.lat && block.lng === snappedCoords.lng,
    );
    if (isDuplicate) {
      toast.warn("Block already exists at this location.");
      return;
    }

    const id = blocks.length + 1;
    const blockWithId = { ...snappedCoords, targetRate, id };
    setBlocks((prevBlocks) => [...prevBlocks, blockWithId]);
    toast.success("Block added!");
  };

  /**
   * Updates an existing block with new data.
   *
   * @param {Object} updatedBlock - The updated block object.
   *
   * This function updates the block in the state with the provided updated block data.
   */
  const updateBlock = (updatedBlock) => {
    setBlocks((prevBlocks) =>
      prevBlocks.map((block) =>
        block.id === updatedBlock.id ? updatedBlock : block,
      ),
    );
    toast.success("Block updated!");
  };

  /**
   * Deletes a block by its ID and clears the selected block if it's the one being deleted.
   *
   * @param {number} blockId - The ID of the block to be deleted.
   *
   * This function removes the block from the state and clears the selected block if it's deleted.
   */
  const deleteBlock = (blockId) => {
    setBlocks((prevBlocks) =>
      prevBlocks.filter((block) => block.id !== blockId),
    );
    if (selectedBlock && selectedBlock.id === blockId) {
      setSelectedBlock(null);
    }
    toast.info("Block deleted!");
  };

  /**
   * Clears all blocks from the state and removes them from localStorage.
   *
   * This function empties the blocks array and also removes the saved blocks
   * from localStorage. The selected block is also cleared.
   */
  const clearBlocks = () => {
    setBlocks([]);
    setSelectedBlock(null);
    localStorage.removeItem("blocks");
    toast.info("All blocks cleared");
  };

  /**
   * Saves the current blocks as a part file by calling the API function.
   *
   * This function checks if there are any blocks to save and attempts to generate
   * a part file from the current block data. If successful, a success message is shown.
   *
   * @throws {Error} If there are no blocks to save or if the API call fails.
   */
  const saveBlocksAsPartFile = async () => {
    if (blocks.length === 0) {
      toast.warn("No blocks to save!");
      return;
    }
    try {
      await generatePartFile(blocks);
      toast.success("Part file generated successfully!");
    } catch (error) {
      console.error("Error generating part file:", error);
      toast.error("Failed to generate part file.");
    }
  };

  // Provide the state and actions to the BlockContext consumer
  const value = {
    blocks,
    selectedBlock,
    setSelectedBlock,
    addBlock,
    updateBlock,
    deleteBlock,
    clearBlocks,
    saveBlocksAsPartFile,
  };

  // Return the BlockContext provider with the value
  return (
    <BlockContext.Provider value={value}>{children}</BlockContext.Provider>
  );
};
