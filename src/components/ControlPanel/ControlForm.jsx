// src/components/ControlForm.jsx
import React, { useState, useEffect } from "react";
import { useGridBlockContext } from "../context/GridBlockContext";
import {
  notifySuccess,
  notifyError,
  notifyWarn,
} from "../utils/ToastNotifications";
import "../styles/ControlPanel.css";

const ControlForm = () => {
  const {
    addBlock,
    updateBlock,
    deleteBlock,
    selectedBlock,
    setSelectedBlock,
  } = useGridBlockContext();

  const [formState, setFormState] = useState({
    lat: "",
    lng: "",
    targetRate: "",
  });

  useEffect(() => {
    if (selectedBlock) {
      setFormState({
        lat: selectedBlock.coordinates[0].latitude.toFixed(6),
        lng: selectedBlock.coordinates[0].longitude.toFixed(6),
        targetRate: selectedBlock.targetRate,
      });
    } else {
      setFormState({ lat: "", lng: "", targetRate: "" });
    }
  }, [selectedBlock]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleAddBlock = () => {
    const { lat, lng, targetRate } = formState;
    if (!lat || !lng || !targetRate)
      return notifyWarn("All fields are required.");

    addBlock({
      lat: parseFloat(lat),
      lng: parseFloat(lng),
      targetRate: parseInt(targetRate, 10),
    });

    setFormState({ lat: "", lng: "", targetRate: "" });
  };

  const handleUpdateBlock = () => {
    if (!selectedBlock) return notifyError("No block selected for update.");

    const { lat, lng, targetRate } = formState;
    if (!lat || !lng || !targetRate)
      return notifyWarn("All fields are required.");

    updateBlock({
      id: selectedBlock.id,
      coordinates: [{ latitude: parseFloat(lat), longitude: parseFloat(lng) }],
      targetRate: parseInt(targetRate, 10),
    });

    setSelectedBlock(null);
  };

  const handleDeleteBlock = () => {
    if (!selectedBlock) return notifyError("No block selected for deletion.");
    deleteBlock(selectedBlock.id);
    setSelectedBlock(null);
  };

  return (
    <div className="control-form">
      <h3>Control Form</h3>
      <div className="input-group">
        <label>Latitude:</label>
        <input
          type="text"
          name="lat"
          value={formState.lat}
          onChange={handleChange}
        />
      </div>
      <div className="input-group">
        <label>Longitude:</label>
        <input
          type="text"
          name="lng"
          value={formState.lng}
          onChange={handleChange}
        />
      </div>
      <div className="input-group">
        <label>Target Rate:</label>
        <input
          type="number"
          name="targetRate"
          value={formState.targetRate}
          onChange={handleChange}
        />
      </div>
      <div className="button-group">
        <button onClick={handleAddBlock}>Add Block</button>
        <button onClick={handleUpdateBlock} disabled={!selectedBlock}>
          Update Block
        </button>
        <button onClick={handleDeleteBlock} disabled={!selectedBlock}>
          Delete Block
        </button>
      </div>
    </div>
  );
};

export default ControlForm;
