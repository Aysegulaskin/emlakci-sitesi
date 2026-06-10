"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Leaflet ikon sorunu düzeltme
const icon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

interface Props {
  lat: number;
  lng: number;
  baslik: string;
  fiyat: string;
}

export default function HaritaBileseni({ lat, lng, baslik, fiyat }: Props) {
  useEffect(() => {
    L.Marker.prototype.options.icon = icon;
  }, []);

  return (
    <MapContainer
      center={[lat, lng]}
      zoom={15}
      style={{ height: "350px", width: "100%", borderRadius: "12px" }}
      className="z-0"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={[lat, lng]} icon={icon}>
        <Popup>
          <div className="text-sm">
            <p className="font-semibold">{baslik}</p>
            <p className="text-blue-700 font-bold">{fiyat}</p>
          </div>
        </Popup>
      </Marker>
    </MapContainer>
  );
}
