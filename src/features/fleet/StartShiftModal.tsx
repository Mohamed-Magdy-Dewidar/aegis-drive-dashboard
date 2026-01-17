import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import toast from "react-hot-toast";
import { fleetApi } from "../../api/fleetApi";
import { type DriverProfile, type VehicleDetails } from "../../types";

interface StartShiftModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  drivers: DriverProfile[];
  vehicles: VehicleDetails[];
}

export const StartShiftModal: React.FC<StartShiftModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  drivers,
  vehicles,
}) => {
  const [loading, setLoading] = useState(false);
  // ✅ Keep state as string/number union
  const [selectedDriverId, setSelectedDriverId] = useState<number | "">("");
  const [selectedVehicleId, setSelectedVehicleId] = useState<number | "">("");

  useEffect(() => {
    if (isOpen) {
      // Reset selections when opening to avoid stale data
      setSelectedDriverId("");
      setSelectedVehicleId("");
      console.log("[StartShiftModal] Drivers in Modal:", drivers);
    }
  }, [isOpen, drivers]);

  // src/features/fleet/StartShiftModal.tsx

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  // Validation
  if (!selectedDriverId || !selectedVehicleId) {
    toast.error("Please select both a driver and a vehicle.");
    return;
  }

  setLoading(true);
  try {
    // ✅ Use the new startShift API
    await fleetApi.startShift({
      driverId: Number(selectedDriverId),
      vehicleId: Number(selectedVehicleId),
    });

    toast.success("Shift started successfully!");
    onSuccess(); // This triggers fetchData in the parent page
    onClose();
  } catch (error: any) {
    console.error("Shift start failed:", error);
    const errorMessage = error.response?.data?.message || "Failed to start shift.";
    toast.error(errorMessage);
  } finally {
    setLoading(false);
  }
};

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-slate-800 rounded-xl border border-slate-700 shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b border-slate-700">
          <h2 className="text-xl font-bold text-white">Start Shift</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white"><X size={24} /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Driver Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Select Driver <span className="text-red-400">*</span>
            </label>
            <select
              // ✅ Convert value to string to prevent NaN warnings
              value={selectedDriverId.toString()}
              onChange={(e) => setSelectedDriverId(e.target.value ? Number(e.target.value) : "")}
              disabled={loading}
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 outline-none appearance-none"
            >
              <option value="">-- Choose Driver --</option>
              {drivers.map((d) => (
                // ✅ Use unique key prefixes to prevent React key collisions
                <option key={`driver-${d.driverId}`} value={d.driverId.toString()}>
                  {d.fullName}
                </option>
              ))}
            </select>
          </div>

          {/* Vehicle Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Select Vehicle <span className="text-red-400">*</span>
            </label>
            <select
              value={selectedVehicleId.toString()}
              onChange={(e) => setSelectedVehicleId(e.target.value ? Number(e.target.value) : "")}
              disabled={loading}
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 outline-none appearance-none"
            >
              <option value="">-- Choose Vehicle --</option>
              {vehicles.map((v) => (
                <option key={`vehicle-${v.id}`} value={v.id.toString()}>
                  {v.plateNumber} ({v.model})
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            disabled={loading || !selectedDriverId || !selectedVehicleId}
            className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold shadow-lg disabled:opacity-50 transition-all"
          >
            {loading ? "Starting..." : "Start Shift"}
          </button>
        </form>
      </div>
    </div>
  );
};