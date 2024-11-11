// src/utils/fileUtils.js

import {
  notifySuccess,
  notifyError,
  notifyWarn,
} from "../utils/ToastNotifications";
import { encodeCoordinate, encodeTargetRate } from "./gridUtils";

// Constants for file format
const BLOCK_SIZE = 20; // Number of bytes per block
const VERSION = 1; // Supported file version

/**
 * Generates a binary .prt file from block data and triggers download.
 * @param {Array} blocks - Array of block objects containing data to be formatted.
 */
export const generatePartFile = (blocks) => {
  if (!blocks || blocks.length === 0) {
    notifyWarn("No blocks available for part file generation.");
    return;
  }

  // Filter for valid blocks
  const validBlocks = blocks.filter(
    (block) =>
      block.targetRate != null &&
      block.coordinates?.length >= 4 &&
      block.originalCoordinates?.length >= 2,
  );

  if (validBlocks.length === 0) {
    notifyWarn("No valid blocks with complete data.");
    return;
  }

  // Sort blocks by position: top-left to bottom-right
  validBlocks.sort((a, b) => {
    const aLat = Math.max(
      a.originalCoordinates[0].latitude,
      a.originalCoordinates[1].latitude,
    );
    const bLat = Math.max(
      b.originalCoordinates[0].latitude,
      b.originalCoordinates[1].latitude,
    );
    if (aLat !== bLat) return bLat - aLat;
    const aLng = Math.min(
      a.originalCoordinates[0].longitude,
      a.originalCoordinates[1].longitude,
    );
    const bLng = Math.min(
      b.originalCoordinates[0].longitude,
      b.originalCoordinates[1].longitude,
    );
    return aLng - bLng;
  });

  const totalSize = validBlocks.length * BLOCK_SIZE;
  const buffer = new ArrayBuffer(totalSize);
  const dataView = new DataView(buffer);

  let offset = 0;
  validBlocks.forEach((block) => {
    dataView.setUint8(offset, VERSION); // Version
    offset += 1;

    dataView.setUint16(offset, encodeTargetRate(block.targetRate), false); // Target rate
    offset += 2;

    // Write coordinates
    const coords = block.originalCoordinates;
    dataView.setInt32(offset, encodeCoordinate(coords[0].latitude), false);
    offset += 4;
    dataView.setInt32(offset, encodeCoordinate(coords[0].longitude), false);
    offset += 4;
    dataView.setInt32(offset, encodeCoordinate(coords[1].latitude), false);
    offset += 4;
    dataView.setInt32(offset, encodeCoordinate(coords[1].longitude), false);
    offset += 4;

    // Fill remaining bytes
    const remainingBytes = BLOCK_SIZE - 15;
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
  a.click();
  window.URL.revokeObjectURL(url);

  notifySuccess("Part file generated successfully!");
};

/**
 * Parses a .prt file and invokes a callback with parsed block data.
 * @param {Event} event - File input change event containing the uploaded file.
 * @param {Function} onLoadCallback - Callback invoked with parsed block data.
 */
export const uploadPartFile = (event, onLoadCallback) => {
  const file = event.target.files[0];
  if (!file) {
    notifyWarn("No file selected.");
    return;
  }

  if (file.type !== "application/octet-stream" && !file.name.endsWith(".prt")) {
    notifyError("Invalid file type. Please upload a .prt file.");
    return;
  }

  const reader = new FileReader();

  reader.onload = (e) => {
    const buffer = e.target.result;
    const dataView = new DataView(buffer);
    const blocks = [];

    if (buffer.byteLength % BLOCK_SIZE !== 0) {
      notifyWarn("File size does not match expected block format.");
      return;
    }

    const blockCount = buffer.byteLength / BLOCK_SIZE;
    for (let i = 0; i < blockCount; i++) {
      const offset = i * BLOCK_SIZE;

      const version = dataView.getUint8(offset);
      if (version !== VERSION) {
        notifyWarn("Unsupported file version.");
        return;
      }

      const targetRate = dataView.getUint16(offset + 1, false);
      const lat1 = dataView.getInt32(offset + 3, false) / 1e7;
      const lng1 = dataView.getInt32(offset + 7, false) / 1e7;
      const lat2 = dataView.getInt32(offset + 11, false) / 1e7;
      const lng2 = dataView.getInt32(offset + 15, false) / 1e7;

      blocks.push({
        targetRate,
        originalCoordinates: [
          { latitude: lat1, longitude: lng1 },
          { latitude: lat2, longitude: lng2 },
        ],
      });
    }

    onLoadCallback(blocks);
    notifySuccess("Part file loaded successfully!");
  };

  reader.onerror = () => notifyError("Error reading file.");
  reader.readAsArrayBuffer(file);
};
