import React, { useEffect, useState, useCallback } from "react";
import { 
  RefreshCw, 
  Calendar, 
  Play, 
  Square, 
  User, 
  Car, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight,
  Clock
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import { fleetApi } from "../../api/fleetApi";
import { type DriverProfile, type AssignedVehicle, type UnassignedVehicle } from "../../types";
import { StartShiftModal } from "./StartShiftModal";

export const AssignmentsPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const isIndividual = user?.role === "Individual";

  const [drivers, setDrivers] = useState<DriverProfile[]>([]);
  const [assignedVehicles, setAssignedVehicles] = useState<AssignedVehicle[]>([]);
  const [unassignedVehicles, setUnassignedVehicles] = useState<UnassignedVehicle[]>([]);
  const [loading, setLoading] = useState(false);
  const [isShiftModalOpen, setIsShiftModalOpen] = useState(false);

  /**
   * Fetches the latest fleet status. 
   * Solo drivers do not need to fetch the full roster, so the call is skipped for them.
   */
  const fetchData = useCallback(async () => {
    if (isIndividual) return;
    
    setLoading(true);
    try {
      const [driversRes, assignedRes, unassignedRes] = await Promise.all([
        fleetApi.getAllDrivers({ page: 1, pageSize: 100, isActive: true }),
        fleetApi.getAssignedVehicles({ page: 1, pageSize: 100 }), 
        fleetApi.getUnassignedVehicles({ page: 1, pageSize: 100 }) 
      ]);
  
      setDrivers(driversRes.items || []);
      setAssignedVehicles(assignedRes.items || []);
      setUnassignedVehicles(unassignedRes.items || []);
    } catch (error) {
      toast.error("Failed to load fleet data.");
    } finally {
      setLoading(false);
    }
  }, [isIndividual]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  /**
   * Ends an active assignment, releasing both the vehicle and driver.
   */
  const handleEndShift = async (vehicleId: number) => {
    if (!confirm("Are you sure you want to end this shift? The vehicle will become available for other assignments.")) {
      return;
    }

    try {
      setLoading(true);
      await fleetApi.endShift(vehicleId);
      toast.success("Shift ended successfully.");
      await fetchData(); 
    } catch (error: any) {
      const msg = error.response?.data?.message || "Could not end the shift.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  // --- VIEW 1: SOLO DRIVER (INDIVIDUAL) ---
  if (isIndividual) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
        <div className="w-20 h-20 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-6 border border-blue-500/20">
          <Calendar size={40} className="text-blue-500" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Shift Management</h2>
        <p className="text-slate-400 max-w-md mb-8">
          Personal accounts do not require manual shift assignments. 
          To record your driving telemetry and get safety feedback, please visit the <strong>Trips</strong> page.
        </p>
        <button 
          onClick={() => navigate("/trips")}
          className="flex items-center gap-2 px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-blue-600/20"
        >
          Manage My Trips <ArrowRight size={18} />
        </button>
      </div>
    );
  }

  // --- VIEW 2: FLEET MANAGER DASHBOARD ---
  return (
    <div className="space-y-6">
      {/* Dashboard Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-slate-900/50 p-6 rounded-xl border border-slate-800 gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-blue-500/10 rounded-lg">
            <Calendar className="text-blue-500" size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Shift Assignments</h2>
            <p className="text-slate-400 text-sm">Deploy drivers and manage active fleet operations.</p>
          </div>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <button 
            onClick={fetchData} 
            className="p-2.5 bg-slate-800 text-slate-400 hover:text-white rounded-lg transition-colors border border-slate-700"
          >
            <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
          </button>
          <button 
            onClick={() => setIsShiftModalOpen(true)}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold shadow-lg shadow-blue-900/20 transition-all"
          >
            <Play size={18} fill="currentColor" /> Start New Shift
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* ACTIVE SHIFTS COLUMN */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
            <CheckCircle2 size={16} className="text-green-500" /> Active Deployments ({assignedVehicles.length})
          </h3>
          
          <div className="space-y-3">
            {assignedVehicles.length === 0 ? (
              <div className="p-12 text-center bg-slate-900/30 border border-dashed border-slate-800 rounded-2xl text-slate-500">
                <User size={32} className="mx-auto mb-3 opacity-20" />
                <p>No drivers currently on shift.</p>
              </div>
            ) : (
              assignedVehicles.map(v => (
                <div key={`active-${v.id}`} className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex items-center justify-between group hover:border-slate-700 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center border border-green-500/20">
                      <User className="text-green-500" size={22} />
                    </div>
                    <div>
                      <h4 className="text-white font-bold">{v.currentDriverName}</h4>
                      <div className="flex flex-col gap-1">
                        <p className="text-xs text-slate-400 flex items-center gap-1">
                          <Car size={12} className="text-blue-500" /> {v.plateNumber} • {v.model}
                        </p>
                        {v.shiftStartedAt && (
                          <p className="text-[10px] text-slate-500 flex items-center gap-1">
                            <Clock size={10} /> 
                            {new Date(v.shiftStartedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleEndShift(v.id)}
                    className="p-3 text-slate-500 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all"
                    title="End Shift"
                  >
                    <Square size={20} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* IDLE VEHICLES COLUMN */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
            <AlertCircle size={16} className="text-slate-400" /> Available Fleet ({unassignedVehicles.length})
          </h3>
          
          <div className="grid grid-cols-1 gap-3">
            {unassignedVehicles.length === 0 ? (
              <div className="p-12 text-center bg-slate-900/30 border border-dashed border-slate-800 rounded-2xl text-slate-500">
                <Car size={32} className="mx-auto mb-3 opacity-20" />
                <p>No idle vehicles available.</p>
              </div>
            ) : (
              unassignedVehicles.map(v => (
                <div key={`idle-${v.id}`} className="bg-slate-800/40 border border-slate-800 p-4 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-slate-800 rounded-lg">
                      <Car className="text-slate-500" size={20} />
                    </div>
                    <div>
                      <span className="text-slate-200 font-semibold block">{v.plateNumber}</span>
                      <span className="text-[11px] text-slate-500">{v.model}</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold bg-slate-800 text-slate-400 px-2 py-1 rounded border border-slate-700 uppercase">
                    {v.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <StartShiftModal
        isOpen={isShiftModalOpen}
        onClose={() => setIsShiftModalOpen(false)}
        onSuccess={() => { 
          setIsShiftModalOpen(false); 
          fetchData(); 
        }}
        drivers={drivers}
        vehicles={unassignedVehicles}
      />
    </div>
  );
};