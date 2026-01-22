import React, { useEffect, useState, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import { fleetApi } from "../../api/fleetApi";
import {
  type SafetyEventSummary,
  type SafetyEventsQuery,
  AlertLevel,
  AlertLevelLabels,
} from "../../types";
import { Filter, RotateCw, } from "lucide-react";

export const SafetyEventsLogPage = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<SafetyEventSummary[]>([]);

  // 🛠️ Persistent State from URL
  const page = Number(searchParams.get("page")) || 1;
  const pageSize = 10;
  const filters = {
    fromDate: searchParams.get("fromDate") || "",
    toDate: searchParams.get("toDate") || "",
    minLevel: searchParams.get("minLevel") || "",
  };

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    try {
      const query: SafetyEventsQuery = {
        page,
        pageSize,
        fromDate: filters.fromDate || undefined,
        toDate: filters.toDate || undefined,
        minLevel: filters.minLevel
          ? (Number(filters.minLevel) as AlertLevel)
          : undefined,
      };

      const result = await fleetApi.getSafetyEvents(query);
      setData(result.items);
      // We assume your PagedResult contains totalItems
      // setTotalItems(result.totalItems);
    } catch (error) {
      console.error("Error fetching safety events:", error);
      toast.error("Failed to load safety log.");
    } finally {
      setLoading(false);
    }
  }, [page, filters.fromDate, filters.toDate, filters.minLevel]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const handleFilterChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set(e.target.name, e.target.value);
    newParams.set("page", "1"); // Reset pagination on filter change
    setSearchParams(newParams);
  };

  const setPage = (newPage: number) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("page", newPage.toString());
    setSearchParams(newParams);
  };

  // 🎨 Updated Badge Colors with Pulse Animation
  const getBadgeStyles = (level: AlertLevel) => {
    switch (level) {
      case AlertLevel.CRITICAL:
        return "bg-red-100 text-red-800 border-red-200 animate-critical-pulse shadow-[0_0_10px_rgba(220,38,38,0.2)]";
      case AlertLevel.HIGH:
        return "bg-orange-100 text-orange-800 border-orange-200";
      case AlertLevel.MEDIUM:
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case AlertLevel.LOW:
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white">Safety Event Log</h1>
          <p className="text-gray-400 mt-1">
            History of all detected fleet incidents.
          </p>
        </div>
        <button
          onClick={fetchEvents}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium shadow-lg"
        >
          <RotateCw size={18} className={loading ? "animate-spin" : ""} />{" "}
          Refresh
        </button>
      </div>

      {/* Filters Section */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 mb-8">
        <div className="flex items-center gap-2 mb-3 text-gray-700 font-semibold border-b pb-2">
          <Filter size={18} /> Filter Options
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
              From Date
            </label>
            <input
              type="date"
              name="fromDate"
              value={filters.fromDate}
              onChange={handleFilterChange}
              className="w-full border border-gray-300 rounded-lg p-2 text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
              To Date
            </label>
            <input
              type="date"
              name="toDate"
              value={filters.toDate}
              onChange={handleFilterChange}
              className="w-full border border-gray-300 rounded-lg p-2 text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
              Min Severity
            </label>
            <select
              name="minLevel"
              value={filters.minLevel}
              onChange={handleFilterChange}
              className="w-full border border-gray-300 rounded-lg p-2 text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="">All Levels</option>
              <option value="1">Low</option>
              <option value="2">Medium</option>
              <option value="3">High</option>
              <option value="4">Critical</option>
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={() => setSearchParams({})}
              className="w-full py-2 bg-gray-50 hover:bg-gray-100 text-gray-600 font-semibold rounded-lg transition-colors border border-gray-200"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white shadow-xl overflow-hidden border border-gray-200 sm:rounded-2xl">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                Severity
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                Time
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                Driver/Vehicle
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                Message
              </th>
              <th className="relative px-6 py-4"></th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {data.map((event) => (
              <tr
                key={event.id}
                className="hover:bg-blue-50/30 transition-colors group"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-3 py-1 inline-flex text-xs leading-5 font-black rounded-full border ${getBadgeStyles(event.alertLevel ?? 0)}`}
                  >
                    {AlertLevelLabels[event.alertLevel ?? 0] || "Unknown"}
                  </span>
                </td>            
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-medium">
                  {new Date(event.timestamp).toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-bold text-gray-900">
                    {event.driverName}
                  </div>
                  <div className="text-xs text-blue-600 font-mono">
                    {event.vehiclePlate}
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500 italic max-w-xs truncate">
                  "{event.message}"
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <button
                    onClick={() => navigate(`/events/${event.id}`)}
                    className="px-4 py-1.5 bg-white border border-gray-200 text-gray-700 text-xs font-bold rounded-lg hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all shadow-sm"
                  >
                    Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="mt-6 flex justify-center gap-2">
        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm text-black font-medium disabled:opacity-50 hover:bg-gray-50"
        >
          Previous
        </button>
        <button
          onClick={() => setPage(page + 1)}
          className="px-4 py-2 bg-white border border-gray-300 text-blue-950 rounded-lg text-sm font-medium hover:bg-gray-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};
