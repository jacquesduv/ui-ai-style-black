// src/components/MapEditor.jsx
import React, { useState } from "react";
import { useBlockContext } from "../context/BlockContext";
import { useGridContext } from "../context/GridContext";
import { downloadJSON, uploadJSON } from "../utils/fileUtils";
import {
  notifySuccess,
  notifyError,
  notifyInfo,
  notifyWarn,
} from "../utils/ToastNotifications";
import MapDisplay from "./MapDisplay";
import ControlForm from "./ControlForm";
import BlockManager from "./BlockManager";
import GridOverlay from "./GridOverlay";
import { Container, Row, Col, Button, Form } from "react-bootstrap";

const MapEditor = () => {
  const { blocks, addBlock, clearBlocks, selectedBlock, setSelectedBlock } =
    useBlockContext();

  const {
    generateGridCells,
    setGridCenter,
    setCellSize,
    setGridDimensions,
    rows,
    cols,
    cellSize,
    clearGrid,
    setSelectedCell,
    gridCells,
  } = useGridContext();

  const [isGridVisible, setIsGridVisible] = useState(true);

  // Handle downloading blocks as JSON
  const handleDownloadBlocks = () => {
    if (blocks.length > 0) {
      downloadJSON(blocks, "blocks.json");
      notifySuccess("Blocks downloaded successfully!");
    } else {
      notifyWarn("No blocks to download.");
    }
  };

  // Handle uploading blocks from a JSON file
  const handleUploadBlocks = (event) => {
    uploadJSON(event, (uploadedBlocks) => {
      if (uploadedBlocks && uploadedBlocks.length > 0) {
        uploadedBlocks.forEach((block) => addBlock(block));
        notifySuccess("Blocks uploaded successfully!");
      } else {
        notifyError("Failed to upload blocks.");
      }
    });
  };

  // Handle clearing all blocks and grid
  const handleClearAll = () => {
    if (
      window.confirm("Are you sure you want to clear all blocks and the grid?")
    ) {
      clearBlocks();
      clearGrid();
      setSelectedCell(null);
      setSelectedBlock(null);
      notifyInfo("All blocks and grid cleared.");
    }
  };

  // Handle grid update with validation
  const handleGridUpdate = (e) => {
    e.preventDefault();
    const newRows = parseInt(e.target.rows.value, 10);
    const newCols = parseInt(e.target.cols.value, 10);
    const newLatOffset = parseFloat(e.target.latOffset.value);
    const newLngOffset = parseFloat(e.target.lngOffset.value);

    if (newRows > 0 && newCols > 0 && newLatOffset > 0 && newLngOffset > 0) {
      setGridDimensions({ rows: newRows, cols: newCols });
      setCellSize({ latOffset: newLatOffset, lngOffset: newLngOffset });
      generateGridCells();
      notifySuccess("Grid updated successfully!");
    } else {
      notifyError("Invalid grid parameters. Please enter positive values.");
    }
  };

  return (
    <Container fluid className="mt-3">
      {/* Map and Grid Section */}
      <Row className="mb-3">
        <Col style={{ height: "60vh", position: "relative" }}>
          <MapDisplay />
          {isGridVisible && <GridOverlay />}
        </Col>
      </Row>

      {/* Control Panel */}
      <Row>
        <Col md={4}>
          <ControlForm />
          <div className="mt-3">
            <Button
              variant="success"
              className="mr-2"
              onClick={handleDownloadBlocks}
            >
              Download Blocks
            </Button>
            <label className="btn btn-secondary">
              Upload Blocks
              <input
                type="file"
                onChange={handleUploadBlocks}
                style={{ display: "none" }}
              />
            </label>
            <Button variant="danger" className="ml-2" onClick={handleClearAll}>
              Clear All Blocks & Grid
            </Button>
          </div>
        </Col>

        {/* Block Manager */}
        <Col md={8}>
          <BlockManager />
        </Col>
      </Row>

      {/* Grid Settings */}
      <Row className="mt-3">
        <Col md={6}>
          <Form onSubmit={handleGridUpdate}>
            <Form.Group>
              <Form.Label>Rows</Form.Label>
              <Form.Control
                type="number"
                name="rows"
                defaultValue={rows}
                min={1}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Columns</Form.Label>
              <Form.Control
                type="number"
                name="cols"
                defaultValue={cols}
                min={1}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Latitude Offset</Form.Label>
              <Form.Control
                type="number"
                name="latOffset"
                step="0.0001"
                defaultValue={cellSize.latOffset}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Longitude Offset</Form.Label>
              <Form.Control
                type="number"
                name="lngOffset"
                step="0.0001"
                defaultValue={cellSize.lngOffset}
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              Update Grid
            </Button>
          </Form>
        </Col>
      </Row>

      {/* Footer Section */}
      <Row className="mt-3">
        <Col className="d-flex justify-content-between align-items-center">
          <Button
            variant="info"
            onClick={() => setIsGridVisible(!isGridVisible)}
          >
            {isGridVisible ? "Hide Grid" : "Show Grid"}
          </Button>
          <span>
            <strong>Block Count:</strong> {blocks.length}
          </span>
        </Col>
      </Row>
    </Container>
  );
};

export default MapEditor;
