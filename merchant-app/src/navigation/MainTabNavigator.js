import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  LayoutDashboard,
  UtensilsCrossed,
  ClipboardList,
  BarChart3,
  User,
} from "lucide-react-native";
import { Colors } from "../constants/colors";
import {
  DashboardScreen,
  MenuManagementScreen,
  OrderManagementScreen,
  AnalyticsScreen,
  ProfileScreen,
} from "../screens";

const Tab = createBottomTabNavigator();

const MainTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textSecondary,
        tabBarStyle: {
          backgroundColor: Colors.surface,
          borderTopColor: Colors.border,
          height: 70,
          paddingBottom: 10,
          paddingTop: 10,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: "600",
        },
        tabBarIcon: ({ focused, color, size }) => {
          const iconSize = focused ? 24 : 22;

          switch (route.name) {
            case "Dashboard":
              return <LayoutDashboard size={iconSize} color={color} />;
            case "Menu":
              return <UtensilsCrossed size={iconSize} color={color} />;
            case "Orders":
              return <ClipboardList size={iconSize} color={color} />;
            case "Analytics":
              return <BarChart3 size={iconSize} color={color} />;
            case "Profile":
              return <User size={iconSize} color={color} />;
            default:
              return null;
          }
        },
      })}
    >
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{ tabBarLabel: "Bảng điều khiển" }}
      />
      <Tab.Screen
        name="Menu"
        component={MenuManagementScreen}
        options={{ tabBarLabel: "Món ăn" }}
      />
      <Tab.Screen
        name="Orders"
        component={OrderManagementScreen}
        options={{ tabBarLabel: "Đơn hàng" }}
      />
      <Tab.Screen
        name="Analytics"
        component={AnalyticsScreen}
        options={{ tabBarLabel: "Báo cáo" }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ tabBarLabel: "Hồ sơ" }}
      />
    </Tab.Navigator>
  );
};

export default MainTabNavigator;
