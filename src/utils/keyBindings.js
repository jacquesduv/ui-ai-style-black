// src/utils/keyBindings.js
export const handleKeyDown = ({
  event,
  selectedCell,
  gridConfig,
  cells,
  setSelectedCell,
  deleteBlock,
  updateBlock,
}) => {
  if (!selectedCell) return;

  const [row, col] = selectedCell.id.split("-").map(Number);
  let newRow = row;
  let newCol = col;

  switch (event.key) {
    case "ArrowUp":
      newRow = Math.max(row - 1, 0);
      break;
    case "ArrowDown":
      newRow = Math.min(row + 1, gridConfig.rows - 1);
      break;
    case "ArrowLeft":
      newCol = Math.max(col - 1, 0);
      break;
    case "ArrowRight":
      newCol = Math.min(col + 1, gridConfig.cols - 1);
      break;
    case "Delete":
      deleteBlock(selectedCell.id);
      break;
    case "Enter":
      updateBlock({ ...selectedCell, targetRate: 2000 });
      break;
    default:
      return;
  }

  const newCellId = `${newRow}-${newCol}`;
  const newCell = cells.find((cell) => cell.id === newCellId);
  if (newCell) setSelectedCell(newCell);
};
