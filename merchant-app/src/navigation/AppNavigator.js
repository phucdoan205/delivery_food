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
  RestaurantInfoScreen
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
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
