export interface ApiResult<T> {
  value?: T;
  isSuccess: boolean;
  error?: string;
}

export interface PagedResult<T> {
  items: T[];
  totalItems: number;
  page: number;
  pageSize: number;
}

// AegisDrive.Api.Entities.Enums.AlertLevel




export const AlertLevel = {
   NONE: 0,
   LOW: 1,
   MEDIUM: 2,
   HIGH: 3,
   CRITICAL: 4
} as const;
  
export type AlertLevel = typeof AlertLevel[keyof typeof AlertLevel];
  
  // ✅ 3. Add a helper for labels (Since const objects don't support reverse mapping like Enums do)
export const AlertLevelLabels: Record<number, string> = {
   [AlertLevel.NONE]: "NONE",
   [AlertLevel.LOW]: "LOW",
   [AlertLevel.MEDIUM]: "MEDIUM",
   [AlertLevel.HIGH]: "HIGH",
   [AlertLevel.CRITICAL]: "CRITICAL",
};


// AegisDrive.Api.Entities.Enums.Driver.DriverState
export const DriverState = {
  ALERT:0,
  DROWSY:1,
  YAWNING:2,
  DROWSY_YAWNING:3,
  DISTRACTED:4,
  DROWSY_DISTRACTED:5,
  NO_FACE_DETECTED:6
} as const;
export type DriverState = typeof DriverState[keyof typeof DriverState];

// AegisDrive.Api.Entities.Enums.VehicleStatus
export const VehicleStatus = {
  ACTIVE: 0,
  MAINTENANCE: 1,
  OFFLINE: 2,
  IN_ACCIDENT: 3
} as const;
export type VehicleStatus = typeof VehicleStatus[keyof typeof VehicleStatus];

// AegisDrive.Api.Entities.Enums.Device.DeviceType
export const DeviceType = {
  RaspberryPi:0,
  Esp32:1
} as const;
export type DeviceType = typeof DeviceType[keyof typeof DeviceType];



export interface User {
  id: string;
  fullName: string;
  email: string;
  role: "Admin" | "Manager" | "Individual";
}

export interface LoginRequest {
  email?: string;
  password?: string;
}

export interface RegisterRequest {
  email?: string;
  password?: string;
  fullName?: string;
  accountType?: string; // "Manager" | "Individual"
  companyName?: string;
}

export interface AuthResponse {
  token: string;
  expiresIn: number;
  user: User;
}

export interface DriverDetails {
  fullName: string;
  phoneNumber: string;
  email?: string;
  isActive: boolean;
  
  // ✅ PATCH: Match the backend typo exactly so data binds correctly
  safteyScore: number; 
  
  pictureUrl?: string;
  driverCompany?: CompanyDto | null; // Allow null
  driverFamilyMembers: FamilyMemberDto[];
}

export interface CompanyDto {
  name: string;
  representativeName?: string;
  representativeEmail?: string;
  representativePhone?: string;
}

export interface FamilyMemberDto {
  fullName: string;
  phoneNumber: string;
  email?: string;
  relationship?: string;
  notifyOnCritical: boolean;
}


export interface Vehicle {
  id: number;
  plateNumber: string;
  model: string;
  status: VehicleStatus;
  companyId?: number;
}

export interface RegisterVehicleRequest {
  plateNumber?: string;
  model?: string;
  companyId?: string;
}

export interface UpdateVehicleRequest {
  vehicleId: number;
  plateNumber?: string;
  model?: string;
  status: VehicleStatus;
}

export interface LinkDeviceRequest {
  deviceId?: string;
  type: DeviceType;
}

export interface StartShiftRequest {
  driverId: number;
  vehicleId: number;
}


// src/types/index.ts
export interface DriverProfile {
  driverId: number; 
  fullName: string;
  phoneNumber: string;
  email: string;
  isActive: boolean; 
  safetyScore: number;  
  companyName?: string; 
  pictureUrl?: string;  
  companyId?: number; 
}



// For GET /api/v1/fleet/drivers pagination
export interface DriverQuery {
  companyId?: number;
  driverId? : number;
  isActive?: boolean;
  page?: number;
  pageSize?: number;
}



