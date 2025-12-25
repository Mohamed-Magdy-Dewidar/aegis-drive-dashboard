/* eslint-disable react-refresh/only-export-components */
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
} from "react";
import * as signalR from "@microsoft/signalr";
import toast from "react-hot-toast";
import { fleetApi } from "../api/fleetApi";
import { HUB_URL } from "../config";
import { useAuth } from "./AuthContext";
import {
  type FleetVehicleLiveStateResponse,
  type VehicleTelemetryUpdate,
  type CriticalAlertNotification,
  type HighAlertNotification,
} from "../types";

// Interface for the Context
interface SignalRContextType {
  connection: signalR.HubConnection | null;
  isConnected: boolean;
  vehicleStates: Map<number, FleetVehicleLiveStateResponse>;

  // Alert State for Popups
  criticalAlert: CriticalAlertNotification | null;
  dismissCriticalAlert: () => void;
}

const SignalRContext = createContext<SignalRContextType | undefined>(undefined);

export const SignalRProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();

  const [connection, setConnection] = useState<signalR.HubConnection | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  
  // State for Vehicle Map Data
  const [vehicleStates, setVehicleStates] = useState<Map<number, FleetVehicleLiveStateResponse>>(new Map());

  // State for Critical Alert Popup
  const [criticalAlert, setCriticalAlert] = useState<CriticalAlertNotification | null>(null);

  const isConnecting = useRef(false);

  // 1. Load initial fleet data via API
  useEffect(() => {
    if (!user?.email) return;

    const fetchInitialState = async () => {
      try {
        const initialData = await fleetApi.getLiveFleet();
        setVehicleStates((prev) => {
          const newMap = new Map(prev);
          initialData.forEach((v) => newMap.set(v.vehicleId, v));
          return newMap;
        });
      } catch (error) {
        console.error("Failed to load initial fleet state", error);
      }
    };
    fetchInitialState();
  }, [user?.email]);

  // 2. Setup SignalR Connection Object
  useEffect(() => {
    if (!user?.email || isConnecting.current) return;

    isConnecting.current = true;

    const newConnection = new signalR.HubConnectionBuilder()
      .withUrl(HUB_URL, {
        accessTokenFactory: () => localStorage.getItem("aegis_token") || "",
      })
      .withAutomaticReconnect()
      .build();

    // ✅ FIX: setTimeout avoids "calling setState synchronously within an effect" error
    setTimeout(() => {
      setConnection(newConnection);
    }, 0);

    return () => {
      isConnecting.current = false;
      newConnection.stop();
    };
  }, [user?.email]);

  // 3. Start Connection and Listen for Events
  useEffect(() => {
    if (!connection) return;

    const startConnection = async () => {
      if (connection.state === signalR.HubConnectionState.Connected) return;

      try {
        await connection.start();
        console.log("🟢 SignalR Connected!");
        setIsConnected(true);

        // --- Event 1: Vehicle Telemetry ---
        connection.on("ReceiveVehicleUpdate", (update: VehicleTelemetryUpdate) => {
          setVehicleStates((prev) => {
            const newMap = new Map(prev);
            const updatedState: FleetVehicleLiveStateResponse = {
              vehicleId: update.vehicleId,
              plateNumber: update.plateNumber,
              status: "Active",
              liveLocation: {
                latitude: update.latitude,
                longitude: update.longitude,
                speedKmh: update.speedKmh,
                lastUpdateUtc: update.timestamp,
              },
            };
            newMap.set(update.vehicleId, updatedState);
            return newMap;
          });
        });

        // --- Event 2: Critical Alerts (Triggers Popup) ---
        connection.on("ReceiveCriticalAlert", (alert: CriticalAlertNotification) => {
          console.log("🚨 Critical Alert:", alert);
          
          // A. Trigger the Modal
          setCriticalAlert(alert);

          // B. Show backup Toast
          toast.error(`CRITICAL: ${alert.message}`, {
             duration: 5000,
             position: "top-center"
          });
        });

        // --- Event 3: High Alerts (Toast Only) ---
        connection.on("ReceiveHighLevelAlert", (alert: HighAlertNotification) => {
          console.warn("⚠️ High Alert:", alert);
          toast(alert.message, {
            icon: '⚠️',
            style: { border: '1px solid #f97316', padding: '16px', color: '#c2410c' },
          });
        });

      } catch (err) {
        console.error("🔴 SignalR Connection Error: ", err);
        setIsConnected(false);
      }
    };

    startConnection();

    return () => {
      connection.off("ReceiveVehicleUpdate");
      connection.off("ReceiveCriticalAlert");
      connection.off("ReceiveHighLevelAlert");
    };
  }, [connection]);

  const dismissCriticalAlert = () => {
    setCriticalAlert(null);
  };

  return (
    <SignalRContext.Provider value={{ 
      connection, 
      isConnected, 
      vehicleStates,
      criticalAlert, 
      dismissCriticalAlert 
    }}>
      {children}
    </SignalRContext.Provider>
  );
};

export const useSignalR = () => {
  const context = useContext(SignalRContext);
  if (!context) throw new Error("useSignalR must be used within SignalRProvider");
  return context;
};