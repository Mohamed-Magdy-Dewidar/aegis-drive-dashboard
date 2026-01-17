import { Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";
import { Truck, Users, Calendar } from "lucide-react";
import clsx from "clsx";
import { useAuth } from "../../context/AuthContext";
import { VehiclesListPage } from "./VehiclesListPage";
import { DriversListPage } from "./DriversListPage";
import { AssignmentsPage } from "./AssignmentsPage";

export const FleetManagementPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const isIndividual = user?.role === "Individual";

  const allTabs = [
    { id: "vehicles", label: "Vehicles", icon: Truck, path: "/fleet/vehicles", roles: ["Manager", "Individual"] },
    { id: "drivers", label: "Driver Profile", icon: Users, path: "/fleet/drivers", roles: ["Manager", "Individual"] }, // ✅ Now accessible to both
    { id: "assignments", label: "Assignments", icon: Calendar, path: "/fleet/assignments", roles: ["Manager"] },
  ];

  const tabs = allTabs.filter(tab => tab.roles.includes(user?.role || ""));

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white">Fleet Management</h1>
        <p className="text-gray-400 mt-1">
          {isIndividual 
            ? "Manage your vehicle and personal driver profile." 
            : "Manage vehicles, drivers, and shift assignments."}
        </p>
      </div>

      <div className="border-b border-slate-700 mb-6">
        <nav className="flex space-x-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = location.pathname.startsWith(tab.path);
            return (
              <button
                key={tab.id}
                onClick={() => navigate(tab.path)}
                className={clsx(
                  "flex items-center gap-2 px-4 py-3 font-medium text-sm transition-colors relative",
                  isActive ? "text-blue-500" : "text-slate-400 hover:text-white"
                )}
              >
                <Icon size={18} />
                <span>{tab.label}</span>
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500" />
                )}
              </button>
            );
          })}
        </nav>
      </div>

      <Routes>
        <Route path="vehicles" element={<VehiclesListPage />} />
        <Route path="drivers" element={<DriversListPage />} />
        
        {/* Only allow Managers to access the Assignments route */}
        {!isIndividual && (
          <Route path="assignments" element={<AssignmentsPage />} />
        )}

        <Route path="/" element={<Navigate to="/fleet/vehicles" replace />} />
        <Route path="*" element={<Navigate to="/fleet/vehicles" replace />} />
      </Routes>
    </div>
  );
};