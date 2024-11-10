// src/utils/fileUtils.js

import {
  notifySuccess,
  notifyError,
  notifyWarn,
  notifyInfo,
} from "../utils/ToastNotifications";
import { encodeCoordinate, encodeTargetRate } from "./gridUtils";

/**
 * Function to download data as a JSON file.
 *
 * @param {Array} data - The data to be downloaded as JSON.
 * @param {string} [filename="blocks.json"] - The name of the file to be downloaded.
 */
export const downloadJSON = (data, filename = "blocks.json") => {
  if (!data || data.length === 0) {
    notifyWarn("No data to download!");
    return;
  }

  const jsonStr = JSON.stringify(data, null, 2);

  const blob = new Blob([jsonStr], { type: "application/json" });

  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;

  document.body.appendChild(a);
  a.click();
  a.remove();

  window.URL.revokeObjectURL(url);

  notifySuccess("JSON file downloaded successfully!");
};

/**
 * Function to upload a JSON file and parse its content.
 *
 * @param {Event} event - The file input event that contains the uploaded file.
 * @param {Function} onLoadCallback - Callback function to be called with the parsed data.
 */
export const uploadJSON = async (event, onLoadCallback) => {
  const file = event.target.files[0];

  if (!file) {
    notifyWarn("No file selected.");
    return;
  }

  if (file.type !== "application/json") {
    notifyError("Invalid file type. Please upload a JSON file.");
    return;
  }

  try {
    const reader = new FileReader();

    reader.onload = (e) => {
      const content = e.target.result;
      const parsedData = JSON.parse(content);

      if (Array.isArray(parsedData)) {
        onLoadCallback(parsedData);
        notifySuccess("JSON file loaded successfully!");
      } else {
        notifyError("Invalid file structure.");
      }
    };

    reader.readAsText(file);
  } catch (error) {
    console.error("Error reading file:", error);
    notifyError("Failed to upload JSON file.");
  }
};

/**
 * Function to generate a binary .prt file from block data.
 *
 * @param {Array} blocks - Array of block objects containing data to be formatted.
 */
export const generatePartFile = (blocks) => {
  if (!blocks || blocks.length === 0) {
    notifyWarn("No blocks available for part file generation.");
    return;
  }

  // Ensure all required data is present
  const validBlocks = blocks.filter(
    (block) =>
      block.targetRate != null &&
      block.coordinates &&
      block.coordinates.length >= 4 &&
      block.originalCoordinates &&
      block.originalCoordinates.length >= 2,
  );

  if (validBlocks.length === 0) {
    notifyWarn("No valid blocks with complete data.");
    return;
  }

  // Sort blocks from top-left to bottom-right
  validBlocks.sort((a, b) => {
    const aLat = Math.max(
      a.originalCoordinates[0].latitude,
      a.originalCoordinates[1].latitude,
    );
    const bLat = Math.max(
      b.originalCoordinates[0].latitude,
      b.originalCoordinates[1].latitude,
    );

    if (aLat !== bLat) {
      return bLat - aLat; // Descending latitude (top to bottom)
    } else {
      const aLng = Math.min(
        a.originalCoordinates[0].longitude,
        a.originalCoordinates[1].longitude,
      );
      const bLng = Math.min(
        b.originalCoordinates[0].longitude,
        b.originalCoordinates[1].longitude,
      );
      return aLng - bLng; // Ascending longitude (left to right)
    }
  });

  const blockSize = 20; // Number of bytes per block as per your file format
  const totalSize = validBlocks.length * blockSize;
  const buffer = new ArrayBuffer(totalSize);
  const dataView = new DataView(buffer);

  let offset = 0;

  validBlocks.forEach((block) => {
    // Write version (assuming 1 byte, set to 1)
    dataView.setUint8(offset, 1); // Version
    offset += 1;

    // Write target rate (2 bytes, big-endian)
    dataView.setUint16(offset, encodeTargetRate(block.targetRate), false);
    offset += 2;

    // Write Coordinate 1 latitude (4 bytes, signed integer, big-endian)
    dataView.setInt32(
      offset,
      encodeCoordinate(block.originalCoordinates[0].latitude),
      false,
    );
    offset += 4;

    // Write Coordinate 1 longitude (4 bytes, signed integer, big-endian)
    dataView.setInt32(
      offset,
      encodeCoordinate(block.originalCoordinates[0].longitude),
      false,
    );
    offset += 4;

    // Write Coordinate 2 latitude (4 bytes, signed integer, big-endian)
    dataView.setInt32(
      offset,
      encodeCoordinate(block.originalCoordinates[1].latitude),
      false,
    );
    offset += 4;

    // Write Coordinate 2 longitude (4 bytes, signed integer, big-endian)
    dataView.setInt32(
      offset,
      encodeCoordinate(block.originalCoordinates[1].longitude),
      false,
    );
    offset += 4;

    // Remaining bytes (if any) can be padded with zeros to reach blockSize
    const bytesWritten = 1 + 2 + 4 + 4 + 4 + 4;
    const remainingBytes = blockSize - bytesWritten;
    for (let i = 0; i < remainingBytes; i++) {
      dataView.setUint8(offset, 0);
      offset += 1;
    }
  });

  const blob = new Blob([buffer], { type: "application/octet-stream" });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "partfile.prt";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);

  notifySuccess("Part file generated successfully!");
};
