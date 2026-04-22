import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface AdminRouteProps {
    allowedRoles?: string[];
}

const AdminRoute = ({ allowedRoles }: AdminRouteProps) => {
    const { user, isAuthenticated, isLoading } = useAuth();
    const location = useLocation();

    if (isLoading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-cream gap-6">
                <div className="w-12 h-12 border-2 border-forest/10 border-t-indigo-action rounded-full animate-spin" />
                <span className="text-[10px] font-bold text-forest/20 uppercase tracking-[0.4em] animate-pulse">Initialisation_Session...</span>
            </div>
        );
    }

    if (!isAuthenticated) {
        // Redirect to login but keep current location
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (allowedRoles && user && !allowedRoles.includes(user.role)) {
        // Role not authorized
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
};

export default AdminRoute;
