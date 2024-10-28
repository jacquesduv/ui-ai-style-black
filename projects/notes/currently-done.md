# Project Overview: ui-ai-style-black

## Introduction

The **ui-ai-style-black** is a React application designed to visualize blocks on a map using Google Maps API. It includes interactive components that allow users to add, view, and manage blocks dynamically. This document outlines the current components, their functionalities, and features.

---

## Current Components and Their Functionalities

### 1. **App Component (`App.js`)** (currently)

- **Purpose**: Main entry point of the application. It manages the state and layout.
- **Functionalities**:
  - Maintains a state array of blocks, each containing `lat`, `lng`, and `targetRate`.
  - Passes the `blocks` state and the `onAddBlock` function to child components.

### 2. **Navbar Component (`Navbar.jsx`)**

- **Purpose**: Provides navigation links for the application.
- **Functionalities**:
  - Displays links for "Home," "Settings," and "Help" using `react-bootstrap`. (pages to be done)

### 3. **MapDisplay Component (`MapDisplay.jsx`)** (implementing)

- **Purpose**: Renders the Google Map and visualizes blocks using markers.
- **Functionalities**:
  - Displays markers based on the coordinates stored in the `blocks` state.
  - Centers and adjusts the zoom level of the map dynamically based on block positions.
  - **Dynamic Interactivity**:
    - Clicking a marker displays an `InfoWindow` with block details (lat, lng, target rate).
    - Clicking on the map allows users to add new blocks by capturing the coordinates of the click.

### 4. **ControlForm Component (`ControlForm.jsx`)** (to be implemented)

- **Purpose**: Provides an interface for users to add or update block information.
- **Functionalities**:
  - Inputs for `X` and `Y coordinates` and `Target Rate`.
  - Action buttons to submit new block data or update existing blocks.
  - Implement form submission to add new blocks and update existing ones based on user inputs.

### 5. **BlockManager Component (`BlockManager.jsx`)** (to be implemented)

- **Purpose**: Displays a list of all blocks managed in the application.
- **Functionalities**:
  - Lists block details including coordinates and target rates.
  - Provides options to edit or delete blocks.
