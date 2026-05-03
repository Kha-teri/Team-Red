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
const api_url = import.meta.env.VITE_API_URL;

export function AuthProvider({ children } : {children: ReactNode}) {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const verifySession = async () => {
            try {
                const response = await fetch(`${api_url}/Account/me`, {
                    method: 'GET',
                    credentials: 'include'
                });

                if(response.ok) {
                    setIsAuthenticated(true);
                    localStorage.setItem("isLoggedIn", 'true');
                }
                else {
                    setIsAuthenticated(false);
                    localStorage.removeItem('isLoggedIn');
                }
            }
            catch(err) {
                console.error("Authentication check failed ", err);
                setIsAuthenticated(false);
            }
            finally {
                setLoading(false);
            }
        };
        verifySession();
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

    const register = async (username: string, email: string, password: string) => {
        try {
            const response = await fetch(`${api_url}/Account/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, email, userName: username, password })
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