import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { ChevronLeft, ArrowRight, Eye, CheckCircle2, Circle } from 'lucide-react-native';
import { Colors } from '../../constants/colors';
import CustomButton from '../../components/CustomButton';
import CustomInput from '../../components/CustomInput';

const ResetPasswordScreen = ({ navigation }) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const requirements = [
    { label: 'Ít nhất 8 ký tự', met: true },
    { label: 'Bao gồm chữ hoa và chữ thường', met: false },
    { label: 'Bao gồm số hoặc ký tự đặc biệt', met: false },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <Text style={styles.brand}>Crave & Co.</Text>
      </View>

      <View style={styles.formCard}>
        <Text style={styles.title}>Đặt lại mật khẩu mới</Text>
        <Text style={styles.subtitle}>
          Vui lòng thiết lập một mật khẩu mới cho tài khoản của bạn để tiếp tục.
        </Text>
        
        <CustomInput
          label="Mật khẩu mới"
          placeholder="Nhập mật khẩu mới"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          icon={Eye}
        />

        <CustomInput
          label="Xác nhận mật khẩu mới"
          placeholder="Nhập lại mật khẩu mới"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          icon={Eye}
        />

        <View style={styles.requirementsContainer}>
          <Text style={styles.requirementsTitle}>YÊU CẦU MẬT KHẨU</Text>
          {requirements.map((req, index) => (
            <View key={index} style={styles.requirementRow}>
              {req.met ? (
                <CheckCircle2 size={16} color="#2ECC71" />
              ) : (
                <Circle size={16} color={Colors.textSecondary} />
              )}
              <Text style={[styles.requirementText, req.met && styles.requirementMet]}>
                {req.label}
              </Text>
            </View>
          ))}
        </View>

        <CustomButton
          title="Cập nhật mật khẩu"
          onPress={() => navigation.navigate('Login')}
          icon={ArrowRight}
          style={styles.updateButton}
        />

        <TouchableOpacity onPress={() => navigation.navigate('Login')} style={styles.backToLogin}>
          <ChevronLeft size={16} color={Colors.textSecondary} />
          <Text style={styles.backToLoginText}>Quay lại trang Đăng nhập</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF9F8',
  },
  contentContainer: {
    flexGrow: 1,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  brand: {
    fontSize: 24,
    fontWeight: '900',
    color: Colors.primary,
  },
  formCard: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    padding: 30,
    flex: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.05,
    shadowRadius: 20,
    elevation: 5,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: Colors.text,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
    marginBottom: 30,
  },
  requirementsContainer: {
    backgroundColor: '#FFF1F0',
    borderRadius: 20,
    padding: 20,
    marginBottom: 30,
  },
  requirementsTitle: {
    fontSize: 10,
    fontWeight: '800',
    color: Colors.text,
    letterSpacing: 1,
    marginBottom: 12,
  },
  requirementRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  requirementText: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginLeft: 10,
    fontWeight: '500',
  },
  requirementMet: {
    color: Colors.text,
    fontWeight: '700',
  },
  updateButton: {
    marginBottom: 30,
  },
  backToLogin: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backToLoginText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginLeft: 5,
  }
});

export default ResetPasswordScreen;
