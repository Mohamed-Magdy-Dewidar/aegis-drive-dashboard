import axios from 'axios';
import { API_URL } from '../config';

export const api = axios.create({
    baseURL: API_URL, 
    headers: {
        'Content-Type': 'application/json',
    },
});

// 1. Request Interceptor: Attach Token
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('aegis_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// 2. Response Interceptor: Handle Token Expiry
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Token expired -> Clear storage & redirect
            localStorage.removeItem('aegis_token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);