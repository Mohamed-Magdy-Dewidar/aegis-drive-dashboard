// src/features/fleet/DriversListPage.tsx
import React, { useEffect, useState, useCallback } from "react";
import { Plus, RefreshCw, User, Star, Pencil, Eye } from "lucide-react";
import toast from "react-hot-toast";
import { fleetApi } from "../../api/fleetApi";
import { type DriverProfile } from "../../types";
import { RegisterDriverModal } from "./RegisterDriverModal";
import { UpdateDriverModal } from "./UpdateDriverModal";

import { DriverDetailsModal } from "./DriverDetailsModal"; 


export const DriversListPage = () => {
  const [drivers, setDrivers] = useState<DriverProfile[]>([]);
  const [loading, setLoading] = useState(false);
  
  // State for Modals
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  
  // ✅ State for Details Modal
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState<DriverProfile | null>(null);

  // ... fetchDrivers logic (unchanged) ...
  const fetchDrivers = useCallback(async () => {
    // ... same as before
    setLoading(true);
    try {
      const result = await fleetApi.getAllDrivers({ page: 1, pageSize: 100 });
      setDrivers(result.items || []);
    } catch (error) {
      toast.error("Failed to load drivers.");
    } finally {
      setLoading(false);
    }
  }, []);
  
  useEffect(() => { fetchDrivers(); }, [fetchDrivers]);

  // Handlers
  const handleEditClick = (driver: DriverProfile) => {
    setSelectedDriver(driver); 
    setIsUpdateOpen(true);    
  };

  const handleViewDetails = (driver: DriverProfile) => {
    setSelectedDriver(driver);
    setIsDetailsOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* ... Header (unchanged) ... */}
       <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold text-white">Driver Roster</h2>
          <p className="text-sm text-slate-400">{drivers.length} drivers total</p>
        </div>
        <div className="flex gap-2">
          <button onClick={fetchDrivers} className="p-2 bg-slate-800 text-slate-300 rounded-lg hover:bg-slate-700">
            <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
          </button>
          <button 
            onClick={() => setIsRegisterOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 font-medium shadow-lg"
          >
            <Plus size={18} /> Add Driver
          </button>
        </div>
      </div>

      {/* Driver Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {drivers.map((driver) => (
          <div key={driver.driverId} className="bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-slate-600 transition-colors group relative">
            
            {/* Actions: View Details & Edit */}
            <div className="absolute top-4 right-4 flex gap-1">
              <button 
                onClick={() => handleViewDetails(driver)}
                className="p-2 text-slate-400 hover:text-blue-400 hover:bg-slate-800 rounded-full transition-all"
                title="View Full Profile"
              >
                <Eye size={18} />
              </button>
              <button 
                onClick={() => handleEditClick(driver)}
                className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition-all"
                title="Edit Driver"
              >
                <Pencil size={16} />
              </button>
            </div>

            {/* Content (Clickable to view details too) */}
            <div 
              className="cursor-pointer" 
              onClick={() => handleViewDetails(driver)}
            >
              <div className="flex items-start justify-between pr-16"> {/* pr-16 to avoid overlapping buttons */}
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-slate-800 overflow-hidden flex items-center justify-center border border-slate-700">
                    {driver.pictureUrl ? (
                      <img src={driver.pictureUrl} alt={driver.fullName} className="w-full h-full object-cover" />
                    ) : (
                      <User className="text-slate-500" size={24} />
                    )}
                  </div>
                  <div>
                    <h3 className="text-white font-medium group-hover:text-blue-400 transition-colors">{driver.fullName}</h3>
                    <p className="text-sm text-slate-400">{driver.phoneNumber}</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 flex items-center gap-2">
                 <div className="flex items-center gap-1 bg-slate-800 px-2 py-1 rounded-lg">
                  <Star size={14} className="text-yellow-500 fill-yellow-500" />
                  <span className="text-sm font-bold text-white">{driver.safetyScore}</span>
                </div>
                <span className={`px-2 py-1 rounded-lg text-xs font-medium border ${
                  driver.isActive  
                    ? 'bg-green-500/10 text-green-400 border-green-500/20' 
                    : 'bg-slate-700/50 text-slate-400 border-slate-600'
                }`}>
                  {driver.isActive ? "Active" :  'Offline'}
                </span>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-800 text-sm text-slate-500 truncate">
                {driver.email}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modals */}
      <RegisterDriverModal 
        isOpen={isRegisterOpen} 
        onClose={() => setIsRegisterOpen(false)} 
        onSuccess={() => { setIsRegisterOpen(false); fetchDrivers(); }} 
      />

      {selectedDriver && (
        <UpdateDriverModal
          driver={selectedDriver}
          isOpen={isUpdateOpen}
          onClose={() => setIsUpdateOpen(false)}
          onSuccess={() => { setIsUpdateOpen(false); fetchDrivers(); }}
        />
      )}

      {/* ✅ Driver Details Modal */}
      <DriverDetailsModal 
        driverId={selectedDriver?.driverId || null}
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
      />
    </div>
  );
};