import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

interface AuthContextType {
    isAuthenticated: boolean;
    register: (fullName: string, email: string, password: string) => Promise<boolean>
    login: (email: string, password: string) => Promise<boolean>;
    logout: () => Promise<void>
    loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const api_url = 'https://team-red-api.azurewebsites.net/api';

export function AuthProvider({ children } : {children: ReactNode}) {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const loggedIn = localStorage.getItem('isLoggedIn');
        if(loggedIn === 'true')
            setIsAuthenticated(true);
        setLoading(false);
    }, []);

    const login = async (username: string, password: string) => {
        try {
            const response = await fetch(`${api_url}/Login/login`, {
                method: `POST`,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userName: username, password }),
                credentials: 'include'
            });

            if(response.ok) {
                localStorage.setItem('isLoggedIn', 'true');
                setIsAuthenticated(true);
                return true;
            }

            console.error("Login failed with status:", response.status);
            return false;

        } catch(error) { 
            console.error("Network error: ", error);
            return false; 
        }
    }

    const register = async (fullName: string, email: string, password: string) => {
        try {
            const response = await fetch(`${api_url}/Account/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ fullName, email, userName: email, password })
            });
            return response.ok;
        } catch { return false; }
    }

    const logout = async () => {
        try {
            await fetch(`${api_url}/Login/logout`, {method: 'POST', credentials: 'include'});
        } finally {
            localStorage.removeItem('isLoggedIn');
            setIsAuthenticated(false);
        }
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, register, logout, loading}}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if(!context) throw new Error('useAuth have to be used withing AuthProvider');
    return context;
}