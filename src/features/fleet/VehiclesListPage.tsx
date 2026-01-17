import { useEffect, useState, useCallback } from "react";
import { Plus, RefreshCw, Truck } from "lucide-react";
import toast from "react-hot-toast";
import { fleetApi } from "../../api/fleetApi";
import { type VehicleDetails, type VehicleQuery, VehicleStatus } from "../../types";
import { RegisterVehicleModal } from "./RegisterVehicleModal";

// Status badge helper (Dark mode colors)
const getStatusBadge = (status: string) => {
  // Status can be string or number, handle both
  const statusNum = typeof status === "string" 
    ? VehicleStatus[status.toUpperCase() as keyof typeof VehicleStatus] ?? VehicleStatus.ACTIVE
    : status;

  switch (statusNum) {
    case VehicleStatus.ACTIVE:
      return "bg-green-900/30 text-green-400 border-green-700";
    case VehicleStatus.MAINTENANCE:
      return "bg-yellow-900/30 text-yellow-400 border-yellow-700";
    case VehicleStatus.OFFLINE:
      return "bg-gray-900/30 text-gray-400 border-gray-700";
    case VehicleStatus.IN_ACCIDENT:
      return "bg-red-900/30 text-red-400 border-red-700";
    default:
      return "bg-gray-900/30 text-gray-400 border-gray-700";
  }
};

const getStatusLabel = (status: string): string => {
  const statusNum = typeof status === "string" 
    ? VehicleStatus[status.toUpperCase() as keyof typeof VehicleStatus] ?? VehicleStatus.ACTIVE
    : status;

  switch (statusNum) {
    case VehicleStatus.ACTIVE:
      return "Active";
    case VehicleStatus.MAINTENANCE:
      return "Maintenance";
    case VehicleStatus.OFFLINE:
      return "Offline";
    case VehicleStatus.IN_ACCIDENT:
      return "In Accident";
    default:
      return "Unknown";
  }
};

export const VehiclesListPage = () => {
  const [vehicles, setVehicles] = useState<VehicleDetails[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [totalItems, setTotalItems] = useState(0);
  const [page, setPage] = useState(1);
  const pageSize = 20;

  const fetchVehicles = useCallback(async () => {
    setLoading(true);
    try {
      const query: VehicleQuery = {
        page,
        pageSize,
      };

      const result = await fleetApi.getAllVehicles(query);
      setVehicles(result.items);
      setTotalItems(result.totalItems);
    } catch (error) {
      console.error("Failed to fetch vehicles", error);
      toast.error("Failed to load vehicles.");
    } finally {
      setLoading(false);
    }
  }, [page, pageSize]);

  useEffect(() => {
    fetchVehicles();
  }, [fetchVehicles]);

  const handleVehicleAdded = () => {
    setIsModalOpen(false);
    fetchVehicles(); // Refresh the list
    toast.success("Vehicle registered successfully!");
  };

  const totalPages = Math.ceil(totalItems / pageSize);

  return (
    <div className="space-y-6">
      {/* Header with Add Button */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <Truck size={24} className="text-brand-primary" />
          <div>
            <h2 className="text-2xl font-bold text-white">Vehicles</h2>
            <p className="text-gray-400 text-sm">
              {totalItems} vehicle{totalItems !== 1 ? "s" : ""} in fleet
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <button
            onClick={fetchVehicles}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors font-medium disabled:opacity-50"
          >
            <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-brand-primary hover:bg-blue-600 text-white rounded-lg transition-colors font-medium shadow-lg"
          >
            <Plus size={18} />
            Add Vehicle
          </button>
        </div>
      </div>

      {/* Vehicles Table */}
      {loading && vehicles.length === 0 ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary"></div>
        </div>
      ) : vehicles.length === 0 ? (
        <div className="bg-slate-800 rounded-lg border border-slate-700 p-12 text-center">
          <Truck size={48} className="mx-auto text-slate-500 mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No vehicles found</h3>
          <p className="text-gray-400 mb-6">Get started by adding your first vehicle to the fleet.</p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-brand-primary hover:bg-blue-600 text-white rounded-lg transition-colors font-medium"
          >
            <Plus size={18} />
            Add Vehicle
          </button>
        </div>
      ) : (
        <>
          <div className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-700/50 border-b border-slate-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Plate Number
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Model
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Driver
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700">
                  {vehicles.map((vehicle) => (
                    <tr
                      key={vehicle.id}
                      className="hover:bg-slate-700/30 transition-colors cursor-pointer"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-white">
                          {vehicle.plateNumber}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-300">{vehicle.model || "N/A"}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusBadge(vehicle.status)}`}
                        >
                          {getStatusLabel(vehicle.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-300">
                          {vehicle.currentDriverName || "Unassigned"}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6">
              <div className="text-sm text-gray-400">
                Showing {((page - 1) * pageSize) + 1} to {Math.min(page * pageSize, totalItems)} of {totalItems} vehicles
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Register Vehicle Modal */}
      <RegisterVehicleModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleVehicleAdded}
      />
    </div>
  );
};
