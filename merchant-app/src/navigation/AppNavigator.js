import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import MainTabNavigator from './MainTabNavigator';
import {
  OnboardingScreen,
  LoginScreen,
  RegisterMerchantScreen,
  ForgotPasswordScreen,
  OTPScreen,
  ResetPasswordScreen,
  OrderDetailScreen,
  RestaurantInfoScreen,
  NotificationScreen,
  PromotionsScreen,
  AddEditDishScreen,
  OperatingHoursScreen,
  PaymentSettingsScreen,
  StaffManagementScreen,
  CustomerFeedbackScreen,
  SupportHelpScreen
} from '../screens';

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Onboarding"
        screenOptions={{
          headerShown: false,
          cardStyle: { backgroundColor: '#FFFFFF' },
        }}
      >
        {/* Auth Flow */}
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterMerchantScreen} />
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
        <Stack.Screen name="OTP" component={OTPScreen} />
        <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />

        {/* Main App Flow */}
        <Stack.Screen name="Main" component={MainTabNavigator} />
        <Stack.Screen name="OrderDetail" component={OrderDetailScreen} />
        <Stack.Screen name="RestaurantInfo" component={RestaurantInfoScreen} />
        <Stack.Screen name="Notification" component={NotificationScreen} />
        <Stack.Screen name="Promotions" component={PromotionsScreen} />
        <Stack.Screen name="AddEditDish" component={AddEditDishScreen} />
        <Stack.Screen name="OperatingHours" component={OperatingHoursScreen} />
        <Stack.Screen name="PaymentSettings" component={PaymentSettingsScreen} />
        <Stack.Screen name="StaffManagement" component={StaffManagementScreen} />
        <Stack.Screen name="CustomerFeedback" component={CustomerFeedbackScreen} />
        <Stack.Screen name="SupportHelp" component={SupportHelpScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
