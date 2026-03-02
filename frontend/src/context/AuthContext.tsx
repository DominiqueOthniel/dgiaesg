import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import api from '../services/api';

interface User {
    id: string;
    name: string;
    email: string;
    role: 'admin' | 'editor' | 'viewer';
    savedArticles: string[];
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (token: string) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
    const [isLoading, setIsLoading] = useState(true);

    const fetchProfile = async (isMounted = true) => {
        setIsLoading(true);
        try {
            const response = await api.get('/auth/me');
            if (!isMounted) return;
            const userData = response.data.data;
            setUser({
                id: userData._id,
                name: userData.name,
                email: userData.email,
                role: userData.role,
                savedArticles: userData.savedArticles || []
            });
        } catch (error: any) {
            // 401 is expected when token expires — silently log out
            if (error?.response?.status !== 401) {
                console.error('Failed to fetch user profile', error);
            }
            if (isMounted) logout();
        } finally {
            if (isMounted) setIsLoading(false);
        }
    };

    useEffect(() => {
        let isMounted = true;

        const initAuth = async () => {
            if (token) {
                await fetchProfile(isMounted);
            } else {
                if (isMounted) setIsLoading(false);
            }
        };

        initAuth();

        return () => {
            isMounted = false;
        };
    }, [token]);

    const login = (newToken: string) => {
        localStorage.setItem('token', newToken);
        setToken(newToken);
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{
            user,
            token,
            isAuthenticated: !!token && !!user,
            isLoading,
            login,
            logout
        }}>
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
