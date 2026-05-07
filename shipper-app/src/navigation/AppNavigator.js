import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';

// Placeholder Screens
import SplashScreen from '../screens/auth/SplashScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import ForgotPasswordScreen from '../screens/auth/ForgotPasswordScreen';
import OTPScreen from '../screens/auth/OTPScreen';
import ResetPasswordScreen from '../screens/auth/ResetPasswordScreen';

import ReadyScreen from '../screens/main/ReadyScreen';
import DeliveryScreen from '../screens/main/DeliveryScreen';
import HistoryScreen from '../screens/main/HistoryScreen';
import EarningsScreen from '../screens/main/EarningsScreen';
import ProfileScreen from '../screens/main/ProfileScreen';

import PickupConfirmationScreen from '../screens/details/PickupConfirmationScreen';
import DeliveryDetailScreen from '../screens/details/DeliveryDetailScreen';
import PersonalInfoScreen from '../screens/details/PersonalInfoScreen';
import BankAccountsScreen from '../screens/details/BankAccountsScreen';
import SettingsScreen from '../screens/details/SettingsScreen';
import HelpCenterScreen from '../screens/details/HelpCenterScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const MainTab = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;
        if (route.name === 'Ready') iconName = focused ? 'radio-button-on' : 'radio-button-off';
        else if (route.name === 'Delivery') iconName = focused ? 'bicycle' : 'bicycle-outline';
        else if (route.name === 'History') iconName = focused ? 'time' : 'time-outline';
        else if (route.name === 'Earnings') iconName = focused ? 'wallet' : 'wallet-outline';
        else if (route.name === 'Profile') iconName = focused ? 'person' : 'person-outline';
        return <Ionicons name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: COLORS.primary,
      tabBarInactiveTintColor: COLORS.textSecondary,
      tabBarStyle: {
        height: 70,
        paddingBottom: 10,
        paddingTop: 10,
        backgroundColor: COLORS.white,
        borderTopWidth: 0,
        elevation: 20,
        shadowColor: COLORS.black,
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
      },
      headerShown: false,
    })}
  >
    <Tab.Screen name="Ready" component={ReadyScreen} options={{ title: 'Sẵn sàng' }} />
    <Tab.Screen name="Delivery" component={DeliveryScreen} options={{ title: 'Giao hàng' }} />
    <Tab.Screen name="History" component={HistoryScreen} options={{ title: 'Lịch sử' }} />
    <Tab.Screen name="Earnings" component={EarningsScreen} options={{ title: 'Thu nhập' }} />
    <Tab.Screen name="Profile" component={ProfileScreen} options={{ title: 'Hồ sơ' }} />
  </Tab.Navigator>
);

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Splash">
        {/* Auth Flow */}
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
        <Stack.Screen name="OTP" component={OTPScreen} />
        <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
        
        {/* Main Flow */}
        <Stack.Screen name="Main" component={MainTab} />
        <Stack.Screen name="PickupConfirmation" component={PickupConfirmationScreen} />
        <Stack.Screen name="DeliveryDetail" component={DeliveryDetailScreen} />
        <Stack.Screen name="PersonalInfo" component={PersonalInfoScreen} />
        <Stack.Screen name="BankAccounts" component={BankAccountsScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
        <Stack.Screen name="HelpCenter" component={HelpCenterScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
