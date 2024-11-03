// src/components/MapDisplay.jsx
import React, { useEffect, useState } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';

const containerStyle = {
    width: '100%',
    height: '400px'
};

const defaultCenter = { lat: -27.945563, lng: 25.661019 };

const MapDisplay = ({ blocks, onAddBlock, onSelectBlock }) => {
    const [mapCenter, setMapCenter] = useState(defaultCenter);
    const [zoomLevel, setZoomLevel] = useState(10);
    const [selectedBlock, setSelectedBlock] = useState(null);

    useEffect(() => {
        if (blocks.length > 0) {
            const latitudes = blocks.map(block => block.lat);
            const longitudes = blocks.map(block => block.lng);
            const avgLat = latitudes.reduce((sum, lat) => sum + lat, 0) / latitudes.length;
            const avgLng = longitudes.reduce((sum, lng) => sum + lng, 0) / longitudes.length;
            setMapCenter({ lat: avgLat, lng: avgLng });
            setZoomLevel(12);
        }
    }, [blocks]);

    const handleMapClick = (event) => {
        const lat = event.latLng.lat();
        const lng = event.latLng.lng();
        onAddBlock({ lat, lng, targetRate: 1000 });
    };

    return (
        <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}>
            <GoogleMap mapContainerStyle={containerStyle} center={mapCenter} zoom={zoomLevel} onClick={handleMapClick}>
                {blocks.map((block) => (
                    <Marker
                        key={block.id}
                        position={{ lat: block.lat, lng: block.lng }}
                        onClick={() => {
                            setSelectedBlock(block);
                            onSelectBlock(block); // Trigger edit mode in ControlForm
                        }}
                    />
                ))}

                {selectedBlock && (
                    <InfoWindow position={{ lat: selectedBlock.lat, lng: selectedBlock.lng }} onCloseClick={() => setSelectedBlock(null)}>
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

