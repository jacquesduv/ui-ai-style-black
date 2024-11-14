// src/components/HelpPage.jsx
import React from "react";
import { Accordion, Card, Button } from "react-bootstrap";
import { notifyInfo } from "../utils/ToastNotifications";
import "../styles/HelpPage.css";

const HelpPage = () => {
  // Function to handle quick notifications
  const handleFeedback = (message) => {
    notifyInfo(message);
  };

  return (
    <div className="help-page container mt-4">
      <h2>Help & Documentation</h2>
      <Accordion defaultActiveKey="0" className="help-accordion">
        {/* Section 1: Introduction */}
        <Accordion.Item eventKey="0">
          <Accordion.Header>
            Introduction to the Farming Map Editor
          </Accordion.Header>
          <Accordion.Body>
            <p>
              Welcome to the Farming Map Editor! This tool allows you to map out
              areas for precise application of seeds, fertilizers, or other
              farming resources. You can easily create, edit, and manage blocks
              on a grid overlay and export them as part files for use in your
              farming equipment.
            </p>
          </Accordion.Body>
        </Accordion.Item>

        {/* Section 2: Creating and Managing Blocks */}
        <Accordion.Item eventKey="1">
          <Accordion.Header>How to Create and Manage Blocks</Accordion.Header>
          <Accordion.Body>
            <ul>
              <li>
                <strong>Adding a Block:</strong> Click on the map to select a
                grid cell, then use the control form to enter the target rate
                and save the block.
              </li>
              <li>
                <strong>Editing a Block:</strong> Click on an existing block in
                the list or directly on the map to edit its details.
              </li>
              <li>
                <strong>Deleting a Block:</strong> Select a block from the list
                and click the "Delete" button.
              </li>
              <li>
                <strong>Saving Blocks:</strong> Click the "Save" button to store
                your current configuration. You can also generate a .prt file
                using the "Generate Part File" button.
              </li>
            </ul>
            <Button
              variant="info"
              onClick={() => handleFeedback("Explore the map to get started!")}
            >
              Try it now!
            </Button>
          </Accordion.Body>
        </Accordion.Item>

        {/* Section 3: Settings and Customization */}
        <Accordion.Item eventKey="2">
          <Accordion.Header>Settings and Customization</Accordion.Header>
          <Accordion.Body>
            <p>
              The settings page allows you to adjust grid dimensions, cell
              sizes, and the central coordinates of the grid. Here's how you can
              use it:
            </p>
            <ol>
              <li>Navigate to the Settings page using the top menu.</li>
              <li>
                Adjust the number of rows, columns, and cell sizes as needed.
              </li>
              <li>Click "Save" to apply the changes.</li>
              <li>Use the "Reset" button to revert to default settings.</li>
            </ol>
          </Accordion.Body>
        </Accordion.Item>

        {/* Section 4: Keyboard Shortcuts */}
        <Accordion.Item eventKey="3">
          <Accordion.Header>Keyboard Shortcuts</Accordion.Header>
          <Accordion.Body>
            <ul>
              <li>
                <strong>Ctrl + S:</strong> Save current blocks
              </li>
              <li>
                <strong>Ctrl + Z:</strong> Undo last action
              </li>
              <li>
                <strong>Ctrl + Y:</strong> Redo last action
              </li>
              <li>
                <strong>Arrow Keys:</strong> Navigate between cells
              </li>
            </ul>
          </Accordion.Body>
        </Accordion.Item>

        {/* Section 5: Frequently Asked Questions (FAQ) */}
        <Accordion.Item eventKey="4">
          <Accordion.Header>Frequently Asked Questions</Accordion.Header>
          <Accordion.Body>
            <p>
              <strong>Q:</strong> Can I change the target rate after adding a
              block?
            </p>
            <p>
              <strong>A:</strong> Yes, simply select the block and update its
              details using the control form.
            </p>
            <hr />
            <p>
              <strong>Q:</strong> How do I export the grid as a part file?
            </p>
            <p>
              <strong>A:</strong> Click on the "Generate Part File" button on
              the home page after configuring your blocks.
            </p>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </div>
  );
};

export default HelpPage;
