import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

interface AuthContextType {
    verifySession: () => Promise<boolean>;
    isAuthenticated: boolean;
    register: (fullName: string, email: string, password: string) => Promise<string | null>
    login: (email: string, password: string) => Promise<string | null>;
    logout: () => Promise<void>
    loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const api_url = import.meta.env.VITE_API_URL;

export function AuthProvider({ children } : {children: ReactNode}) {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);

    const verifySession = async () => {
        try {
            const response = await fetch(`${api_url}/Account/me`, {
                method: 'GET',
                credentials: 'include'
            });

            if(response.ok) {
                setIsAuthenticated(true);
                return true;
            }
            else {
                setIsAuthenticated(false);
                return false;
            }
        }
        catch(err) {
            console.error("Authentication check failed ", err);
            setIsAuthenticated(false);
            return false;
        }
        finally {
            setLoading(false);
        }
    };

    useEffect(() => { verifySession(); }, []);

    const login = async (username: string, password: string) => {
        try {
            const response = await fetch(`${api_url}/Login/login`, {
                method: `POST`,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userName: username, password }),
                credentials: 'include'
            });

            if(response.ok) {
                setIsAuthenticated(true);
                return null;
            }

            try {
                const data = await response.json();
                if(data.description) return data.description;
            } catch {}

            if(response.status === 401) return 'Invalid username or password';
            return 'Something went wrong, please try again';

        } catch(error) {
            console.error("Network error: ", error);
            return 'Could not connect to the server';
        }
    }

    const register = async (username: string, email: string, password: string) => {
        try {
            const response = await fetch(`${api_url}/Account/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, email, userName: username, password })
            });
            if(response.ok) return null;

            try {
                const data = await response.json();
                if(data.description) return data.description;
            } catch {}

            return 'Something went wrong, please try again';
        } catch { return 'Could not connect to the server'; }
    }

    const logout = async () => {
        try {
            await fetch(`${api_url}/Login/logout`, {method: 'POST', credentials: 'include'});
        } finally {
            setIsAuthenticated(false);
        }
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, register, logout, loading, verifySession }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if(!context) throw new Error('useAuth have to be used withing AuthProvider');
    return context;
}