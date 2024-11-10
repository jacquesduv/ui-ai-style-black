// src/utils/gridUtils.js

import {
  computeDestinationPoint,
  getDistance as geolibGetDistance,
} from "geolib";

/**
 * Generate grid cells based on the given center, cell size, rows, and columns.
 * Returns both the cells and grid parameters.
 *
 * @param {Object} center - The center point of the grid ({ latitude, longitude }).
 * @param {Object} cellSize - The size of each cell in meters ({ width, height }).
 * @param {number} rows - Number of rows in the grid.
 * @param {number} cols - Number of columns in the grid.
 * @returns {Object} An object containing the cells array and grid parameters.
 */
export const generateGridCells = (center, cellSize, rows, cols) => {
  if (rows <= 0 || cols <= 0 || cellSize.height <= 0 || cellSize.width <= 0) {
    console.error(
      "Invalid grid parameters: Rows, columns, or cell size cannot be zero or negative.",
    );
    return { cells: [], gridParams: null };
  }

  const cells = [];
  const { latitude: centerLat, longitude: centerLng } = center;

  // Calculate the top-left corner of the grid
  const totalHeight = cellSize.height * rows;
  const totalWidth = cellSize.width * cols;

  // Move from center to top-left corner
  const topEdgePoint = computeDestinationPoint(
    { latitude: centerLat, longitude: centerLng },
    totalHeight / 2,
    0, // North
  );
  const origin = computeDestinationPoint(
    topEdgePoint,
    totalWidth / 2,
    270, // West
  );

  for (let row = 0; row < rows; row++) {
    // For each row, move south from the origin
    const rowOrigin = computeDestinationPoint(
      origin,
      cellSize.height * row,
      180, // South
    );

    for (let col = 0; col < cols; col++) {
      // For each column, move east from the rowOrigin
      const cellOrigin = computeDestinationPoint(
        rowOrigin,
        cellSize.width * col,
        90, // East
      );

      const topLeft = cellOrigin;
      const topRight = computeDestinationPoint(
        topLeft,
        cellSize.width,
        90, // East
      );
      const bottomLeft = computeDestinationPoint(
        topLeft,
        cellSize.height,
        180, // South
      );
      const bottomRight = computeDestinationPoint(
        bottomLeft,
        cellSize.width,
        90, // East
      );

      // Compute cell center
      const centerPoint = computeDestinationPoint(
        topLeft,
        cellSize.height / 2,
        180, // South
      );
      const cellCenter = computeDestinationPoint(
        centerPoint,
        cellSize.width / 2,
        90, // East
      );

      const cell = {
        id: `${row}-${col}`,
        coordinates: [topLeft, topRight, bottomRight, bottomLeft],
        center: cellCenter,
        status: "unselected",
        targetRate: null,
        row: row,
        col: col,
        originalCoordinates: [topLeft, bottomRight],
      };

      cells.push(cell);
    }
  }

  const gridParams = {
    origin,
    cellSize,
    rows,
    cols,
  };

  return { cells, gridParams };
};

/**
 * Snap a point (latitude, longitude) to the corresponding grid cell.
 *
 * @param {number} lat - Latitude of the point.
 * @param {number} lng - Longitude of the point.
 * @param {Object} gridParams - Parameters of the grid including origin and cell dimensions.
 * @param {Array} cells - Array of grid cells.
 * @returns {Object|null} The grid cell corresponding to the point or null if out of bounds.
 */
