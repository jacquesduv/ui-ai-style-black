// src/components/ControlForm.jsx
import React, { useState, useEffect } from "react";
import { useBlockContext } from "../context/BlockContext";
import { useGridContext } from "../context/GridContext";
import {
  notifySuccess,
  notifyError,
  notifyInfo,
  notifyWarn,
} from "../utils/ToastNotifications";

const ControlForm = () => {
  const {
    selectedBlock,
    setSelectedBlock,
    updateBlock,
    addBlock,
    deleteBlock,
  } = useBlockContext();

  const { selectedCell, updateCellStatus, setSelectedCell, clearCell } =
    useGridContext();

  const [formData, setFormData] = useState({
    lat: "",
    lng: "",
    targetRate: "",
  });

  // Load selected block or cell data into the form
  useEffect(() => {
    if (selectedBlock) {
      setFormData({
        lat: selectedBlock.lat.toFixed(5),
        lng: selectedBlock.lng.toFixed(5),
        targetRate: selectedBlock.targetRate,
      });
    } else if (selectedCell) {
      setFormData({
        lat: selectedCell.center.lat.toFixed(5),
        lng: selectedCell.center.lng.toFixed(5),
        targetRate: selectedCell.targetRate || "",
      });
    } else {
      setFormData({ lat: "", lng: "", targetRate: "" });
    }
  }, [selectedBlock, selectedCell]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Validate the target rate
  const isValidTargetRate = (rate) => {
    const parsedRate = parseInt(rate, 10);
    return !isNaN(parsedRate) && parsedRate > 0;
  };

  // Handle saving updates for block or cell
  const handleSave = () => {
    if (!isValidTargetRate(formData.targetRate)) {
      notifyError("Invalid target rate. Please enter a positive number.");
      return;
    }

    if (selectedBlock) {
      updateBlock({
        ...selectedBlock,
        targetRate: parseInt(formData.targetRate, 10),
      });
      notifySuccess("Block updated successfully!");
    } else if (selectedCell) {
      updateCellStatus(selectedCell.id, "applied");
      notifySuccess("Cell updated successfully!");
    }
  };

  // Handle adding a new block
  const handleAddBlock = () => {
    if (
      formData.lat &&
      formData.lng &&
      isValidTargetRate(formData.targetRate)
    ) {
      addBlock({
        lat: parseFloat(formData.lat),
        lng: parseFloat(formData.lng),
        targetRate: parseInt(formData.targetRate, 10),
      });
      notifySuccess("New block added!");
    } else {
      notifyError("Please fill in all fields with valid data.");
    }
  };

  // Handle deleting a block or clearing a cell
  const handleDelete = () => {
    if (selectedBlock) {
      if (window.confirm("Are you sure you want to delete this block?")) {
        deleteBlock(selectedBlock.id);
        setSelectedBlock(null);
        notifySuccess("Block deleted!");
      }
    } else if (selectedCell) {
      if (window.confirm("Are you sure you want to clear this cell?")) {
        clearCell(selectedCell.id);
        setSelectedCell(null);
        notifySuccess("Cell cleared!");
      }
    }
  };

  return (
    <div className="control-form p-3 border rounded">
      <h5>Control Panel</h5>
      <form>
        <div className="form-group">
          <label>Latitude</label>
          <input
            type="number"
            name="lat"
            value={formData.lat}
            onChange={handleChange}
            className="form-control"
            readOnly
          />
        </div>
        <div className="form-group">
          <label>Longitude</label>
          <input
            type="number"
            name="lng"
            value={formData.lng}
            onChange={handleChange}
            className="form-control"
            readOnly
          />
        </div>
        <div className="form-group">
          <label>Target Rate</label>
          <input
            type="number"
            name="targetRate"
            value={formData.targetRate}
            onChange={handleChange}
            className="form-control"
            placeholder="Enter target rate"
          />
        </div>
        <div className="mt-3">
          <button
            type="button"
            className="btn btn-primary mr-2"
            onClick={handleSave}
            disabled={!selectedBlock && !selectedCell}
          >
            Save
          </button>
          <button
            type="button"
            className="btn btn-success mr-2"
            onClick={handleAddBlock}
          >
            Add Block
          </button>
          <button
            type="button"
            className="btn btn-danger"
            onClick={handleDelete}
            disabled={!selectedBlock && !selectedCell}
          >
            Delete
          </button>
        </div>
      </form>
    </div>
  );
};

export default ControlForm;
