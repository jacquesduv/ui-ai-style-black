// src/components/MapEditor.jsx
import React, { useState } from "react";
import { useBlockContext } from "../context/BlockContext";
import { downloadJSON, uploadJSON } from "../utils/fileUtils";
import MapDisplay from "./MapDisplay";
import ControlForm from "./ControlForm";
import BlockManager from "./BlockManager";

const MapEditor = () => {
    const {
        blocks,               // Ensure blocks is correctly obtained from context
        addBlock,
        updateBlock,
        deleteBlock,
        clearBlocks,
        selectedBlock,
        setSelectedBlock
    } = useBlockContext();

    const [defaultLocation, setDefaultLocation] = useState({
        lat: -27.945563,
        lng: 25.661019,
        zoom: 10,
    });

    const handleLocationChange = (e) => {
        const { name, value } = e.target;
        setDefaultLocation((prevLocation) => ({
            ...prevLocation,
            [name]: name === "zoom" ? parseInt(value, 10) : parseFloat(value),
        }));
    };

    return (
        <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", flexDirection: "column", flex: 1, overflow: "hidden" }}>
                <div style={{ flex: 1, overflow: "hidden" }}>
                    <MapDisplay
                        blocks={blocks}
                        onAddBlock={addBlock}
                        onSelectBlock={setSelectedBlock}
                        center={defaultLocation}
                    />
                </div>
                <div style={{ display: "flex", height: "300px", overflow: "hidden" }}>
                    <div style={{ flex: 1, overflowY: "auto", padding: "10px", borderRight: "1px solid #ccc" }}>
                        <ControlForm onAddBlock={addBlock} onUpdateBlock={updateBlock} selectedBlock={selectedBlock} />
                        <div className="mt-3 p-3 border">
                            <h5>Default Location</h5>
                            <form className="form-inline">
                                <label>Latitude</label>
                                <input
                                    type="number"
                                    step="0.00001"
                                    name="lat"
                                    value={defaultLocation.lat}
                                    onChange={handleLocationChange}
                                    className="form-control mb-2 mr-sm-2"
                                />
                                <label>Longitude</label>
                                <input
                                    type="number"
                                    step="0.00001"
                                    name="lng"
                                    value={defaultLocation.lng}
                                    onChange={handleLocationChange}
                                    className="form-control mb-2 mr-sm-2"
                                />
                                <label>Zoom</label>
                                <input
                                    type="number"
                                    name="zoom"
                                    value={defaultLocation.zoom}
                                    onChange={handleLocationChange}
                                    className="form-control mb-2"
                                />
                            </form>
                        </div>
                        <div className="mt-3">
                            <button
                                className="btn btn-success mr-2"
                                onClick={() => downloadJSON(blocks, "blocks.json")}
                            >
                                Download Blocks
                            </button>
                            <label className="btn btn-secondary">
                                Upload Blocks
                                <input
                                    type="file"
                                    onChange={(e) => uploadJSON(e, (data) => setSelectedBlock(data))}
                                    style={{ display: "none" }}
                                />
                            </label>
                        </div>
                    </div>
                    <div style={{ flex: 1, overflowY: "auto", padding: "10px" }}>
                        <BlockManager
                            blocks={blocks}             // Pass blocks as a prop to BlockManager
                            onSelectBlock={setSelectedBlock}
                            onDeleteBlock={deleteBlock}
                        />
                    </div>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", padding: "10px", backgroundColor: "#f1f1f1" }}>
                    <button className="btn btn-warning" onClick={clearBlocks}>Clear All Blocks</button>
                    <span><strong>Block Count:</strong> {blocks.length}</span>
                </div>
            </div>
        </div>
    );
};

export default MapEditor;

