import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Home, Search, MapPin as MapIcon, Search as ClipboardList, User } from 'lucide-react-native';
import { COLORS } from '../constants/theme';

// Screens
import OnboardingScreen from '../screens/OnboardingScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import HomeScreen from '../screens/HomeScreen';
import SearchScreen from '../screens/SearchScreen';
import MapScreen from '../screens/MapScreen';
import OrderHistoryScreen from '../screens/OrderHistoryScreen';
import RestaurantDetailScreen from '../screens/RestaurantDetailScreen';
import FoodDetailScreen from '../screens/FoodDetailScreen';
import CartScreen from '../screens/CartScreen';
import CheckoutScreen from '../screens/CheckoutScreen';
import ProfileScreen from '../screens/ProfileScreen';
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen';
import OTPVerificationScreen from '../screens/OTPVerificationScreen';
import ResetPasswordScreen from '../screens/ResetPasswordScreen';
import OrderTrackingScreen from '../screens/OrderTrackingScreen';
import EditProfileScreen from '../screens/EditProfileScreen';
import AddressScreen from '../screens/AddressScreen';
import FavoriteScreen from '../screens/FavoriteScreen';
import NotificationSettingsScreen from '../screens/NotificationSettingsScreen';
import VoucherScreen from '../screens/VoucherScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const MainTabs = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let IconName;
        if (route.name === 'Trang chủ') IconName = Home;
        else if (route.name === 'Tìm kiếm') IconName = Search;
        else if (route.name === 'Bản đồ') IconName = MapIcon;
        else if (route.name === 'Đơn hàng') IconName = ClipboardList;
        else if (route.name === 'Cá nhân') IconName = User;

        return <IconName size={size} color={color} />;
      },
      tabBarActiveTintColor: COLORS.primary,
      tabBarInactiveTintColor: COLORS.textLight,
      tabBarStyle: {
        height: 65,
        paddingBottom: 10,
        paddingTop: 10,
        borderTopWidth: 1,
        borderTopColor: COLORS.border,
        backgroundColor: COLORS.white,
      },
      headerShown: false,
    })}
  >
    <Tab.Screen name="Trang chủ" component={HomeScreen} />
    <Tab.Screen name="Tìm kiếm" component={SearchScreen} />
    <Tab.Screen name="Bản đồ" component={MapScreen} /> 
    <Tab.Screen name="Đơn hàng" component={OrderHistoryScreen} /> 
    <Tab.Screen name="Cá nhân" component={ProfileScreen} />
  </Tab.Navigator>
);

const AppNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="Main" component={MainTabs} />
      <Stack.Screen name="RestaurantDetail" component={RestaurantDetailScreen} />
      <Stack.Screen name="FoodDetail" component={FoodDetailScreen} />
      <Stack.Screen name="Cart" component={CartScreen} />
      <Stack.Screen name="Checkout" component={CheckoutScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
      <Stack.Screen name="OTPVerification" component={OTPVerificationScreen} />
      <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
      <Stack.Screen name="OrderTracking" component={OrderTrackingScreen} />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} />
      <Stack.Screen name="Address" component={AddressScreen} />
      <Stack.Screen name="Favorite" component={FavoriteScreen} />
      <Stack.Screen name="NotificationSettings" component={NotificationSettingsScreen} />
      <Stack.Screen name="Voucher" component={VoucherScreen} />
    </Stack.Navigator>
  );
};

export default AppNavigator;
