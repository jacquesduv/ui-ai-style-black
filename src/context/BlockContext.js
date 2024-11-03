// src/context/BlockContext.js
import React, { createContext, useContext, useState } from "react";

const BlockContext = createContext();

export const BlockProvider = ({ children }) => {
  const [blocks, setBlocks] = useState([
    { id: 1, lat: -27.945563, lng: 25.661019, targetRate: 3000 },
    { id: 2, lat: -27.945293, lng: 25.66132, targetRate: 3200 },
  ]);
  const [selectedBlock, setSelectedBlock] = useState(null);

  const addBlock = (newBlock) => {
    const newBlockWithId = { ...newBlock, id: blocks.length + 1 };
    setBlocks((prevBlocks) => [...prevBlocks, newBlockWithId]);
    setSelectedBlock(null);
  };

  const updateBlock = (updatedBlock) => {
    setBlocks((prevBlocks) =>
      prevBlocks.map((block) =>
        block.id === updatedBlock.id ? updatedBlock : block,
      ),
    );
    setSelectedBlock(null);
  };

  const deleteBlock = (blockId) => {
    if (
      window.confirm(`Are you sure you want to delete Block ID ${blockId}?`)
    ) {
      setBlocks((prevBlocks) =>
        prevBlocks.filter((block) => block.id !== blockId),
      );
      if (selectedBlock && selectedBlock.id === blockId) {
        setSelectedBlock(null);
      }
    }
  };

  const clearBlocks = () => {
    if (window.confirm("Are you sure you want to clear all blocks?")) {
      setBlocks([]);
      setSelectedBlock(null);
    }
  };

  return (
    <BlockContext.Provider
      value={{
        blocks,
        selectedBlock,
        setSelectedBlock,
        addBlock,
        updateBlock,
        deleteBlock,
        clearBlocks,
      }}
    >
      {children}
    </BlockContext.Provider>
  );
};

export const useBlockContext = () => useContext(BlockContext);
