// Auth Screens
export { default as OnboardingScreen } from './auth/OnboardingScreen';
export { default as LoginScreen } from './auth/LoginScreen';
export { default as RegisterMerchantScreen } from './auth/RegisterMerchantScreen';
export { default as ForgotPasswordScreen } from './auth/ForgotPasswordScreen';
export { default as OTPScreen } from './auth/OTPScreen';
export { default as ResetPasswordScreen } from './auth/ResetPasswordScreen';

// Main Screens
export { default as DashboardScreen } from './main/DashboardScreen';
export { default as MenuManagementScreen } from './main/MenuManagementScreen';
export { default as OrderManagementScreen } from './main/OrderManagementScreen';
export { default as AnalyticsScreen } from './main/AnalyticsScreen';
export { default as ProfileScreen } from './main/ProfileScreen';
export { default as RestaurantInfoScreen } from './main/RestaurantInfoScreen';
export { default as OrderDetailScreen } from './main/OrderDetailScreen';
export { default as NotificationScreen } from './main/NotificationScreen';
export { default as PromotionsScreen } from './main/PromotionsScreen';
export { default as AddEditDishScreen } from './main/AddEditDishScreen';
export { default as OperatingHoursScreen } from './main/OperatingHoursScreen';
export { default as PaymentSettingsScreen } from './main/PaymentSettingsScreen';
export { default as StaffManagementScreen } from './main/StaffManagementScreen';
export { default as CustomerFeedbackScreen } from './main/CustomerFeedbackScreen';
export { default as SupportHelpScreen } from './main/SupportHelpScreen';

// Placeholder for remaining screens if any
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const PlaceholderScreen = ({ name }) => (
  <View style={styles.container}>
    <Text>{name} Screen</Text>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' }
});

export const RegisterScreen = () => <PlaceholderScreen name="Register" />;
