/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { type User } from '../types';
import { authApi } from '../api/authApi';
import { api } from '../api/axios';

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (token: string, user: User) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Check for token on app startup
    useEffect(() => {
        const initAuth = async () => {
            const token = localStorage.getItem('aegis_token');
            if (token) {
                try {
                    // Manually set header here because interceptor might not run yet
                    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                    
                    const userData = await authApi.getMe();
                    setUser(userData);
                } catch (error) {
                    console.error("Session expired", error);
                    localStorage.removeItem('aegis_token');
                }
            }
            setIsLoading(false);
        };

        initAuth();
    }, []);

    const login = (token: string, newUser: User) => {
        localStorage.setItem('aegis_token', token);
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        setUser(newUser);
    };

    const logout = () => {
        localStorage.removeItem('aegis_token');
        delete api.defaults.headers.common['Authorization'];
        setUser(null);
        window.location.href = '/login';
    };

    return (
        <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom Hook
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within an AuthProvider");
    return context;
};