import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { fleetApi } from "../../api/fleetApi";
import {
  type SafetyEventSummary,
  type SafetyEventsQuery,
  AlertLevel,
  AlertLevelLabels,
} from "../../types";
import { Filter, RotateCw } from "lucide-react";

export const SafetyEventsLogPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<SafetyEventSummary[]>([]);

  // Pagination State
  const [page, setPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const pageSize = 10;

  // Filter State
  const [filters, setFilters] = useState<{
    fromDate: string;
    toDate: string;
    minLevel: string;
  }>({
    fromDate: "",
    toDate: "",
    minLevel: "",
  });

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
      setTotalItems(result.totalItems);
    } catch (error) {
      console.error("Fetch error", error);
      toast.error("Failed to load safety log.");
    } finally {
      setLoading(false);
    }
  }, [page, filters]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const handleFilterChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
    setPage(1);
  };

  // Helper for Badge Colors
  const getBadgeColor = (level: AlertLevel) => {
    switch (level) {
      case AlertLevel.CRITICAL:
        return "bg-red-100 text-red-800 border-red-200";
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
      {/* ✅ HEADER: Fixed to be White text */}
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
          <RotateCw size={18} /> Refresh
        </button>
      </div>
      {/* --- Filters with New Styling --- */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 mb-8">
        <div className="flex items-center gap-2 mb-3 text-gray-700 font-semibold border-b pb-2">
          <Filter size={18} /> Filter Options
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* From Date */}
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
          {/* To Date */}
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
          {/* Min Severity */}
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
          {/* Apply Filters Button */}
          <div className="flex items-end">
            <button
              onClick={fetchEvents}
              className="w-full py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold rounded-lg transition-colors border border-gray-300"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </div>

      {/* --- Table --- */}
      <div className="bg-white shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
        {loading ? (
          <div className="p-10 text-center text-gray-500">
            Loading events...
          </div>
        ) : data.length === 0 ? (
          <div className="p-10 text-center text-gray-500">
            No events found for these filters.
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Severity
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Time
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Driver / Vehicle
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Message
                </th>
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">View</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.map((event) => (
                <tr
                  key={event.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    {/* ✅ FIX: Use '?? 0' to handle undefined values safely */}
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full border ${getBadgeColor(
                        event.alertLevel ?? 0
                      )}`}
                    >
                      {AlertLevelLabels[event.alertLevel ?? 0] || "Unknown"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(event.timestamp).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {event.driverName}
                    </div>
                    <div className="text-sm text-gray-500">
                      {event.vehiclePlate}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {event.message}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => navigate(`/events/${event.id}`)}
                      className="text-brand-primary hover:text-brand-dark font-bold"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* --- Pagination Footer --- */}
      <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6 mt-4 rounded-lg shadow-sm">
        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700">
              Showing{" "}
              <span className="font-medium">{(page - 1) * pageSize + 1}</span>{" "}
              to{" "}
              <span className="font-medium">
                {Math.min(page * pageSize, totalItems)}
              </span>{" "}
              of <span className="font-medium">{totalItems}</span> results
            </p>
          </div>
          <div>
            <nav
              className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
              aria-label="Pagination"
            >
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                onClick={() => setPage((p) => p + 1)}
                disabled={page * pageSize >= totalItems}
                className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </nav>
          </div>
        </div>
      </div>
      
    </div>
  );
};
