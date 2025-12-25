// User Profile (Matches your GetCurrentUser C# Response)
export interface User {
  id: string;
  fullName: string;
  email: string;
  role: "Admin" | "Manager" | "Individual";
  companyId?: number;
  driverId?: number;

  //C# Class
  //     string Id,
  // string FullName,
  // string Email,
  // string Role,
  // string? AvatarUrl,
  // int? DriverId,     // For linking to Driver Profile
  // int? CompanyId     // For linking to Company Dashboard
}

// Auth Response (Matches your Login C# Response)
export interface AuthResponse {
  token: string;
  expiresIn: number;
  user: User;
}

// Vehicle (Matches your C# Entity)
export interface Vehicle {
  id: number;
  plateNumber: string;
  model: string;
  status: "Active" | "Maintenance" | "Offline";
  currentDriverId?: number;
  companyId?: number;
}

export interface LoginRequest {
  email?: string;
  password?: string;
}

export interface LoginResponse {
  token: string;
  fullName: string;
  role: "Admin" | "Manager" | "Individual";
  companyId?: number;
}

// 1. Location Data (Matches C# FleetLiveLocationResponse)
export interface FleetLiveLocationResponse {
  latitude: number;
  longitude: number;
  speedKmh: number;
  lastUpdateUtc: string;
}


// 3. Helper for SignalR (The flat update we receive from the Hub)
export interface VehicleTelemetryUpdate {
  vehicleId: number;
  plateNumber: string;
  latitude: number;
  longitude: number;
  speedKmh: number;
  eventType: string;
  timestamp: string;
}
// 2. Vehicle State (Matches C# FleetVehicleLiveStateResponse)
export interface FleetVehicleLiveStateResponse {
  vehicleId: number;
  plateNumber: string;
  status: string;
  liveLocation?: FleetLiveLocationResponse | null; // Nullable as per C#
}

export interface CriticalAlertNotification {
  eventId: string; // Guid matches string in TS
  plateNumber: string;
  driverState: string; // e.g., "Microsleep"
  alertLevel: string;
  message: string;
  mapLink: string;
  speedKmh: number;
  timestamp: string;
  driverImageUrl?: string | null; // Nullable
}

// ⚠️ Matches C# HighAlertNotification
export interface HighAlertNotification {
  eventId: string;
  plateNumber: string;
  driverState: string; // e.g., "Drowsy"
  alertLevel: string;
  message: string;
  mapLink: string;
  speedKmh: number;
  timestamp: string;
  driverImageUrl?: string | null;
}












// 1. Standard Enum (Fixes the "Property 'Critical' does not exist" error)
// ✅ 1. Define the values as a standard JavaScript constant
export const AlertLevel = {
  NONE: 0,
  LOW: 1,
  MEDIUM: 2,
  HIGH: 3,
  CRITICAL: 4
} as const;

// ✅ 2. Extract the Type from the constant
// This lets you use 'AlertLevel' as a type (e.g. minLevel: AlertLevel)
export type AlertLevel = typeof AlertLevel[keyof typeof AlertLevel];

// ✅ 3. Add a helper for labels (Since const objects don't support reverse mapping like Enums do)
export const AlertLevelLabels: Record<number, string> = {
  [AlertLevel.NONE]: "NONE",
  [AlertLevel.LOW]: "LOW",
  [AlertLevel.MEDIUM]: "MEDIUM",
  [AlertLevel.HIGH]: "HIGH",
  [AlertLevel.CRITICAL]: "CRITICAL",
};

// 2. Generic Paged Result (Matches your C# backend structure)
export interface PagedResult<T> {
  items: T[];
  totalItems: number; // Backend usually returns this at root
  page: number;
  pageSize: number;
  totalPages?: number;
}

// 3. API Models
export interface SafetyEventSummary {
  id: string;
  message: string;
  driverState: number;
  alertLevel?: AlertLevel; // Uses the Enum
  s3DriverImagePath: string;
  s3RoadImagePath: string;
  timestamp: string;
  vehiclePlate: string;
  driverName: string;
}

export interface IncidentDetails {
  id: string;
  message: string;
  earValue?: number;
  marValue?: number;
  headYaw?: number;
  roadHasHazard: boolean;
  roadVehicleCount: number;
  roadPedestrianCount: number;
  roadClosestDistance?: number;
  timestamp: string;
  deviceId: string;
  vehicleId?: number;
  vehiclePlate?: string;
  driverId?: number;
  driverFullName?: string;
  alertLevel?: AlertLevel;
  driverState: number;
  s3DriverImagePath: string;
  s3RoadImagePath: string;
}

export interface SafetyEventsQuery {
  driverId?: number;
  companyId?: number;
  fromDate?: string;
  toDate?: string;
  minLevel?: AlertLevel; // Allow passing the enum number
  page?: number;
  pageSize?: number;
}





  
