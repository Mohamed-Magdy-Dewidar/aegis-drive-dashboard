import { api } from './axios';
import { 
  type LoginRequest, 
  type LoginResponse, 
  type RegisterRequest, 
  type User 
} from '../types';

export const authApi = {
  
  // 1. LOGIN
  login: async (credentials: LoginRequest) => {
    const response = await api.post<LoginResponse>('/auth/login', credentials);
    const data = response.data;

    if (!data.token) {
      throw new Error("Login failed: No token received.");
    }

    // Return the token so AuthContext can use it
    return {
      token: data.token
    };
  },

  // 2. REGISTER
  register: async (data: RegisterRequest) => {
    const response = await api.post('/auth/register', data);
    return response.data;
  },

  // 3. GET CURRENT USER (/users/me)
  // Your C# code returns Results.Ok(result.Value), which serializes the User object directly.
  getMe: async (): Promise<User> => {
    const response = await api.get<User>('/users/me');
    return response.data;
  }
};