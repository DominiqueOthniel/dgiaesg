import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import api from '../services/api';

interface User {
    id: string;
    _id: string; // Alias for redesign compatibility
    name: string;
    username: string;
    email: string;
    role: 'admin' | 'editor' | 'viewer' | string;
    avatar?: string;
    savedArticles: string[];
    savedLabels: string[];
    isPro: boolean;
    subscriptionId?: string;
    proExpiry?: string;
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (token: string) => void;
    logout: () => void;
    updateSavedArticles: (articles: string[]) => void;
    updateSavedLabels: (labels: string[]) => void;
    updateUser: (userData: any) => void;
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
                _id: userData._id,
                name: userData.name,
                username: userData.username,
                email: userData.email,
                role: userData.role,
                avatar: userData.avatar,
                savedArticles: userData.savedArticles || [],
                savedLabels: userData.savedLabels || [],
                isPro: userData.isPro || false,
                subscriptionId: userData.subscriptionId,
                proExpiry: userData.proExpiry
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

    const updateSavedArticles = (newArticles: string[]) => {
        if (user) {
            setUser({ ...user, savedArticles: newArticles });
        }
    };

    const updateSavedLabels = (newLabels: string[]) => {
        if (user) {
            setUser({ ...user, savedLabels: newLabels });
        }
    };

    const updateUser = (userData: any) => {
        if (user) {
            setUser({
                ...user,
                id: userData._id || userData.id,
                name: userData.name,
                username: userData.username,
                email: userData.email,
                avatar: userData.avatar,
                role: userData.role,
                isPro: userData.isPro,
                proExpiry: userData.proExpiry,
                savedArticles: userData.savedArticles || user.savedArticles,
                savedLabels: userData.savedLabels || user.savedLabels
            });
        }
    };

    return (
        <AuthContext.Provider value={{
            user,
            token,
            isAuthenticated: !!token && !!user,
            isLoading,
            login,
            logout,
            updateSavedArticles,
            updateSavedLabels,
            updateUser
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
