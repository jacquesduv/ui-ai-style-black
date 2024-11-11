// src/components/MapDisplay.jsx

import React, { useCallback, useRef, useState, useEffect } from "react";
import { GoogleMap, Polygon, LoadScript } from "@react-google-maps/api";
import { useGridBlockContext } from "../context/GridBlockContext";
import { notifyWarn } from "../utils/ToastNotifications";
import "../styles/MapDisplay.css";

const containerStyle = {
  width: "100%",
  height: "100vh",
};

const mapOptions = {
  disableDefaultUI: true,
  zoomControl: true,
};

const MapDisplay = () => {
  const {
    grid: {
      cells: gridCells,
      params: gridParams,
      selectCell,
      toggleSelectCell,
    },
  } = useGridBlockContext();

  const mapRef = useRef(null);
  const [mapCenter, setMapCenter] = useState({
    lat: gridParams?.center?.latitude || -27.945563,
    lng: gridParams?.center?.longitude || 25.661019,
  });

  useEffect(() => {
    if (gridParams && gridParams.center) {
      const newCenter = {
        lat: gridParams.center.latitude,
        lng: gridParams.center.longitude,
      };
      setMapCenter(newCenter);
      if (mapRef.current) {
        mapRef.current.panTo(newCenter);
      }
    }
  }, [gridParams]);

  const onMapLoad = useCallback((map) => {
    mapRef.current = map;
  }, []);

  const onMapClick = (event) => {
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();
    const cell = getCellByLatLng(lat, lng);

    if (event.domEvent.shiftKey) {
      cell
        ? toggleSelectCell(cell)
        : notifyWarn("No cell found at this location.");
    } else {
      selectCell(lat, lng);
    }
  };

  const getCellByLatLng = (lat, lng) => {
    if (!gridParams || !gridCells || !window.google?.maps?.geometry)
      return null;
    const point = new window.google.maps.LatLng(lat, lng);

    for (let cell of gridCells) {
      const polygon = new window.google.maps.Polygon({
        paths: cell.coordinates,
      });
      if (window.google.maps.geometry.poly.containsLocation(point, polygon)) {
        return cell;
      }
    }
    return null;
  };

  const onCellClick = (cell, event) => {
    event.stopPropagation();
    event.domEvent.shiftKey
      ? toggleSelectCell(cell)
      : selectCell(cell.center.latitude, cell.center.longitude);
  };

  return (
    <LoadScript
      googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}
      libraries={["geometry"]}
    >
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={mapCenter}
        zoom={15}
        options={mapOptions}
        onLoad={onMapLoad}
        onClick={onMapClick}
      >
        {gridCells.map((cell) => (
          <Polygon
            key={cell.id}
            paths={cell.coordinates}
            options={{
              fillColor: cell.status === "selected" ? "#00FF00" : "#FF0000",
              fillOpacity: cell.status === "selected" ? 0.4 : 0.2,
              strokeColor: cell.status === "selected" ? "#00FF00" : "#FF0000",
              strokeOpacity: 0.8,
              strokeWeight: cell.status === "selected" ? 2 : 1,
            }}
            onClick={(event) => onCellClick(cell, event)}
          />
        ))}
      </GoogleMap>
    </LoadScript>
  );
};

export default React.memo(MapDisplay);
