import React, { useState } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS, SIZES } from '../constants/theme';
import { Eye, EyeOff } from 'lucide-react-native';

const CustomInput = ({ 
  placeholder, 
  value, 
  onChangeText, 
  secureTextEntry, 
  icon: Icon,
  keyboardType = 'default',
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View style={styles.container}>
      {Icon && <Icon size={20} color={COLORS.textLight} style={styles.icon} />}
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor={COLORS.textLight}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry && !showPassword}
        keyboardType={keyboardType}
        {...props}
      />
      {secureTextEntry && (
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          {showPassword ? (
            <EyeOff size={20} color={COLORS.textLight} />
          ) : (
            <Eye size={20} color={COLORS.textLight} />
          )}
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: SIZES.radius,
    paddingHorizontal: SIZES.padding,
    height: 56,
    marginBottom: SIZES.base * 2,
  },
  icon: {
    marginRight: SIZES.base,
  },
  input: {
    flex: 1,
    color: COLORS.text,
    fontSize: SIZES.font,
  },
});

export default CustomInput;
