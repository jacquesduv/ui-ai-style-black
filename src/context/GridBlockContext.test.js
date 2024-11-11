import React from "react";
import { render, act, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { GridBlockProvider, useGridBlockContext } from "./GridBlockContext";

// Custom component to access context values
const ContextTestComponent = ({ action }) => {
  const context = useGridBlockContext();
  action && action(context);
  return <div>Context Test</div>;
};

describe("GridBlockContext", () => {
  const renderWithContext = (action) =>
    render(
      <GridBlockProvider>
        <ContextTestComponent action={action} />
      </GridBlockProvider>,
    );

  describe("Grid Generation and Storage", () => {
    test("loads grid settings from localStorage on initialization", () => {
      localStorage.setItem(
        "gridSettings",
        JSON.stringify({
          gridCenter: { latitude: -27.945563, longitude: 25.661019 },
          cellSize: { width: 100, height: 100 },
          gridDimensions: { rows: 10, cols: 10 },
        }),
      );

      renderWithContext(({ grid }) => {
        expect(grid.center).toEqual({
          latitude: -27.945563,
          longitude: 25.661019,
        });
        expect(grid.cellSize).toEqual({ width: 100, height: 100 });
        expect(grid.dimensions).toEqual({ rows: 10, cols: 10 });
      });
    });

    test("saves grid settings to localStorage when updated", () => {
      renderWithContext(({ settings }) => {
        act(() => {
          settings.setGridCenter({ latitude: 0, longitude: 0 });
          settings.setCellSize({ width: 200, height: 200 });
          settings.setGridDimensions({ rows: 5, cols: 5 });
        });

        const savedSettings = JSON.parse(localStorage.getItem("gridSettings"));
        expect(savedSettings.gridCenter).toEqual({ latitude: 0, longitude: 0 });
        expect(savedSettings.cellSize).toEqual({ width: 200, height: 200 });
        expect(savedSettings.gridDimensions).toEqual({ rows: 5, cols: 5 });
      });
    });
  });

  describe("Block Operations", () => {
    beforeEach(() => {
      localStorage.clear();
    });

    test("adds a new block and updates grid cell status", () => {
      renderWithContext(({ blocks, addBlock, grid }) => {
        act(() => {
          addBlock({ lat: -27.945563, lng: 25.661019, targetRate: 5 });
        });

        expect(blocks.items.length).toBe(1);
        const block = blocks.items[0];
        expect(block.targetRate).toBe(5);
        expect(grid.cells.find((cell) => cell.id === block.id).status).toBe(
          "selected",
        );
      });
    });

    test("updates an existing block in blocks and grid cells", () => {
      renderWithContext(({ blocks, addBlock, updateBlock, grid }) => {
        act(() => {
          addBlock({ lat: -27.945563, lng: 25.661019, targetRate: 5 });
          updateBlock({ id: blocks.items[0].id, targetRate: 10 });
        });

        expect(blocks.items[0].targetRate).toBe(10);
        const cell = grid.cells.find((cell) => cell.id === blocks.items[0].id);
        expect(cell.targetRate).toBe(10);
      });
    });

    test("deletes a block and resets the corresponding grid cell", () => {
      renderWithContext(({ blocks, addBlock, deleteBlock, grid }) => {
        act(() => {
          addBlock({ lat: -27.945563, lng: 25.661019, targetRate: 5 });
          deleteBlock(blocks.items[0].id);
        });

        expect(blocks.items.length).toBe(0);
        const cell = grid.cells.find((cell) => cell.id === "0-0"); // Assuming first cell ID is '0-0'
        expect(cell.status).toBe("unselected");
        expect(cell.targetRate).toBeNull();
      });
    });

    test("clears all blocks and resets grid cells", () => {
      renderWithContext(({ blocks, addBlock, clearBlocks, grid }) => {
        act(() => {
          addBlock({ lat: -27.945563, lng: 25.661019, targetRate: 5 });
          clearBlocks();
        });

        expect(blocks.items.length).toBe(0);
        grid.cells.forEach((cell) => {
          expect(cell.status).toBe("unselected");
          expect(cell.targetRate).toBeNull();
        });
      });
    });
  });

  describe("Grid Cell Selection", () => {
    test("selects a cell based on lat/lng", () => {
      renderWithContext(({ selectCell, grid }) => {
        act(() => {
          selectCell(-27.945563, 25.661019);
        });

        expect(grid.selectedCell).toBeDefined();
        expect(grid.selectedCell).toHaveProperty("id");
      });
    });

    test("toggles cell selection for multi-selection", () => {
      renderWithContext(({ toggleSelectCell, grid }) => {
        const cell = { id: "1-1" }; // Mock cell
        act(() => {
          toggleSelectCell(cell);
          toggleSelectCell(cell);
        });

        expect(grid.selectedCells.length).toBe(0); // Toggled twice, should be deselected
      });
    });
  });
});
