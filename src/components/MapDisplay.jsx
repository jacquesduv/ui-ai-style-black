// src/components/MapDisplay.jsx
import React, { useEffect, useState } from "react";
import {
  GoogleMap,
  Marker,
  InfoWindow,
  Polygon,
  useJsApiLoader,
} from "@react-google-maps/api";
import { useBlockContext } from "../context/BlockContext";
import { useGridContext } from "../context/GridContext";
import {
  notifySuccess,
  notifyError,
  notifyInfo,
} from "../utils/ToastNotifications";

const containerStyle = {
  width: "100%",
  height: "100%",
};

const defaultCenter = { lat: -27.945563, lng: 25.661019 };

const MapDisplay = () => {
  // Block context hooks
  const { blocks, addBlock, selectedBlock, setSelectedBlock } =
    useBlockContext();
  const {
    gridCells,
    selectCell,
    updateCellStatus,
    selectedCell,
    setSelectedCell,
  } = useGridContext();

  const [mapCenter, setMapCenter] = useState(defaultCenter);
  const [zoomLevel, setZoomLevel] = useState(10);

  // Add a state variable to hold the map instance
  const [map, setMap] = useState(null);

  // Load the Google Maps API with required libraries
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries: ["geometry", "drawing"], // Add required libraries
  });

  // Center the map based on blocks
  useEffect(() => {
    if (blocks.length > 0) {
      const avgLat =
        blocks.reduce((sum, block) => sum + block.lat, 0) / blocks.length;
      const avgLng =
        blocks.reduce((sum, block) => sum + block.lng, 0) / blocks.length;
      setMapCenter({ lat: avgLat, lng: avgLng });
      setZoomLevel(12);
    }
  }, [blocks]);

  // Handle map click for adding blocks
  const handleMapClick = (event) => {
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();

    selectCell(lat, lng);

    if (selectedCell) {
      const newBlock = {
        lat: selectedCell.center.lat,
        lng: selectedCell.center.lng,
        targetRate: 1000,
      };
      addBlock(newBlock);
      updateCellStatus(selectedCell.id, "selected");
      notifySuccess(`Block added to cell ${selectedCell.id}`);
    } else {
      notifyError("No grid cell found at clicked location.");
    }
  };

  // Handle cell selection
  const handleCellSelect = (cell) => {
    setSelectedCell(cell);
    updateCellStatus(cell.id, "selected");
    notifyInfo(`Cell ${cell.id} selected`);
  };

  // Handle applying actions to a cell
  const handleApplyAction = (cell) => {
    updateCellStatus(cell.id, "applied");
    notifySuccess(`Action applied to cell ${cell.id}`);
    setSelectedCell(null);
  };

  if (!isLoaded) {
    return <div>Loading Map...</div>;
  }

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={mapCenter}
      zoom={zoomLevel}
      onClick={handleMapClick}
      onLoad={(mapInstance) => setMap(mapInstance)} // Capture the map instance
    >
      {/* Render blocks as markers */}
      {blocks.map((block) => (
        <Marker
          key={block.id}
          position={{ lat: block.lat, lng: block.lng }}
          onClick={() => setSelectedBlock(block)}
        />
      ))}

      {/* InfoWindow for selected block */}
      {selectedBlock && (
        <InfoWindow
          position={{ lat: selectedBlock.lat, lng: selectedBlock.lng }}
          onCloseClick={() => setSelectedBlock(null)}
        >
          <div>
            <h6>Block Details</h6>
            <p>
              <strong>Target Rate:</strong> {selectedBlock.targetRate}
            </p>
            <p>
              <strong>Coordinates:</strong> ({selectedBlock.lat.toFixed(5)},{" "}
              {selectedBlock.lng.toFixed(5)})
            </p>
          </div>
        </InfoWindow>
      )}

      {/* Render grid cells as polygons only when the map instance is loaded */}
      {map &&
        gridCells.map((cell) => (
          <Polygon
            key={cell.id}
            path={cell.coordinates}
            options={{
              fillColor:
                cell.status === "selected"
                  ? "#00FF00"
                  : cell.status === "applied"
                    ? "#0000FF"
                    : "#FF0000",
              fillOpacity: 0.4,
              strokeColor: "#000000",
              strokeOpacity: 0.8,
              strokeWeight: 1,
            }}
            onClick={() => handleCellSelect(cell)}
          />
        ))}

      {/* InfoWindow for selected grid cell */}
      {selectedCell && (
        <InfoWindow
          position={selectedCell.center}
          onCloseClick={() => setSelectedCell(null)}
        >
          <div>
            <h6>Cell Details</h6>
            <p>
              <strong>ID:</strong> {selectedCell.id}
            </p>
            <p>
              <strong>Center:</strong> ({selectedCell.center.lat.toFixed(5)},{" "}
              {selectedCell.center.lng.toFixed(5)})
            </p>
            <button
              className="btn btn-primary mt-2"
              onClick={() => handleApplyAction(selectedCell)}
            >
              Apply Action
            </button>
          </div>
        </InfoWindow>
      )}
    </GoogleMap>
  );
};

export default MapDisplay;
