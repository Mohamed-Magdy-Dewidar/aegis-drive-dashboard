import { useState } from "react";
import { LiveMapPage } from "../map/LiveMapPage";
import { tripApi } from "../../api/tripApi";
import { TripSummaryCard } from "./components/TripSummaryCard";
import { DestinationSearch } from "./components/DestinationSearch";
import {
  type TripResponse,
  type TripSummary,
  type DestinationOption,
} from "../../types/index";
import { useTrip } from "../../hooks/useTrip";
import { TripHUD } from "./components/TripHUD";

export const ActiveTripManager = () => {
  // Pull persistent state from our custom hook
  const { activeTrip, startActiveTrip, clearActiveTrip, isDriving } = useTrip();
  
  // Sync local status with the persistent driving state
  const [status, setStatus] = useState<"IDLE" | "DRIVING" | "FINISHED">(
    isDriving ? "DRIVING" : "IDLE",
  );

  const [summary, setSummary] = useState<TripSummary | null>(null);
  const [loading, setLoading] = useState(false);

  const handleStartTrip = async (destination: DestinationOption) => {
    setLoading(true);
    try {
      const result: TripResponse = await tripApi.startTrip({
        vehicleId: 1, // Fixed ID for demo; can be dynamic later
        destinationText: destination.label,
        destinationLat: destination.lat,
        destinationLng: destination.lng,
      });

      // 💾 Save to Context & LocalStorage
      startActiveTrip(result);
      setStatus("DRIVING");
    } catch (err) {
      console.error("Failed to start trip", err);
    } finally {
      setLoading(false);
    }
  };

  const handleEndTrip = async () => {
    if (!activeTrip?.tripId) return;
    setLoading(true);
    try {
      const result: TripSummary = await tripApi.endTrip(activeTrip.tripId);
      setSummary(result);
      setStatus("FINISHED");
    } catch (err) {
      console.error("Failed to end trip", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative h-screen flex flex-col bg-slate-900">
      <div className="flex-1 relative">
        {/* 🗺️ Background: The Live Map */}
        <LiveMapPage plannedRoute={activeTrip?.geometry} />

        {/* 🛰️ Overlay: The Trip HUD (Persistent info) */}
        {activeTrip && status === "DRIVING" && <TripHUD trip={activeTrip} />}

        {/* 🔍 Overlay: Destination Search (Only when Idle) */}
        {status === "IDLE" && (
          <div className="absolute top-6 left-1/2 -translate-x-1/2 z-[1000] w-full max-w-md px-4">
            <DestinationSearch onSelect={handleStartTrip} isLoading={loading} />
          </div>
        )}

        {/* 🛑 Overlay: End Trip Button (Only when Driving) */}
        {status === "DRIVING" && (
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-[1000] w-full max-w-xs">
            <button
              onClick={handleEndTrip}
              disabled={loading}
              className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-4 rounded-2xl shadow-2xl transition-all active:scale-95 disabled:opacity-50"
            >
              {loading ? "Finalizing Report..." : "END TRIP"}
            </button>
          </div>
        )}
      </div>

      {/* 📊 Modal: Final Trip Summary (After completion) */}
      {status === "FINISHED" && summary && (
        <div className="absolute inset-0 z-[2000] bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
          <TripSummaryCard
            summary={summary}
            onClose={() => {
              setStatus("IDLE");
              // 🧹 Wipe context and localStorage
              clearActiveTrip(); 
            }}
          />
        </div>
      )}
    </div>
  );
};