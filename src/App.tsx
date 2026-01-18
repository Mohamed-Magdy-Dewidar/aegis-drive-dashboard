import React from "react";
import { Toaster } from "react-hot-toast";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";

import { MainLayout } from "./components/layout/MainLayout";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { SignalRProvider } from "./context/SignalRContext";

import { LoginPage } from "./features/auth/LoginPage";
import { LiveMapPage } from "./features/map/LiveMapPage";
import { CriticalAlertPopup } from "./components/CriticalAlertPopup";

import { IncidentDetailsPage } from "./features/events/IncidentDetailsPage";
import { SafetyEventsLogPage } from "./features/events/SafetyEventsLogPage";
import { DashboardPage } from "./features/dashboard/DashboardPage";
import { FleetManagementPage } from "./features/fleet/FleetManagementPage";

// 🆕 Import the Trip Management Orchestrator
import { ActiveTripManager } from "./features/fleet/ActiveTripManager";
import { TripProvider } from "./context/TripProvider";

const ProtectedRoute = ({ children }: { children: React.ReactElement }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading)
    return (
      <div className="h-screen flex items-center justify-center bg-slate-950 text-white">
        Loading AegisDrive...
      </div>
    );
  if (!isAuthenticated)
    return <Navigate to="/login" state={{ from: location }} replace />;

  return <MainLayout>{children}</MainLayout>;
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <TripProvider>
        <SignalRProvider>
          <CriticalAlertPopup />
          <Toaster position="top-right" reverseOrder={false} />

          <Routes>
            <Route path="/login" element={<LoginPage />} />

            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />

            {/* 🆕 THE ACTIVE TRIP ROUTE */}
            <Route
              path="/drive"
              element={
                <ProtectedRoute>
                  <ActiveTripManager />
                </ProtectedRoute>
              }
            />

            <Route
              path="/map"
              element={
                <ProtectedRoute>
                  <LiveMapPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/events/:eventId"
              element={
                <ProtectedRoute>
                  <IncidentDetailsPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/logs"
              element={
                <ProtectedRoute>
                  <SafetyEventsLogPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/fleet/*"
              element={
                <ProtectedRoute>
                  <FleetManagementPage />
                </ProtectedRoute>
              }
            />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </SignalRProvider>
        </TripProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;