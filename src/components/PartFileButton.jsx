// src/components/PartFileButton.jsx
import React from "react";
import { useGridBlockContext } from "../context/GridBlockContext";
import {
  notifySuccess,
  notifyError,
  notifyWarn,
} from "../utils/ToastNotifications";
import "../styles/ControlPanel.css";

const PartFileButton = () => {
  const { blocks, saveBlocksAsPartFile } = useGridBlockContext();

  const handleGeneratePartFile = () => {
    if (blocks.length === 0)
      return notifyWarn("No blocks to generate a part file.");

    try {
      saveBlocksAsPartFile();
      notifySuccess("Part file generated successfully!");
    } catch (error) {
      console.error("Error generating part file:", error);
      notifyError("Failed to generate part file.");
    }
  };

  return (
    <div className="part-file-button-container">
      <button
        className="generate-button"
        onClick={handleGeneratePartFile}
        disabled={blocks.length === 0}
      >
        Generate Part File
      </button>
    </div>
  );
};

export default PartFileButton;
