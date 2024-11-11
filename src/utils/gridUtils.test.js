import {
  generateGridCells,
  snapToGridCell,
  getCellCenterById,
  isPointWithinCell,
  getDistance,
  encodeCoordinate,
} from "./gridUtils";
import { computeDestinationPoint } from "geolib";

describe("gridUtils", () => {
  const center = { latitude: -27.945563, longitude: 25.661019 };
  const cellSize = { width: 100, height: 100 };
  const rows = 10;
  const cols = 10;

  describe("generateGridCells", () => {
    test("should generate grid cells with correct dimensions", () => {
      const { cells, gridParams } = generateGridCells(
        center,
        cellSize,
        rows,
        cols,
      );
      expect(cells.length).toBe(rows * cols);
      expect(gridParams.rows).toBe(rows);
      expect(gridParams.cols).toBe(cols);
    });

    test("should handle invalid dimensions gracefully", () => {
      const { cells, gridParams } = generateGridCells(
        center,
        { width: -1, height: -1 },
        rows,
        cols,
      );
      expect(cells.length).toBe(0);
      expect(gridParams).toBe(null);
    });
  });

  describe("snapToGridCell", () => {
    const gridParams = generateGridCells(
      center,
      cellSize,
      rows,
      cols,
    ).gridParams;
    const cells = generateGridCells(center, cellSize, rows, cols).cells;

    test("should snap to the correct cell within grid bounds", () => {
      const point = computeDestinationPoint(center, 150, 90); // Point 150m east of center
      const cell = snapToGridCell(
        point.latitude,
        point.longitude,
        gridParams,
        cells,
      );
      expect(cell).toBeDefined();
      expect(cell).toHaveProperty("id");
    });

    test("should return null if point is out of grid bounds", () => {
      const point = computeDestinationPoint(center, 5000, 90); // Point far out of grid bounds
      const cell = snapToGridCell(
        point.latitude,
        point.longitude,
        gridParams,
        cells,
      );
      expect(cell).toBeNull();
    });
  });

  describe("getCellCenterById", () => {
    const cells = generateGridCells(center, cellSize, rows, cols).cells;

    test("should return the center of the specified cell", () => {
      const center = getCellCenterById("1-1", cells);
      expect(center).toHaveProperty("latitude");
      expect(center).toHaveProperty("longitude");
    });

    test("should return null for a non-existent cell ID", () => {
      const center = getCellCenterById("invalid-id", cells);
      expect(center).toBeNull();
    });
  });

  describe("isPointWithinCell", () => {
    const cells = generateGridCells(center, cellSize, rows, cols).cells;

    test("should return true if point is within cell boundaries", () => {
      const point = cells[0].center; // Center of the first cell
      const isWithin = isPointWithinCell(point, cells[0]);
      expect(isWithin).toBe(true);
    });

    test("should return false if point is outside cell boundaries", () => {
      const point = { latitude: -50, longitude: 50 };
      const isWithin = isPointWithinCell(point, cells[0]);
      expect(isWithin).toBe(false);
    });
  });

  describe("getDistance", () => {
    test("should return the correct distance between two points", () => {
      const distance = getDistance(
        -27.945563,
        25.661019,
        -27.946563,
        25.662019,
      );
      expect(distance).toBeGreaterThan(0);
    });
  });

  describe("encodeCoordinate", () => {
    test("should encode a coordinate with the correct scaling factor", () => {
      const encoded = encodeCoordinate(-27.945563);
      expect(encoded).toBe(Math.round(-27.945563 * 1e7));
    });
  });
});
