import React, { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { io } from "socket.io-client";
import toast from "react-hot-toast";
import useNotificationStore from "../store/useNotificationStore";
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
  const { incrementPendingRestaurants, incrementPendingDrivers } = useNotificationStore();

  useEffect(() => {
    // Assuming backend is at localhost:5000
    const socket = io("http://localhost:5000");

    socket.on("new_registration_pending", (data) => {
      if (data.role === "merchant") {
        incrementPendingRestaurants();
      } else if (data.role === "shipper") {
        incrementPendingDrivers();
      }

      const roleText = data.role === "merchant" ? "Cửa hàng" : "Tài xế";
      toast(
        (t) => (
          <div className="flex flex-col gap-1">
            <span className="font-bold text-sm">Có {roleText} mới đăng ký!</span>
            <span className="text-xs text-slate-500">{data.fullName} đang chờ được duyệt.</span>
          </div>
        ),
        { duration: 5000, icon: "🔔" }
      );
    });

    return () => {
      socket.disconnect();
    };
  }, []);

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
