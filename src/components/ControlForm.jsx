// src/components/ControlForm.jsx
import React, { useState, useEffect } from 'react';

const ControlForm = ({ onAddBlock, selectedBlock, onUpdateBlock }) => {
    // Initialize state for form inputs
    const [lat, setLat] = useState('');
    const [lng, setLng] = useState('');
    const [targetRate, setTargetRate] = useState('');

    // Populate form with selected block data if available
    useEffect(() => {
        if (selectedBlock) {
            setLat(selectedBlock.lat);
            setLng(selectedBlock.lng);
            setTargetRate(selectedBlock.targetRate);
        }
    }, [selectedBlock]);

    // Reset form after submission
    const resetForm = () => {
        setLat('');
        setLng('');
        setTargetRate('');
    };

    // Handle form submission
    const handleSubmit = (event) => {
        event.preventDefault();

        // Basic validation
        const latitude = parseFloat(lat);
        const longitude = parseFloat(lng);
        const rate = targetRate === '' ? 1000 : parseInt(targetRate); // Default rate to 1000

        if (isNaN(latitude) || latitude < -90 || latitude > 90) {
            alert('Please enter a valid latitude between -90 and 90.');
            return;
        }
        if (isNaN(longitude) || longitude < -180 || longitude > 180) {
            alert('Please enter a valid longitude between -180 and 180.');
            return;
        }
        if (isNaN(rate) || rate <= 0) {
            alert('Please enter a valid target rate.');
            return;
        }

        // Call appropriate function based on form state (add or update)
        if (selectedBlock) {
            onUpdateBlock({ ...selectedBlock, lat: latitude, lng: longitude, targetRate: rate });
        } else {
            onAddBlock({ lat: latitude, lng: longitude, targetRate: rate });
        }

        resetForm();
    };

    return (
        <form onSubmit={handleSubmit} className="p-3 border border-primary rounded">
            <h5>{selectedBlock ? 'Edit Block' : 'Add New Block'}</h5>

            <div className="form-group mb-2">
                <label>Latitude</label>
                <input
                    type="number"
                    step="0.00001"
                    value={lat}
                    onChange={(e) => setLat(e.target.value)}
                    className="form-control"
                    placeholder="Enter latitude"
                />
            </div>

            <div className="form-group mb-2">
                <label>Longitude</label>
                <input
                    type="number"
                    step="0.00001"
                    value={lng}
                    onChange={(e) => setLng(e.target.value)}
                    className="form-control"
                    placeholder="Enter longitude"
                />
            </div>

            <div className="form-group mb-2">
                <label>Target Rate</label>
                <input
                    type="number"
                    value={targetRate}
                    onChange={(e) => setTargetRate(e.target.value)}
                    className="form-control"
                    placeholder="Enter target rate (default: 1000)"
                />
            </div>

            <button type="submit" className="btn btn-primary mt-2">
                {selectedBlock ? 'Update Block' : 'Add Block'}
            </button>
        </form>
    );
};

export default ControlForm;

