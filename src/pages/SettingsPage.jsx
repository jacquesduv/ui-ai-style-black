// src/pages/SettingsPage.jsx
import React, { useState } from "react";
import { Container, Form, Button } from "react-bootstrap";
import { useGridContext } from "../context/GridContext";
import { notifySuccess, notifyError } from "../utils/ToastNotifications";

const SettingsPage = () => {
  const {
    rows,
    cols,
    cellSize,
    setGridDimensions,
    setCellSize,
    generateGridCells,
  } = useGridContext();

  const [formValues, setFormValues] = useState({
    rows: rows,
    cols: cols,
    latOffset: cellSize.latOffset,
    lngOffset: cellSize.lngOffset,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handleSaveSettings = (e) => {
    e.preventDefault();
    const { rows, cols, latOffset, lngOffset } = formValues;

    if (rows > 0 && cols > 0 && latOffset > 0 && lngOffset > 0) {
      setGridDimensions({ rows: parseInt(rows), cols: parseInt(cols) });
      setCellSize({
        latOffset: parseFloat(latOffset),
        lngOffset: parseFloat(lngOffset),
      });
      generateGridCells();
      notifySuccess("Grid settings updated successfully!");
    } else {
      notifyError("Please enter valid grid settings.");
    }
  };

  return (
    <Container className="mt-4">
      <h2>Grid Settings</h2>
      <Form onSubmit={handleSaveSettings}>
        <Form.Group>
          <Form.Label>Rows</Form.Label>
          <Form.Control
            type="number"
            name="rows"
            value={formValues.rows}
            onChange={handleChange}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Columns</Form.Label>
          <Form.Control
            type="number"
            name="cols"
            value={formValues.cols}
            onChange={handleChange}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Latitude Offset</Form.Label>
          <Form.Control
            type="number"
            name="latOffset"
            step="0.0001"
            value={formValues.latOffset}
            onChange={handleChange}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Longitude Offset</Form.Label>
          <Form.Control
            type="number"
            name="lngOffset"
            step="0.0001"
            value={formValues.lngOffset}
            onChange={handleChange}
          />
        </Form.Group>
        <Button type="submit" variant="primary">
          Save Settings
        </Button>
      </Form>
    </Container>
  );
};

export default SettingsPage;
