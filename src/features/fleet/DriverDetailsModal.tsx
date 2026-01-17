/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from "react";
import { X, Phone, Mail, Building, Users, AlertTriangle, ShieldCheck, User } from "lucide-react";
import { fleetApi } from "../../api/fleetApi";
import { type DriverDetails } from "../../types";


interface DriverDetailsModalProps {
  driverId: number | null;
  isOpen: boolean;
  onClose: () => void;
}

export const DriverDetailsModal: React.FC<DriverDetailsModalProps> = ({
  driverId,
  isOpen,
  onClose,
}) => {
  const [driver, setDriver] = useState<DriverDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // 🔍 DEBUG: Log whenever props change
    console.log("[DriverDetailsModal] Effect Triggered. isOpen:", isOpen, "driverId:", driverId);

    if (isOpen && driverId) {
      const fetchDetails = async () => {
        setLoading(true);
        setError("");
        try {
          console.log(`[DriverDetailsModal] Fetching details for ID: ${driverId}...`);
          
          const data = await fleetApi.getDriverDetails(driverId);
          
          // 🔍 DEBUG: Log the raw data from API
          console.log("[DriverDetailsModal] API Response Data:", data);
          
          setDriver(data);
        } catch (err: any) {
          setError("Failed to load driver details.");
        } finally {
          setLoading(false);
        }
      };
      fetchDetails();
    } else {
      setDriver(null); // Reset on close
    }
  }, [isOpen, driverId]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative bg-slate-900 rounded-2xl border border-slate-700 shadow-2xl w-full max-w-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-slate-800 bg-slate-800/50">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <User className="text-blue-500" /> Driver Profile
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Content - Scrollable */}
        <div className="p-6 overflow-y-auto custom-scrollbar">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4" />
              <p className="text-slate-400">Loading profile...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12 text-red-400">
              <AlertTriangle className="mx-auto mb-2" size={32} />
              {error}
            </div>
          ) : driver ? (
            <div className="space-y-8">
              {/* 1. Main Profile Card */}
              <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start">
                {/* Image */}
                <div className="w-32 h-32 rounded-full border-4 border-slate-700 overflow-hidden shadow-lg shrink-0">
                  {driver.pictureUrl ? (
                    <img src={driver.pictureUrl} alt={driver.fullName} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-slate-800 flex items-center justify-center">
                      <User size={48} className="text-slate-600" />
                    </div>
                  )}
                </div>

                {/* Basic Info */}
                <div className="flex-1 text-center sm:text-left space-y-2">
                  <h1 className="text-2xl font-bold text-white">{driver.fullName}</h1>
                  
                  <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                    <span className={`px-2.5 py-0.5 rounded-full text-sm font-medium border ${
                      driver.isActive 
                        ? "bg-green-500/10 text-green-400 border-green-500/20"
                        : "bg-slate-700 text-slate-400 border-slate-600"
                    }`}>
                      {driver.isActive ? "Active Status" : "Offline"}
                    </span>
                    
                    <span className="px-2.5 py-0.5 rounded-full text-sm font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center gap-1">
                      <ShieldCheck size={14} /> 
                      {/* ✅ Uses the 'safteyScore' property (matching your backend typo) */}
                      Score: {driver.safteyScore}
                    </span>
                  </div>

                  <div className="pt-2 text-slate-300 space-y-1">
                    <div className="flex items-center justify-center sm:justify-start gap-2">
                      <Phone size={16} className="text-slate-500" /> {driver.phoneNumber}
                    </div>
                    {driver.email && (
                      <div className="flex items-center justify-center sm:justify-start gap-2">
                        <Mail size={16} className="text-slate-500" /> {driver.email}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* 2. Company Info (Optional) */}
              {driver.driverCompany && (
                <div className="bg-slate-800/50 rounded-xl p-5 border border-slate-700">
                  <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <Building size={16} /> Company Details
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-slate-500">Company Name</p>
                      <p className="text-white font-medium">{driver.driverCompany.name}</p>
                    </div>
                    {driver.driverCompany.representativeName && (
                      <div>
                        <p className="text-xs text-slate-500">Representative</p>
                        <p className="text-white">{driver.driverCompany.representativeName}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* 3. Emergency Contacts */}
              <div>
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Users size={16} /> Emergency Contacts
                </h3>
                
                {driver.driverFamilyMembers && driver.driverFamilyMembers.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {driver.driverFamilyMembers.map((member, idx) => (
                      <div key={idx} className="bg-slate-800 border border-slate-700 p-4 rounded-xl flex justify-between items-start">
                        <div>
                          <p className="text-white font-medium">{member.fullName}</p>
                          <p className="text-xs text-slate-400 uppercase mt-0.5">{member.relationship || "Family"}</p>
                          <p className="text-sm text-blue-400 mt-1">{member.phoneNumber}</p>
                        </div>
                        {member.notifyOnCritical && (
                          <div title="Notified on Critical Alerts" className="bg-red-500/10 p-1.5 rounded-lg border border-red-500/20">
                            <AlertTriangle size={16} className="text-red-500" />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 bg-slate-800/30 rounded-xl border border-dashed border-slate-700 text-slate-500">
                    No emergency contacts registered.
                  </div>
                )}
              </div>

            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};