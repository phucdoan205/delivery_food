import React, { useState } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SIZES } from '../constants/theme';

const CustomInput = ({
  icon,
  placeholder,
  value,
  onChangeText,
  secureTextEntry,
  keyboardType = 'default',
  error,
  style,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View style={[styles.container, style]}>
      <View style={[
        styles.inputContainer,
        isFocused && styles.focusedBorder,
        error && styles.errorBorder
      ]}>
        {icon && (
          <Ionicons 
            name={icon} 
            size={20} 
            color={isFocused ? COLORS.primary : COLORS.textSecondary} 
            style={styles.icon} 
          />
        )}
        
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor={COLORS.textLight}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry && !showPassword}
          keyboardType={keyboardType}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />

        {secureTextEntry && (
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Ionicons 
              name={showPassword ? 'eye-off-outline' : 'eye-outline'} 
              size={20} 
              color={COLORS.textSecondary} 
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: SIZES.base,
  },
  inputContainer: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius,
    paddingHorizontal: SIZES.padding / 1.5,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  focusedBorder: {
    borderColor: COLORS.primary,
  },
  errorBorder: {
    borderColor: COLORS.error,
  },
  icon: {
    marginRight: SIZES.base,
  },
  input: {
    flex: 1,
    ...FONTS.body3,
    color: COLORS.text,
  },
});

export default CustomInput;
