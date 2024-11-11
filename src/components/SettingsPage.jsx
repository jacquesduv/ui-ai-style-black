// src/components/SettingsPage.jsx
import React, { useState, useEffect, useReducer } from "react";
import { useGridBlockContext } from "../context/GridBlockContext";
import {
  notifySuccess,
  notifyWarn,
  notifyInfo,
  notifyError,
} from "../utils/ToastNotifications";
import "../styles/SettingsPage.css";

// Reducer function for managing form state
const settingsReducer = (state, action) => {
  switch (action.type) {
    case "SET_ROWS":
      return { ...state, rows: action.payload };
    case "SET_COLS":
      return { ...state, cols: action.payload };
    case "SET_CELL_WIDTH":
      return { ...state, cellWidth: action.payload };
    case "SET_CELL_HEIGHT":
      return { ...state, cellHeight: action.payload };
    case "SET_LATITUDE":
      return { ...state, latitude: action.payload };
    case "SET_LONGITUDE":
      return { ...state, longitude: action.payload };
    case "RESET":
      return action.payload;
    default:
      return state;
  }
};

const SettingsPage = () => {
  const {
    grid: {
      dimensions: gridDimensions,
      cellSize,
      center: gridCenter,
      generateGridCells,
    },
    settings: { setGridDimensions, setCellSize, setGridCenter },
  } = useGridBlockContext();

  const defaultSettings = {
    rows: 10,
    cols: 10,
    cellWidth: 100,
    cellHeight: 100,
    latitude: -27.945563,
    longitude: 25.661019,
  };

  const initialState = {
    rows: gridDimensions.rows,
    cols: gridDimensions.cols,
    cellWidth: cellSize.width,
    cellHeight: cellSize.height,
    latitude: gridCenter.latitude,
    longitude: gridCenter.longitude,
  };

  const [state, dispatch] = useReducer(settingsReducer, initialState);
  const [autoSave, setAutoSave] = useState(false);

  // Helper functions for validation
  const validateInput = (value) => value > 0;
  const validateLatitude = (lat) => lat >= -90 && lat <= 90;
  const validateLongitude = (lng) => lng >= -180 && lng <= 180;

  // Function to check if current settings match the default settings
  const areSettingsDefault = () => {
    return (
      state.rows === defaultSettings.rows &&
      state.cols === defaultSettings.cols &&
      state.cellWidth === defaultSettings.cellWidth &&
      state.cellHeight === defaultSettings.cellHeight &&
      state.latitude === defaultSettings.latitude &&
      state.longitude === defaultSettings.longitude
    );
  };

  // Save settings handler
  const handleSaveSettings = () => {
    if (
      !validateInput(state.rows) ||
      !validateInput(state.cols) ||
      !validateInput(state.cellWidth) ||
      !validateInput(state.cellHeight) ||
      !validateLatitude(state.latitude) ||
      !validateLongitude(state.longitude)
    ) {
      notifyError("Please enter valid values for all fields.");
      return;
    }

    setGridDimensions({ rows: state.rows, cols: state.cols });
    setCellSize({ width: state.cellWidth, height: state.cellHeight });
    setGridCenter({ latitude: state.latitude, longitude: state.longitude });

    generateGridCells();
    notifySuccess("Grid settings updated successfully!");
  };

  // Reset settings handler with additional check
  const handleResetSettings = () => {
    if (areSettingsDefault()) {
      notifyInfo("Settings are already set to default.");
      return;
    }

    if (window.confirm("Are you sure you want to reset to default settings?")) {
      dispatch({ type: "RESET", payload: defaultSettings });
      setGridDimensions({
        rows: defaultSettings.rows,
        cols: defaultSettings.cols,
      });
      setCellSize({
        width: defaultSettings.cellWidth,
        height: defaultSettings.cellHeight,
      });
      setGridCenter({
        latitude: defaultSettings.latitude,
        longitude: defaultSettings.longitude,
      });
      generateGridCells();
      notifySuccess("Settings reset to default values.");
    }
  };

  // Auto-save functionality with debounce effect
  useEffect(() => {
    if (autoSave) {
      const timeoutId = setTimeout(handleSaveSettings, 500);
      return () => clearTimeout(timeoutId);
    }
  }, [state, autoSave]);

  return (
    <div className="settings-page">
      <h2>Grid Settings</h2>
      <div className="settings-form">
        <div className="form-group">
          <label>Rows:</label>
          <input
            type="number"
            value={state.rows}
            onChange={(e) =>
              dispatch({ type: "SET_ROWS", payload: parseInt(e.target.value) })
            }
            className={validateInput(state.rows) ? "" : "invalid-input"}
          />
        </div>
        <div className="form-group">
          <label>Columns:</label>
          <input
            type="number"
            value={state.cols}
            onChange={(e) =>
              dispatch({ type: "SET_COLS", payload: parseInt(e.target.value) })
            }
            className={validateInput(state.cols) ? "" : "invalid-input"}
          />
        </div>
        <div className="form-group">
          <label>Cell Width (meters):</label>
          <input
            type="number"
            value={state.cellWidth}
            onChange={(e) =>
              dispatch({
                type: "SET_CELL_WIDTH",
                payload: parseFloat(e.target.value),
              })
            }
            className={validateInput(state.cellWidth) ? "" : "invalid-input"}
          />
        </div>
        <div className="form-group">
          <label>Cell Height (meters):</label>
          <input
            type="number"
            value={state.cellHeight}
            onChange={(e) =>
              dispatch({
                type: "SET_CELL_HEIGHT",
                payload: parseFloat(e.target.value),
              })
            }
            className={validateInput(state.cellHeight) ? "" : "invalid-input"}
          />
        </div>
        <div className="form-group">
          <label>Grid Center Latitude:</label>
          <input
            type="number"
            value={state.latitude}
            onChange={(e) =>
              dispatch({
                type: "SET_LATITUDE",
                payload: parseFloat(e.target.value),
              })
            }
            className={validateLatitude(state.latitude) ? "" : "invalid-input"}
          />
        </div>
        <div className="form-group">
          <label>Grid Center Longitude:</label>
          <input
            type="number"
            value={state.longitude}
            onChange={(e) =>
              dispatch({
                type: "SET_LONGITUDE",
                payload: parseFloat(e.target.value),
              })
            }
            className={
              validateLongitude(state.longitude) ? "" : "invalid-input"
            }
          />
        </div>
        <div className="form-group checkbox">
          <label>Auto-Save:</label>
          <input
            type="checkbox"
            checked={autoSave}
            onChange={(e) => setAutoSave(e.target.checked)}
          />
        </div>
        <div className="button-group">
          <button onClick={handleSaveSettings} className="save-button">
            Save Settings
          </button>
          <button onClick={handleResetSettings} className="reset-button">
            Reset to Default
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
