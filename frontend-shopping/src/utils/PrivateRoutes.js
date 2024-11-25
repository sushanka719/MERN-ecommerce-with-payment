// src/components/PrivateRoute.js
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../Context/authStore';

const PrivateRoute = () => {
    const { isAuthenticated, user, isCheckingAuth } = useAuth();

    if (isCheckingAuth) return <div>Loading...</div>; // Show a loading screen while checking

    // Redirect to login if not authenticated
    if (!isAuthenticated) {
        return <Navigate to="/login" />;
    }

    // Redirect to verify-email if authenticated but not verified
    if (isAuthenticated && user && !user.isVerified) {
        return <Navigate to="/verify-email" />;
    }

    return <Outlet />; // Render the child routes if authenticated and verified
};

export default PrivateRoute;
