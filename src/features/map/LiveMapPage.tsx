import { MapContainer, TileLayer,  Popup, useMap, Polyline } from "react-leaflet";
import { useSignalR } from "../../context/SignalRContext";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect, useMemo } from "react";
import { MovingMarker } from "./components/MovingMarker";

// Define a custom Vehicle Icon
const VehicleIcon = L.icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/741/741407.png",
  iconSize: [24, 24],
  iconAnchor: [12, 12],
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

interface LiveMapPageProps {
  plannedRoute?: {
    type: string;
    coordinates: number[][]; // [lng, lat] from OSRM
  };
}

export const LiveMapPage = ({ plannedRoute }: LiveMapPageProps) => {
  const { isConnected, vehicleStates } = useSignalR();

  // Convert Map values to an Array
  const vehicles = Array.from(vehicleStates.values());

  // 🔄 1. Flip OSRM Coordinates [Lng, Lat] to Leaflet [Lat, Lng]
  const routePositions = useMemo(() => {
    if (!plannedRoute?.coordinates) return [];
    // OSRM returns [longitude, latitude], Leaflet needs [latitude, longitude]
    return plannedRoute.coordinates.map((coord) => [coord[1], coord[0]] as [number, number]);
  }, [plannedRoute]);

  // 2. Calculate Dynamic Center
  const activeVehicle = vehicles.find((v) => v.liveLocation);
  const centerPosition: [number, number] =
    activeVehicle && activeVehicle.liveLocation
      ? [activeVehicle.liveLocation.latitude, activeVehicle.liveLocation.longitude]
      : [30.0444, 31.2357]; // Default Fallback to Cairo

  return (
    <div className="h-full flex flex-col">
      <div className="mb-4 flex justify-between items-center">
        <h2 className=" m-3 text-2xl font-bold text-white">Live Operations Map</h2>
        <div className="flex items-center gap-4">
          {/* Legend for the Trip Route */}
          {routePositions.length > 0 && (
            <div className="flex items-center gap-2 px-3 py-1 bg-slate-800 rounded-lg border border-blue-500/30">
              <div className="w-8 h-1 bg-blue-500 rounded-full border-b border-blue-200"></div>
              <span className="text-xs text-blue-100 font-medium">Active Trip Path</span>
            </div>
          )}
          
          <div className="flex items-center gap-2">
            <span
              className={`w-3 h-3 rounded-full ${
                isConnected ? "bg-green-500" : "bg-red-500"
              } shadow-[0_0_8px_rgba(34,197,94,0.6)]`}
            ></span>
            <span className="text-sm text-slate-400">
              {isConnected
                ? `Tracking ${vehicles.length} Vehicles`
                : "Connecting..."}
            </span>
          </div>
        </div>
      </div>

      <div className="flex-1 rounded-xl overflow-hidden border border-slate-700 shadow-2xl relative z-0">
        <MapContainer
          center={centerPosition}
          zoom={13}
          style={{ height: "100%", width: "100%" }}
        >
          <MapReCenter lat={centerPosition[0]} lng={centerPosition[1]} />

          <TileLayer
            attribution="&copy; OpenStreetMap"
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          />

          {/* 🔵 3. Draw Planned Trip Route Line */}
          {routePositions.length > 0 && (
            <Polyline 
              positions={routePositions} 
              pathOptions={{
                color: '#3b82f6',
                weight: 5,
                opacity: 0.7,
                lineJoin: 'round',
                dashArray: '1, 10' // Makes it look like a navigation path
              }} 
            />
          )}

          {vehicles.map((vehicle) => {
            if (!vehicle.liveLocation) return null;
            return (              
              <MovingMarker key={vehicle.vehicleId} vehicle={vehicle}>
                <Popup>
                  <div className="text-slate-900 p-1">
                    <div className="font-bold border-b border-slate-200 pb-1 mb-1">
                       Plate: {vehicle.plateNumber}
                    </div>
                    <div className="text-xs space-y-1">
                      <p><span className="text-slate-500">Status:</span> {vehicle.status}</p>
                      <p><span className="text-slate-500">Speed:</span> {vehicle.liveLocation.speedKmh?.toFixed(1) || 0} km/h</p>
                    </div>
                  </div>
                </Popup>
              </MovingMarker>
            );
          })}
        </MapContainer>
      </div>
    </div>
  );
};