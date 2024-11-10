// src/pages/HelpPage.jsx
import React from "react";
import { Container } from "react-bootstrap";

const HelpPage = () => {
  return (
    <Container className="mt-4">
      <h2>Help & Documentation</h2>
      <p>
        Welcome to the Part File Editor Application! This tool is designed to
        help you manage block-based data for precision agriculture.
      </p>

      <h4>🔄 Getting Started:</h4>
      <ul>
        <li>
          <strong>Map Navigation:</strong> Use your mouse to pan around the map
          and scroll to zoom in and out.
        </li>
        <li>
          <strong>Block Placement:</strong> Click on the map to create blocks
          snapped to the nearest grid cell.
        </li>
      </ul>

      <h4>📋 Key Functionalities:</h4>
      <ul>
        <li>
          <strong>Adding Blocks:</strong> Click on the map to add a block
          aligned with the grid. Each block is associated with specific
          coordinates and a target rate.
        </li>
        <li>
          <strong>Editing Blocks:</strong> Select a block using the Block
          Manager or by clicking on a marker on the map. Use the control panel
          to modify the target rate or other attributes.
        </li>
        <li>
          <strong>Deleting Blocks:</strong> Use the Block Manager to delete
          individual blocks or clear all blocks using the provided button.
        </li>
        <li>
          <strong>Downloading Blocks:</strong> Click the "Download Blocks"
          button to save all blocks as a JSON file for backup or offline use.
        </li>
        <li>
          <strong>Uploading Blocks:</strong> Restore blocks from a previously
          saved JSON file by clicking the "Upload Blocks" button.
        </li>
        <li>
          <strong>Generating Part Files:</strong> Once all blocks are set, click
          on the "Generate Part File" button to generate a `.prt` file with your
          configurations.
        </li>
      </ul>

      <h4>🔧 Grid Configuration:</h4>
      <p>
        Use the <strong>Settings Page</strong> to adjust the grid dimensions,
        cell size, and offsets. This can help achieve better alignment based on
        your field's layout.
      </p>

      <h4>⚡ Keyboard Shortcuts:</h4>
      <ul>
        <li>
          <strong>Arrow Keys:</strong> Navigate between cells on the grid.
        </li>
        <li>
          <strong>Ctrl + Z:</strong> Undo the last action.
        </li>
        <li>
          <strong>Ctrl + Y:</strong> Redo the last undone action.
        </li>
        <li>
          <strong>Ctrl + S:</strong> Save blocks as a JSON file.
        </li>
      </ul>

      <h4>❓ FAQs:</h4>
      <ul>
        <li>
          <strong>How do I reset the grid?</strong> Go to the{" "}
          <em>Settings Page</em> and update the grid parameters to regenerate
          the grid.
        </li>
        <li>
          <strong>Can I edit a block after adding it?</strong> Yes, select the
          block on the map or from the Block Manager, and modify its properties
          in the control form.
        </li>
        <li>
          <strong>Why can't I see my uploaded blocks?</strong> Make sure the
          JSON file format is correct. Only properly formatted files will be
          accepted.
        </li>
        <li>
          <strong>
            What happens if I generate a part file without any blocks?
          </strong>{" "}
          The application will notify you that there are no blocks available for
          the part file.
        </li>
        <li>
          <strong>How do I clear all blocks?</strong> Use the "Clear All Blocks"
          button in the control panel or Block Manager.
        </li>
      </ul>

      <h4>💡 Tips & Tricks:</h4>
      <ul>
        <li>For better precision, zoom in to place blocks more accurately.</li>
        <li>
          Use the "Show Grid" option to visualize the cells and ensure blocks
          are aligned correctly.
        </li>
        <li>
          Adjust the cell size and grid dimensions in the settings to match the
          scale of your field.
        </li>
      </ul>
    </Container>
  );
};

export default HelpPage;
