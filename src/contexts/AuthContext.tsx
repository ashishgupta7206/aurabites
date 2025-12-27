
import React, { createContext, useContext, useState, ReactNode } from 'react';
import Cookies from 'js-cookie';

// Use environment variable for API base URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

interface User {
    username: string;
    name: string;
    email: string;
    mobileNumber: string | null;
    role: string;
}

interface RegisterRequest {
    name: string;
    email: string;
    password: string;
}

interface LoginRequest {
    identifier: string;
    password: string;
}

interface AuthResponse {
    success: boolean;
    message: string;
    data: User & {
        accessToken: string;
        tokenType: string;
    };
    errors: any;
    timestamp: string;
}

interface AuthContextType {
    user: User | null;
    register: (data: RegisterRequest) => Promise<void>;
    login: (data: LoginRequest) => Promise<void>;
    logout: () => void;
    isLoading: boolean;
    error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true); // Start loading true to check auth status
    const [error, setError] = useState<string | null>(null);

    // Initialize user from localStorage or fetch profile if token exists
    React.useEffect(() => {
        const initializeAuth = async () => {
            const token = Cookies.get('token');
            const storedUser = localStorage.getItem('user');

            if (token) {
                if (storedUser) {
                    try {
                        setUser(JSON.parse(storedUser));
                    } catch (e) {
                        console.error("Failed to parse user from local storage", e);
                        localStorage.removeItem('user');
                    }
                }

                // Re-check localStorage in case we just removed it
                if (!localStorage.getItem('user')) {
                    try {
                        const response = await fetch(`${API_BASE_URL}/profile`, {
                            headers: {
                                'Authorization': `Bearer ${token}`
                            }
                        });
                        const data = await response.json();

                        if (data.success && data.data) {
                            const userData: User = {
                                username: data.data.username,
                                name: data.data.name,
                                email: data.data.email,
                                mobileNumber: data.data.mobileNumber,
                                role: data.data.role || 'User'
                            };
                            setUser(userData);
                            localStorage.setItem('user', JSON.stringify(userData));
                        } else {
                            Cookies.remove('token');
                        }
                    } catch (error) {
                        console.error("Failed to fetch profile", error);
                    }
                }
            }
            setIsLoading(false);
        };

        initializeAuth();
    }, []);

    const handleAuthResponse = (data: AuthResponse) => {
        // Extract user info and access token
        const { accessToken, tokenType, ...restData } = data.data;

        const userData: User = {
            username: restData.username,
            name: restData.name,
            email: restData.email,
            mobileNumber: restData.mobileNumber,
            role: restData.role
        };

        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));

        // Save Access Token
        if (accessToken) {
            Cookies.set('token', accessToken, { expires: 7 });
        }
    };

    const register = async (requestData: RegisterRequest) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch(`${API_BASE_URL}/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestData),
            });

            const data: AuthResponse = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(data.message || 'Registration failed');
            }

            handleAuthResponse(data);

        } catch (err: any) {
            setError(err.message || 'An error occurred during registration');
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    const login = async (requestData: LoginRequest) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch(`${API_BASE_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestData),
            });

            const data: AuthResponse = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(data.message || 'Login failed');
            }

            handleAuthResponse(data);

        } catch (err: any) {
            setError(err.message || 'An error occurred during login');
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    const logout = () => {
        setUser(null);
        Cookies.remove('token');
        localStorage.removeItem('user');
        // Optional: Clear other local storage or session storage if used
    };

    return (
        <AuthContext.Provider value={{ user, register, login, logout, isLoading, error }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
