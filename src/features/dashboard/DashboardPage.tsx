// src/features/dashboard/DashboardPage.tsx

import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import {
  ShieldCheck,
  AlertTriangle,
  Truck,
  Activity,
  Clock,
} from "lucide-react";
import { fleetApi } from "../../api/fleetApi";
import { type DashboardStats } from "../../types";
import toast from "react-hot-toast";

export const DashboardPage = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await fleetApi.getDashboardStats();
        console.log("Stats Data:", data); // Debugging
        setStats(data);
      } catch (error) {
        console.error("Failed to load dashboard stats", error);
        toast.error("Could not load dashboard data.");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!stats) return <div className="p-8 text-center">No data available.</div>;

  // 1. Prepare Pie Chart Data (Types)
  const pieData = [
    { name: "Drowsiness", value: stats.drowsinessEvents },
    { name: "Distraction", value: stats.distractionEvents },
  ];
  const PIE_COLORS = ["#EF4444", "#F59E0B"]; // Red & Orange

  // 2. Prepare Bar Chart Data (Severity)
  // Since we have severity counts, let's visualize that
  const severityData = [
    { name: "Critical", count: stats.criticalCount, fill: "#DC2626" }, // Red-600
    { name: "High", count: stats.highCount, fill: "#F59E0B" }, // Orange-500
    { name: "Medium", count: stats.mediumCount, fill: "#3B82F6" }, // Blue-500
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      <div className="flex justify-between items-end">
        <div>
          {/* text-gray-900 -> text-white */}
          <h1 className="text-3xl font-bold text-white">
            Fleet Safety Overview
          </h1>

          {/* text-gray-500 -> text-gray-400 (lighter gray) */}
          <p className="text-gray-400 mt-1">
            Real-time analytics and safety metrics.
          </p>
        </div>

        {/* text-gray-400 -> text-gray-300 (even lighter for readability) */}
        <div className="text-sm text-gray-300 flex items-center gap-1">
          <Clock size={14} /> Updated:{" "}
          {new Date(stats.lastUpdated).toLocaleTimeString()}
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Card 1: Safety Score & Level */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 relative overflow-hidden">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">Safety Score</p>
              <div className="flex items-baseline gap-2 mt-1">
                <span
                  className={`text-3xl font-bold ${
                    stats.safetyScore > 80 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {stats.safetyScore}%
                </span>
                <span
                  className={`text-xs px-2 py-1 rounded-full font-semibold uppercase tracking-wide 
                  ${
                    stats.safetyLevel === "Critical"
                      ? "bg-red-100 text-red-700"
                      : "bg-green-100 text-green-700"
                  }`}
                >
                  {stats.safetyLevel}
                </span>
              </div>
            </div>
            <div
              className={`p-3 rounded-full ${
                stats.safetyScore > 80
                  ? "bg-green-100 text-green-600"
                  : "bg-red-50 text-red-600"
              }`}
            >
              <ShieldCheck size={24} />
            </div>
          </div>
        </div>

        {/* Card 2: Total Incidents (With Breakdown) */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">
                Weekly Incidents
              </p>
              <p className="text-3xl font-bold text-gray-900 mt-1">
                {stats.totalEventsThisWeek}
              </p>
              <div className="text-xs text-gray-400 mt-1">
                <span className="text-red-600 font-bold">
                  {stats.criticalCount} Critical
                </span>{" "}
                • {stats.mediumCount} Medium
              </div>
            </div>
            <div className="p-3 rounded-full bg-red-100 text-red-600">
              <AlertTriangle size={24} />
            </div>
          </div>
        </div>

        {/* Card 3: Active Vehicles (Utilization) */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">
                Fleet Utilization
              </p>
              <div className="flex items-end gap-1 mt-1">
                <p className="text-3xl font-bold text-gray-900">
                  {stats.activeVehicles}
                </p>
                <p className="text-gray-400 mb-1">
                  / {stats.totalVehicles} Active
                </p>
              </div>
            </div>
            <div className="p-3 rounded-full bg-blue-100 text-blue-600">
              <Truck size={24} />
            </div>
          </div>
        </div>

        {/* Card 4: Drowsiness Events */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">
                Fatigue Detected
              </p>
              <p className="text-3xl font-bold text-gray-900 mt-1">
                {stats.drowsinessEvents}
              </p>
            </div>
            <div className="p-3 rounded-full bg-purple-100 text-purple-600">
              <Activity size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Severity Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 lg:col-span-2 flex flex-col">
          <h3 className="text-lg font-bold text-gray-800 mb-6">
            Incidents by Severity
          </h3>
          {/* ✅ FIXED: Added explicit height container */}
          <div className="w-full h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={severityData} layout="vertical">
                <CartesianGrid
                  strokeDasharray="3 3"
                  horizontal={true}
                  vertical={false}
                />
                <XAxis type="number" allowDecimals={false} />
                <YAxis dataKey="name" type="category" width={80} />
                <Tooltip
                  cursor={{ fill: "transparent" }}
                  contentStyle={{
                    borderRadius: "8px",
                    border: "none",
                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                  }}
                />
                <Bar dataKey="count" radius={[0, 4, 4, 0]} barSize={30}>
                  {severityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right: Pie Chart (Breakdown) */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex flex-col">
          <h3 className="text-lg font-bold text-gray-800 mb-2">
            Drowsiness vs Distraction
          </h3>
          {/* ✅ FIXED: Added explicit height container */}
          <div className="w-full h-64">
            {stats.totalEventsThisWeek === 0 ? (
              <div className="h-full flex items-center justify-center text-gray-400 text-sm">
                No incidents recorded
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={PIE_COLORS[index % PIE_COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
