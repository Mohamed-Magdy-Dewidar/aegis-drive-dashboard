import { api } from './axios';
import { type User, type LoginRequest } from '../types';

export const authApi = {
    login: async (credentials: LoginRequest) => {
        // 1. Get the raw response (It's not wrapped in Result<T>)
        const response = await api.post<any>('/auth/login', credentials);
        
        console.log("🔥 SERVER SENT:", response.data);

        // 2. Map the "Flat" response to the structure our App expects
        // The server returns: { token, fullName, role, companyId }
        const serverData = response.data;

        if (!serverData.token) {
            throw new Error("Login succeeded but no token was returned.");
        }

        // Construct the User object manually
        const user: User = {
            id: "from-token", // We will extract the real ID from the token later if needed
            fullName: serverData.fullName,
            email: credentials.email || "",
            role: serverData.role,
            companyId: serverData.companyId
        };

        // Return the format our LoginPage expects
        return {
            token: serverData.token,
            user: user
        };
    },

    getMe: async () => {
        // Keep this check for "getMe" in case the user endpoint DOES use the wrapper.
        // If "getMe" also returns a flat object, remove the '.value' part below.
        const response = await api.get<any>('/users/me');
        return response.data.value || response.data; 
    }
};