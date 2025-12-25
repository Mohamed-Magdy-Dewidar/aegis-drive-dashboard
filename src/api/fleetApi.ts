import { api } from './axios';
import { 
  type IncidentDetails, 
  type FleetVehicleLiveStateResponse,
  type SafetyEventsQuery, 
  type PagedResult, 
  type SafetyEventSummary 
} from '../types';

export const fleetApi = {
    // SCENARIO 1: Main Map
    getLiveFleet: async () => {
        // We use the imported PagedResult
        const response = await api.get<PagedResult<FleetVehicleLiveStateResponse>>('/monitor/live');
        console.log("🚀 FLEET API RESPONSE:", response.data);
        return response.data.items; 
    },

    // SCENARIO 2: Single Vehicle
    getVehicleLiveLocation: async (id: number) => {
        const response = await api.get<FleetVehicleLiveStateResponse>(`/monitor/live/${id}`);
        console.log(`🚗 SINGLE VEHICLE (${id}) RESPONSE:`, response.data);
        return response.data;
    },

    getIncidentDetails: async (id: string): Promise<IncidentDetails> => {
        const response = await api.get<IncidentDetails>(`/incidents/${id}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("aegis_token")}`,
            },
        });
        return response.data;
    },

    getSafetyEvents: async (params: SafetyEventsQuery): Promise<PagedResult<SafetyEventSummary>> => {
        const response = await api.get<PagedResult<SafetyEventSummary>>(`/safety-events`, {
            params,
            headers: {
                Authorization: `Bearer ${localStorage.getItem("aegis_token")}`,
            },
        });
        return response.data;
    },
};