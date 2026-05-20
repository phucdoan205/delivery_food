import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import DashboardPage from "../pages/DashboardPage";
import UsersPage from "../pages/UsersPage";
import RestaurantsPage from "../pages/RestaurantsPage";
import OrdersPage from "../pages/OrdersPage";
import DriversPage from "../pages/DriversPage";
import AnalyticsPage from "../pages/AnalyticsPage";
import SettingsPage from "../pages/SettingsPage";
import AuthLayout from "../layouts/AuthLayout";
import { getToken } from "../api/client";

const ProtectedRoute = ({ children }) => {
  const token = getToken();
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* Auth Routes */}
      <Route 
        path="/login" 
        element={
          <AuthLayout>
            <LoginPage />
          </AuthLayout>
        } 
      />

      {/* Admin Routes */}
      <Route path="/" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
      <Route path="/users" element={<ProtectedRoute><UsersPage /></ProtectedRoute>} />
      <Route path="/restaurants" element={<ProtectedRoute><RestaurantsPage /></ProtectedRoute>} />
      <Route path="/orders" element={<ProtectedRoute><OrdersPage /></ProtectedRoute>} />
      <Route path="/drivers" element={<ProtectedRoute><DriversPage /></ProtectedRoute>} />
      <Route path="/analytics" element={<ProtectedRoute><AnalyticsPage /></ProtectedRoute>} />
      <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
      
      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
