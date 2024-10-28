// src/components/MapDisplay.jsx
import React, { useEffect, useState } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';

// Default styling for the map container
const containerStyle = {
    width: '100%',
    height: '400px'
};

// Default center if no blocks are provided
const defaultCenter = { lat: -27.945563, lng: 25.661019 };

const MapDisplay = ({ blocks, onAddBlock }) => {
    // Local state to handle the map center and zoom level
    const [mapCenter, setMapCenter] = useState(defaultCenter);
    const [zoomLevel, setZoomLevel] = useState(10);
    const [selectedBlock, setSelectedBlock] = useState(null); // New state for selected block

    useEffect(() => {
        if (blocks.length > 0) {
            // Calculate the center of all markers if blocks are available
            const latitudes = blocks.map(block => block.lat);
            const longitudes = blocks.map(block => block.lng);

            const avgLat = latitudes.reduce((sum, lat) => sum + lat, 0) / latitudes.length;
            const avgLng = longitudes.reduce((sum, lng) => sum + lng, 0) / longitudes.length;

            setMapCenter({ lat: avgLat, lng: avgLng });
            setZoomLevel(12); // Adjust zoom level as needed
        }
    }, [blocks]); // Recalculate when blocks change

    const handleMapClick = (event) => {
        const lat = event.latLng.lat();
        const lng = event.latLng.lng();
        onAddBlock({ lat, lng, targetRate: 3000 }); // Default target rate or prompt user for input
    };

    return (
        <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}>
            <GoogleMap mapContainerStyle={containerStyle} center={mapCenter} zoom={zoomLevel}
                onClick={handleMapClick} >
                {blocks.map((block, index) => (
                    <Marker
                        key={index}
                        position={{ lat: block.lat, lng: block.lng }}
                        onClick={() => setSelectedBlock(block)} // Set the selected block when clicked
                    />
                ))}
                {/* Display InfoWindow when a block is selected */}
                {selectedBlock && (
                    <InfoWindow
                        position={{ lat: selectedBlock.lat, lng: selectedBlock.lng }}
                        onCloseClick={() => setSelectedBlock(null)} // Close InfoWindow when clicked
                    >
                        <div>
                            <h6>Block Details</h6>
                            <p><strong>Target Rate:</strong> {selectedBlock.targetRate}</p>
                            <p><strong>Coordinates:</strong> ({selectedBlock.lat.toFixed(5)}, {selectedBlock.lng.toFixed(5)})</p>
                        </div>
                    </InfoWindow>
                )}
            </GoogleMap>
        </LoadScript>
    );
};

export default MapDisplay;