export const snapToGridCell = (lat, lng, gridParams, cells) => {
  const { origin, cellSize, rows, cols } = gridParams;

  // Calculate the distance in meters from the grid origin to the point
  const northSouthDistance = geolibGetDistance(
    { latitude: origin.latitude, longitude: origin.longitude },
    { latitude: lat, longitude: origin.longitude },
  );

  const eastWestDistance = geolibGetDistance(
    { latitude: origin.latitude, longitude: origin.longitude },
    { latitude: origin.latitude, longitude: lng },
  );

  // Determine the row and column indices
  const row = Math.floor(Math.abs(northSouthDistance) / cellSize.height);
  const col = Math.floor(Math.abs(eastWestDistance) / cellSize.width);

  // Adjust row and column based on direction
  const isSouth = lat < origin.latitude;
  const isEast = lng > origin.longitude;

  const adjustedRow = isSouth ? row : -row;
  const adjustedCol = isEast ? col : -col;

  // Check if indices are within grid bounds
  if (
    adjustedRow >= 0 &&
    adjustedRow < rows &&
    adjustedCol >= 0 &&
    adjustedCol < cols
  ) {
    const cellId = `${adjustedRow}-${adjustedCol}`;
    // Retrieve the cell from the cells array
    const cell = cells.find((cell) => cell.id === cellId);
    return cell;
  } else {
    return null; // The point is outside the grid
  }
};

/**
 * Calculate the distance between two points (latitude and longitude).
 * Uses geolib's getDistance function.
 *
 * @param {number} lat1 - Latitude of the first point.
 * @param {number} lng1 - Longitude of the first point.
 * @param {number} lat2 - Latitude of the second point.
 * @param {number} lng2 - Longitude of the second point.
 * @returns {number} Distance between the two points in meters.
 */
export const getDistance = (lat1, lng1, lat2, lng2) => {
  return geolibGetDistance(
    { latitude: lat1, longitude: lng1 },
    { latitude: lat2, longitude: lng2 },
  );
};

/**
 * Check if a point is within a specific grid cell.
 *
 * @param {Object} point - The point to check ({ latitude, longitude }).
 * @param {Object} cell - The grid cell to check against.
 * @returns {boolean} True if the point is within the cell, otherwise false.
 */
export const isPointWithinCell = (point, cell) => {
  const { latitude: lat, longitude: lng } = point;
  const { coordinates } = cell;

  // Assuming the coordinates are ordered [topLeft, topRight, bottomRight, bottomLeft]
  const latMin = Math.min(coordinates[2].latitude, coordinates[3].latitude);
  const latMax = Math.max(coordinates[0].latitude, coordinates[1].latitude);
  const lngMin = Math.min(coordinates[0].longitude, coordinates[3].longitude);
  const lngMax = Math.max(coordinates[1].longitude, coordinates[2].longitude);

  return lat >= latMin && lat <= latMax && lng >= lngMin && lng <= lngMax;
};

/**
 * Convert grid cell data to a format suitable for generating a part file.
 *
 * @param {Array} cells - Array of grid cells.
 * @returns {Array} Array of formatted cells with IDs, encoded coordinates, and original coordinates.
 */
export const formatCellsForPartFile = (cells) => {
  return cells
    .filter((cell) => cell.status === "selected" && cell.targetRate != null)
    .map((cell, index) => ({
      id: index + 1,
      targetRate: cell.targetRate,
      coordinates: [
        encodeCoordinate(cell.coordinates[0].latitude),
        encodeCoordinate(cell.coordinates[0].longitude),
        encodeCoordinate(cell.coordinates[2].latitude),
        encodeCoordinate(cell.coordinates[2].longitude),
      ],
      originalCoordinates: [
        cell.coordinates[0], // topLeft
        cell.coordinates[2], // bottomRight
      ],
    }));
};

/**
 * Encode a coordinate (latitude or longitude) into an integer format.
 *
 * @param {number} coordinate - The coordinate to encode.
 * @returns {number} The encoded integer value.
 */
export const encodeCoordinate = (coordinate) => {
  const scalingFactor = 1e7; // Scaling factor for high precision
  return Math.round(coordinate * scalingFactor);
};

/**
 * Encode a target rate into the required format.
 *
 * @param {number} rate - The target rate to encode.
 * @returns {number} The encoded target rate.
 */
export const encodeTargetRate = (rate) => {
  return Math.round(rate); // Adjust if scaling is needed
};
