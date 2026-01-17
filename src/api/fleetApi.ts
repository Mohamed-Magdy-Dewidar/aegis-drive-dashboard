// src/api/fleetApi.ts
import { api } from "./axios";
import {
  // Read Types
  type PagedResult,
  type FleetVehicleLiveStateResponse,
  type IncidentDetails,
  type SafetyEventsQuery,
  type SafetyEventSummary,
  type DashboardStats,
  type DriverProfile,
  type VehicleDetails,
  type CompanyDto,
  type DeviceDetails,
  // Query Types
  type DriverQuery,
  type VehicleQuery,
  // Write Types
  type RegisterCompanyRequest,
  type RegisterVehicleRequest,
  type UpdateVehicleRequest,
  type UpdateDriverRequest,
  type AddFamilyMemberRequest,
  type LinkDeviceRequest,
  type DriverDetails,
  type AssignedVehicle,
  type UnassignedVehicle,
  type FamilyMemberDto,
  type StartShiftRequest,
} from "../types";

export const fleetApi = {
  registerCompany: async (data: RegisterCompanyRequest) => {
    const response = await api.post("/auth/register", data);
    return response.data;
  },


  // =================================================================
  // 📊 ANALYTICS & MONITORING
  // =================================================================
  getDashboardStats: async (): Promise<DashboardStats> => {
    const response = await api.get<DashboardStats>("/analytics/dashboard");
    return response.data;
  },

  getLiveFleet: async () => {
    const response = await api.get<PagedResult<FleetVehicleLiveStateResponse>>(
      "/monitor/live"
    );
    console.log("/monitor/live -> " , response.data , response.data.items);
    return response.data.items;
  },

  getVehicleLiveLocation: async (id: number) => {
    const response = await api.get<FleetVehicleLiveStateResponse>(
      `/monitor/live/${id}`
    );
    return response.data;
  },

  getSafetyEvents: async (
    params: SafetyEventsQuery
  ): Promise<PagedResult<SafetyEventSummary>> => {
    const response = await api.get<PagedResult<SafetyEventSummary>>(
      "/safety-events",
      { params }
    );
    return response.data;
  },

  getIncidentDetails: async (id: string): Promise<IncidentDetails> => {
    const response = await api.get<IncidentDetails>(`/incidents/${id}`);
    return response.data;
  },

  // =================================================================
  // 🏢 COMPANIES
  // =================================================================
  getCompanies: async (): Promise<CompanyDto[]> => {
    const response = await api.get<CompanyDto[]>("/fleet/companies");
    return response.data;
  },

  // =================================================================
  // 👤 DRIVER MANAGEMENT
  // =================================================================
  getAllDrivers: async (params?: DriverQuery): Promise<PagedResult<DriverProfile>> => {
    const response = await api.get<PagedResult<DriverProfile>>(
      "/fleet/drivers",
      { params }
    );
    return response.data;
  },

  getDriverProfile: async (id: number): Promise<DriverProfile> => {
    const response = await api.get<DriverProfile>(`/fleet/drivers/${id}`);
    return response.data;
  },

  getDriverDetails: async (id: number): Promise<DriverDetails> => {
    const response = await api.get<DriverDetails>(`/fleet/drivers/${id}`);
    return response.data;
  },

  registerDriver: async (formData: FormData) => {
    const response = await api.post("/fleet/drivers", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },
  
  
  updateDriver: async (data: UpdateDriverRequest) => {
    if (!data.driverId) throw new Error("Driver ID is missing");
    const response = await api.put("/fleet/drivers", data);
    console.log(data);
    console.log("Response of update" , data);
    return response.data;

  },

  deleteDriver: async (id: number) => {
    const response = await api.delete(`/fleet/drivers/${id}`);
    return response.data;
  },

  uploadDriverImage: async (driverId: number, imageFile: File) => {
    const formData = new FormData();
    formData.append("image", imageFile);
    const response = await api.post(
      `/fleet/drivers/${driverId}/upload-image`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    return response.data;
  },

  // --- Driver Family Members ---
  getDriverFamilyMembers: async (driverId: number): Promise<FamilyMemberDto[]> => {
    const response = await api.get<FamilyMemberDto[]>(
      `/drivers/${driverId}/family-members`
    );
    return response.data;
  },

  addFamilyMember: async (driverId: number, data: AddFamilyMemberRequest) => {
    const response = await api.post(
      `/drivers/${driverId}/family-members`,
      data
    );
    return response.data;
  },

  // =================================================================
  // 🚛 VEHICLE MANAGEMENT
  // =================================================================
  getAllVehicles: async (params?: VehicleQuery): Promise<PagedResult<VehicleDetails>> => {
    const response = await api.get<PagedResult<VehicleDetails>>(
      "/fleet/vehicles",
      { params }
    );
    return response.data;
  },

  getVehicleDetails: async (id: number): Promise<VehicleDetails> => {
    const response = await api.get<VehicleDetails>(`/fleet/vehicles/${id}`);
    return response.data;
  },

 /**
   * Fetches vehicles that are NOT currently assigned.
   * Filters by driverId/companyId are handled by the backend token/query.
   */
 getUnassignedVehicles: async (params?: VehicleQuery): Promise<PagedResult<UnassignedVehicle>> => {
  const response = await api.get<PagedResult<UnassignedVehicle>>(
    "/fleet/vehicles/unassigned", 
    { params }
  );
  return response.data;
},

/**
 * Fetches vehicles that HAVE an active assignment.
 */
getAssignedVehicles: async (params?: VehicleQuery): Promise<PagedResult<AssignedVehicle>> => {
  const response = await api.get<PagedResult<AssignedVehicle>>(
    "/fleet/vehicles/assigned", 
    { params }
  );
  return response.data;
},

  registerVehicle: async (data: RegisterVehicleRequest) => {
    const response = await api.post("/fleet/vehicles", data);
    return response.data;
  },

  updateVehicle: async (id: number, data: UpdateVehicleRequest) => {
    const response = await api.put(`/fleet/vehicles/${id}`, data);
    return response.data;
  },

  deleteVehicle: async (id: number) => {
    const response = await api.delete(`/fleet/vehicles/${id}`);
    return response.data;
  },

  // =================================================================
  // 📅 SHIFT ASSIGNMENTS
  // =================================================================
  /**
   * ✅ POST /api/v1/fleet/assignments/start
   */
  startShift: async (data: StartShiftRequest) => {
    const response = await api.post("/fleet/assignments/start", data);
    return response.data;
  },

  /**
   * ✅ POST /api/v1/fleet/assignments/end/{vehicleId}
   */
  endShift: async (vehicleId: number) => {
    const response = await api.post(`/fleet/assignments/end/${vehicleId}`);
    return response.data;
  },

  // =================================================================
  // 🔌 DEVICES (IoT)
  // =================================================================
  linkDeviceToVehicle: async (vehicleId: number, data: LinkDeviceRequest) => {
    const response = await api.post(
      `/fleet/vehicles/${vehicleId}/link-device`,
      data
    );
    return response.data;
  },

  getDeviceDetails: async (deviceId: string): Promise<DeviceDetails> => {
    const response = await api.get<DeviceDetails>(`/fleet/devices/${deviceId}`);
    return response.data;
  },
};
