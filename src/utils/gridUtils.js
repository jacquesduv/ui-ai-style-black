// src/utils/gridUtils.js

import {
  computeDestinationPoint,
  getDistance as geolibGetDistance,
} from "geolib";

// ------------------------ Grid Cell Generation ------------------------

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
  const origin = calculateGridOrigin(center, cellSize, rows, cols);

  for (let row = 0; row < rows; row++) {
    const rowOrigin = computeDestinationPoint(
      origin,
      cellSize.height * row,
      180,
    ); // South
    for (let col = 0; col < cols; col++) {
      const cell = createCell(row, col, rowOrigin, cellSize);
      cells.push(cell);
    }
  }

  return {
    cells,
    gridParams: { origin, cellSize, rows, cols },
  };
};

/**
 * Calculate the origin of the grid based on center and grid dimensions.
 * @param {Object} center - The center point of the grid.
 * @param {Object} cellSize - The size of each cell.
 * @param {number} rows - Number of rows.
 * @param {number} cols - Number of columns.
 * @returns {Object} The origin point of the grid.
 */
const calculateGridOrigin = (center, cellSize, rows, cols) => {
  const totalHeight = cellSize.height * rows;
  const totalWidth = cellSize.width * cols;

  const topEdgePoint = computeDestinationPoint(center, totalHeight / 2, 0); // North
  return computeDestinationPoint(topEdgePoint, totalWidth / 2, 270); // West
};

/**
 * Create a cell with the specified row, column, origin point, and cell size.
 * @param {number} row - Row index of the cell.
 * @param {number} col - Column index of the cell.
 * @param {Object} rowOrigin - Origin point of the row.
 * @param {Object} cellSize - Size of each cell.
 * @returns {Object} Cell object with its coordinates, center, and metadata.
 */
const createCell = (row, col, rowOrigin, cellSize) => {
  const cellOrigin = computeDestinationPoint(
    rowOrigin,
    cellSize.width * col,
    90,
  ); // East
  const cellCorners = calculateCellCorners(cellOrigin, cellSize);
  const cellCenter = calculateCellCenter(cellOrigin, cellSize);

  return {
    id: `${row}-${col}`,
    coordinates: cellCorners,
    center: cellCenter,
    status: "unselected",
    targetRate: null,
    row,
    col,
    originalCoordinates: [cellCorners[0], cellCorners[2]], // topLeft and bottomRight
  };
};

/**
 * Calculate the four corners of a cell based on its origin and size.
 * @param {Object} origin - The origin point of the cell.
 * @param {Object} cellSize - Size of each cell.
 * @returns {Array} Array of corner points [topLeft, topRight, bottomRight, bottomLeft].
 */
const calculateCellCorners = (origin, cellSize) => {
  if (!origin || !cellSize) {
    console.error(
      "Invalid parameters for calculateCellCorners: origin or cellSize is missing.",
    );
    return [];
  }
  const topLeft = origin;
  const topRight = computeDestinationPoint(topLeft, cellSize.width, 90); // East
  const bottomLeft = computeDestinationPoint(topLeft, cellSize.height, 180); // South
  const bottomRight = computeDestinationPoint(bottomLeft, cellSize.width, 90); // East
  return [topLeft, topRight, bottomRight, bottomLeft];
};

/**
 * Calculate the center of a cell based on its origin and size.
 * @param {Object} origin - The origin point of the cell.
 * @param {Object} cellSize - Size of each cell.
 * @returns {Object} The center point of the cell.
 */
const calculateCellCenter = (origin, cellSize) => {
  if (!origin || !cellSize) {
    console.error(
      "Invalid parameters for calculateCellCenter: origin or cellSize is missing.",
    );
    return null;
  }
  const centerPoint = computeDestinationPoint(origin, cellSize.height / 2, 180); // South
  return computeDestinationPoint(centerPoint, cellSize.width / 2, 90); // East
};

// ------------------------ Grid Cell Operations ------------------------