export interface UnassignedVehicle {
  id: number;
  plateNumber: string;
  model: string;
  status: string; // Defaults to "Available"
}

export interface AssignedVehicle {
  id: number;
  plateNumber: string;
  model: string;
  currentDriverName: string;
  currentDriverId: number;
  shiftStartedAt: string; // DateTime from C# comes as ISO string
}

// For GET /api/v1/fleet/vehicles pagination
export interface VehicleQuery {
  companyId?: number;
  status?: VehicleStatus;
  page?: number;
  pageSize?: number;
}

export interface UpdateDriverRequest {
  driverId: number;
  fullName?: string;    // Matches string? FullName
  phoneNumber?: string; // Matches string? PhoneNumber
  email?: string;       // Matches string? Email
  companyId?: string | number; // Matches string? CompanyId
}



export interface AddFamilyMemberRequest {
  fullName?: string;
  phoneNumber?: string;
  email?: string;
  relationship?: string;
  notifyOnCritical: boolean;
}


// AegisDrive.Api.Contracts.Telemetry.IngestTelemetryRequest
export interface IngestTelemetryRequest {
  deviceId?: string;
  latitude: number;
  longitude: number;
  speedKmh: number;
  eventType?: string;
  timestamp: string; // ISO String
}

// AegisDrive.Api.Features.SafetyEvents.CreateSafetyEvent_Command
export interface CreateSafetyEventCommand {
  eventId: string; // UUID
  message?: string;
  earValue?: number;
  marValue?: number;
  headYaw?: number;
  driverState: DriverState;
  alertLevel: AlertLevel;
  s3DriverImagePath?: string;
  s3RoadImagePath?: string;
  roadHasHazard: boolean;
  roadVehicleCount: number;
  roadPedestrianCount: number;
  roadClosestDistance?: number;
  timestamp: string;
  deviceId?: string;
  vehicleId?: number;
  driverId?: number;
  companyId?: number;
}

export interface SafetyEventsQuery {
  driverId?: number;
  companyId?: number;
  fromDate?: string;
  toDate?: string;
  minLevel?: AlertLevel;
  page?: number;
  pageSize?: number;
}

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
  
  

export interface DashboardStats {
  totalAlerts: number;
  safetyScore: number;
  activeVehicles: number;
  drowsinessEvents: number;
  distractionEvents: number;
  alertsByDay: { date: string; count: number }[];
}

// Matches C# FleetLiveLocationResponse
export interface FleetLiveLocationResponse {
  latitude: number;
  longitude: number;
  speedKmh: number;
  lastUpdateUtc: string;
}

// RESTORED: Matches C# FleetVehicleLiveStateResponse
export interface FleetVehicleLiveStateResponse {
  vehicleId: number;
  plateNumber: string;
  status: string; // "Active", "Maintenance", etc.
  liveLocation?: FleetLiveLocationResponse | null;
}

// RESTORED: Full details for the Evidence Feed
export interface IncidentDetails {
  id: string; // UUID
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

// SignalR Hub Helper
export interface VehicleTelemetryUpdate {
  vehicleId: number;
  plateNumber: string;
  latitude: number;
  longitude: number;
  speedKmh: number;
  eventType: string;
  timestamp: string;
}


// RESTORED: Legacy LoginResponse structure
export interface LoginResponse {
  token: string;
  fullName: string;
  role: "Admin" | "Manager" | "Individual";
  companyId?: number;
}



// RESTORED: Specifically for Manager/Company signup flow
export interface RegisterCompanyRequest {
  fullName: string;
  email: string;
  password: string;
  companyName: string;
  accountType: "Manager"; 
}

// RESTORED: Comprehensive vehicle data
export interface VehicleDetails {
  id: number;
  plateNumber: string;
  model: string;
  status: string;
  companyId?: number;
  currentDriverId?: number;
  currentDriverName?: string;
}

// RESTORED: Metadata for IoT Device context
export interface DeviceDetails {
  deviceId: string;
  vehicleId?: number;
  vehiclePlate?: string;
  status: string;
  lastHeartbeat?: string;
}
