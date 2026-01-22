import React, { useEffect, useRef, useState } from "react";
import { Marker } from "react-leaflet";
import L from "leaflet";
import "leaflet.marker.slideto"; 
import { type FleetVehicleLiveStateResponse } from "../../../types";

interface SlidableMarker extends L.Marker {
  slideTo(latLng: L.LatLngExpression, options: {
    duration: number;
    keepAtCenter?: boolean;
  }): this;
}

function isSlidable(marker: L.Marker | null): marker is SlidableMarker {
  return marker !== null && 'slideTo' in marker;
}

interface MovingMarkerProps {
  vehicle: FleetVehicleLiveStateResponse;
  children?: React.ReactNode;
}

export const MovingMarker = ({ vehicle, children }: MovingMarkerProps) => {
  const markerRef = useRef<L.Marker>(null);
  const [rotation, setRotation] = useState(0);

  const latitude = vehicle.liveLocation?.latitude;
  const longitude = vehicle.liveLocation?.longitude;

  // 1. Calculate Rotation (Heading)
  useEffect(() => {
    if (markerRef.current && latitude !== undefined && longitude !== undefined) {
      const prevPos = markerRef.current.getLatLng();
      
      // Only calculate if there's significant movement
      if (Math.abs(prevPos.lat - latitude) > 0.0001 || Math.abs(prevPos.lng - longitude) > 0.0001) {
        const angle = Math.atan2(longitude - prevPos.lng, latitude - prevPos.lat) * (180 / Math.PI);
        setRotation(angle);
      }
    }
  }, [latitude, longitude]);

  // 2. Optimized Smooth Slide
  useEffect(() => {
    if (isSlidable(markerRef.current) && latitude !== undefined && longitude !== undefined) {
      markerRef.current.slideTo([latitude, longitude], {
        // 🚀 TIP: Duration should be slightly LONGER than the update interval
        // If SignalR pings every 1s, use 1100ms. If 2s, use 2100ms.
        duration: 2000, 
        keepAtCenter: false,
      });
    }
  }, [latitude, longitude]); 

  if (latitude === undefined || longitude === undefined) return null;

  // 3. Create Custom Icon with Rotation
  const rotatedIcon = L.divIcon({
    className: 'custom-div-icon',
    html: `
      <div style="transform: rotate(${rotation}deg); transition: transform 0.5s ease-in-out;">
        <img src="https://cdn-icons-png.flaticon.com/512/741/741407.png" style="width:24px; height:24px;" />
      </div>
    `,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });

  return (
    <Marker
      ref={markerRef}
      position={[latitude, longitude]}
      icon={rotatedIcon}
    >
      {children}
    </Marker>
  );
};