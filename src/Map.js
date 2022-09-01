import React from "react";
import { MapContainer as LeafMap, TileLayer } from "react-leaflet";
import "./css/Map.css";
import ChangeView from "./ChangeView";
import { showDataOnMap } from "./util";

const Map = ({ countries, casesType, center, zoom }) => {
  return (
    <div className="map">
      <LeafMap center={center} zoom={zoom}>
        <ChangeView center={center} zoom={zoom} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {showDataOnMap(countries, casesType)}
      </LeafMap>
    </div>
  );
};

export default Map;
