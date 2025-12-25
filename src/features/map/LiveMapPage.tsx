import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { useSignalR } from "../../context/SignalRContext";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect } from "react";



// Define a custom Vehicle Icon
const VehicleIcon = L.icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/741/741407.png",

  iconSize: [18, 18],
  iconAnchor: [8, 8], 
  popupAnchor: [0, -10], 
});

L.Marker.prototype.options.icon = VehicleIcon;

// 🆕 Helper Component to Auto-Center Map
const MapReCenter = ({ lat, lng }: { lat: number; lng: number }) => {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lng], map.getZoom());
  }, [lat, lng, map]);
  return null;
};

export const LiveMapPage = () => {
  const { isConnected, vehicleStates } = useSignalR();

  // Convert Map values to an Array
  const vehicles = Array.from(vehicleStates.values());

  // 1. Calculate Dynamic Center
  // If we have vehicles, use the first one. If not, fallback to Cairo.
  const activeVehicle = vehicles.find((v) => v.liveLocation);
  const centerPosition: [number, number] =
    activeVehicle && activeVehicle.liveLocation
      ? [
          activeVehicle.liveLocation.latitude,
          activeVehicle.liveLocation.longitude,
        ]
      : [30.0444, 31.2357]; // Default Fallback

  return (
    <div className="h-full flex flex-col">
      {/* Header ... (Keep same) */}
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Live Operations Map</h2>
        <div className="flex items-center gap-2">
          <span
            className={`w-3 h-3 rounded-full ${
              isConnected ? "bg-green-500" : "bg-red-500"
            }`}
          ></span>
          <span className="text-sm text-slate-400">
            {isConnected
              ? `Tracking ${vehicles.length} Vehicles`
              : "Connecting..."}
          </span>
        </div>
      </div>

      <div className="flex-1 rounded-xl overflow-hidden border border-slate-700 shadow-2xl relative z-0">
        <MapContainer
          center={centerPosition}
          zoom={13}
          style={{ height: "100%", width: "100%" }}
        >
          {/* 🆕 Auto-Recenter Logic */}
          <MapReCenter lat={centerPosition[0]} lng={centerPosition[1]} />

          <TileLayer
            attribution="&copy; OpenStreetMap"
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          />

          {vehicles.map((vehicle) => {
            if (!vehicle.liveLocation) return null;
            return (
              <Marker
                key={vehicle.vehicleId}
                position={[
                  vehicle.liveLocation.latitude,
                  vehicle.liveLocation.longitude,
                ]}
              >
                <Popup>
                  <div className="text-slate-900">
                    <strong>{vehicle.plateNumber}</strong>
                    <br />
                    {vehicle.status}
                    <br />
                    {vehicle.liveLocation.speedKmh.toFixed(1)} km/h
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>
    </div>
  );
};