/**
 * Snap a point (latitude, longitude) to the corresponding grid cell.
 * Calculates the row and column based on the distance from the origin
 * and finds the closest cell if within bounds.
 *
 * @param {number} lat - Latitude of the point.
 * @param {number} lng - Longitude of the point.
 * @param {Object} gridParams - Parameters of the grid including origin and cell dimensions.
 * @param {Array} cells - Array of grid cells.
 * @returns {Object|null} The grid cell corresponding to the point or null if out of bounds.
 */
export const snapToGridCell = (lat, lng, gridParams, cells) => {
  const { origin, cellSize, rows, cols } = gridParams;

  const { adjustedRow, adjustedCol } = getAdjustedGridPosition(
    lat,
    lng,
    origin,
    cellSize,
  );

  if (
    adjustedRow >= 0 &&
    adjustedRow < rows &&
    adjustedCol >= 0 &&
    adjustedCol < cols
  ) {
    const cellId = `${adjustedRow}-${adjustedCol}`;
    return cells.find((cell) => cell.id === cellId) || null;
  }
  return null;
};

/**
 * Calculate row and column indices based on latitude and longitude.
 * @param {number} lat - Latitude of the point.
 * @param {number} lng - Longitude of the point.
 * @param {Object} origin - Origin of the grid.
 * @param {Object} cellSize - Size of each cell.
 * @returns {Object} Object containing adjusted row and column indices.
 */
const getAdjustedGridPosition = (lat, lng, origin, cellSize) => {
  const northSouthDistance = geolibGetDistance(
    { latitude: origin.latitude, longitude: origin.longitude },
    { latitude: lat, longitude: origin.longitude },
  );
  const eastWestDistance = geolibGetDistance(
    { latitude: origin.latitude, longitude: origin.longitude },
    { latitude: origin.latitude, longitude: lng },
  );

  const row = Math.floor(Math.abs(northSouthDistance) / cellSize.height);
  const col = Math.floor(Math.abs(eastWestDistance) / cellSize.width);

  const isSouth = lat < origin.latitude;
  const isEast = lng > origin.longitude;

  return {
    adjustedRow: isSouth ? row : -row,
    adjustedCol: isEast ? col : -col,
  };
};

/**
 * Check if a point is within the boundaries of a specific cell.
 * @param {Object} point - The point to check ({ latitude, longitude }).
 * @param {Object} cell - The grid cell to check against.
 * @returns {boolean} True if the point is within the cell, otherwise false.
 */
export const isPointWithinCell = (point, cell) => {
  const { latitude: lat, longitude: lng } = point;
  const { coordinates } = cell;
  return checkCoordinateWithinBounds(lat, lng, coordinates);
};

/**
 * Check if given latitude and longitude are within the boundary of a cell's coordinates.
 * @param {number} lat - Latitude to check.
 * @param {number} lng - Longitude to check.
 * @param {Array} coordinates - Array of cell corner coordinates.
 * @returns {boolean} True if within bounds, otherwise false.
 */
const checkCoordinateWithinBounds = (lat, lng, coordinates) => {
  const latMin = Math.min(coordinates[2].latitude, coordinates[3].latitude);
  const latMax = Math.max(coordinates[0].latitude, coordinates[1].latitude);
  const lngMin = Math.min(coordinates[0].longitude, coordinates[3].longitude);
  const lngMax = Math.max(coordinates[1].longitude, coordinates[2].longitude);

  return lat >= latMin && lat <= latMax && lng >= lngMin && lng <= lngMax;
};

/**
 * Calculate the distance between two points (latitude and longitude).
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

// ------------------------ Formatting and Encoding ------------------------

/**
 * Convert grid cell data to a format suitable for generating a part file.
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
      originalCoordinates: [cell.coordinates[0], cell.coordinates[2]],
    }));
};

/**
 * Encode a coordinate (latitude or longitude) into an integer format.
 * @param {number} coordinate - The coordinate to encode.
 * @returns {number} The encoded integer value.
 */
export const encodeCoordinate = (coordinate) => {
  const scalingFactor = 1e7; // Scaling factor for high precision
  return Math.round(coordinate * scalingFactor);
};

/**
 * Encode a target rate into the required format.
 * @param {number} rate - The target rate to encode.
 * @returns {number} The encoded target rate.
 */
export const encodeTargetRate = (rate) => {
  return Math.round(rate); // Adjust if scaling is needed
};
