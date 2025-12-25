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

// Dummy Components
const Dashboard = () => (
  <div className="text-3xl font-bold p-10">Dashboard 📊</div>
);
const Fleet = () => (
  <div className="text-3xl font-bold p-10">Fleet Management 🚚</div>
);

const ProtectedRoute = ({ children }: { children: React.ReactElement }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading)
    return (
      <div className="h-screen flex items-center justify-center">
        Loading...
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
        <SignalRProvider>
          {/* Global Alert Components */}
          <CriticalAlertPopup />
          <Toaster position="top-right" reverseOrder={false} />

          <Routes>
            <Route path="/login" element={<LoginPage />} />

            <Route
              path="/events/:eventId"
              element={
                <ProtectedRoute>
                  <IncidentDetailsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Dashboard />
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
              path="/map"
              element={
                <ProtectedRoute>
                  <LiveMapPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/fleet"
              element={
                <ProtectedRoute>
                  <Fleet />
                </ProtectedRoute>
              }
            />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </SignalRProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
