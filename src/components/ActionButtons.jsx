// src/components/ActionButtons.jsx
import React from "react";
import { Button } from "react-bootstrap";
import { downloadJSON } from "../utils/fileUtils";
import { useBlockContext } from "../context/BlockContext";
import { generatePartFile } from "../utils/api";
import {
  notifySuccess,
  notifyWarn,
  notifyError,
  notifyInfo,
} from "../utils/ToastNotifications";

const ActionButtons = () => {
  const { blocks, clearBlocks } = useBlockContext();

  // Handle downloading blocks as JSON
  const handleDownloadBlocks = () => {
    if (blocks.length > 0) {
      downloadJSON(blocks, "blocks.json");
      notifySuccess("Blocks downloaded successfully!");
    } else {
      notifyWarn("No blocks to download.");
    }
  };

  // Handle generating the part file
  const handleGeneratePartFile = async () => {
    if (blocks.length > 0) {
      try {
        await generatePartFile(blocks);
        notifySuccess("Part file generated successfully!");
      } catch (error) {
        notifyError("Failed to generate part file.");
        console.error("Error generating part file:", error);
      }
    } else {
      notifyWarn("No blocks available to generate the part file.");
    }
  };

  // Handle clearing all blocks
  const handleClearBlocks = () => {
    clearBlocks();
    notifyInfo("All blocks cleared.");
  };

  return (
    <div className="mt-3 d-flex flex-column">
      <Button variant="success" className="mb-2" onClick={handleDownloadBlocks}>
        Download Blocks as JSON
      </Button>
      <Button
        variant="primary"
        className="mb-2"
        onClick={handleGeneratePartFile}
      >
        Generate Part File
      </Button>
      <Button variant="danger" onClick={handleClearBlocks}>
        Clear All Blocks
      </Button>
    </div>
  );
};

export default ActionButtons;
