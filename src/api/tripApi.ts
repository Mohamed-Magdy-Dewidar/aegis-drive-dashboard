import { api } from './axios'; // Path to your interceptor file

export const tripApi = {
    startTrip: async (data: {
        vehicleId: number;
        destinationText: string;
        destinationLat: number;
        destinationLng: number;
    }) => {
        const response = await api.post('fleet/trips/start', data);
        return response.data; 
    },

    endTrip: async (tripId: string) => {
        const response = await api.post(`fleet/trips/end/${tripId}`);
        return response.data;
    }
};