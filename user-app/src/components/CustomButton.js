import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { COLORS, SIZES, SHADOWS } from '../constants/theme';
import { ArrowRight } from 'lucide-react-native';

const CustomButton = ({ 
  title, 
  onPress, 
  style, 
  textStyle, 
  variant = 'primary', 
  loading = false,
  showArrow = false,
  icon: Icon
}) => {
  const isSecondary = variant === 'secondary';
  const isOutline = variant === 'outline';

  return (
    <TouchableOpacity 
      activeOpacity={0.8}
      onPress={onPress}
      disabled={loading}
      style={[
        styles.container,
        isSecondary && styles.secondaryContainer,
        isOutline && styles.outlineContainer,
        style
      ]}
    >
      {loading ? (
        <ActivityIndicator color={isOutline ? COLORS.primary : COLORS.white} />
      ) : (
        <>
          {Icon && <Icon size={20} color={isOutline ? COLORS.primary : COLORS.white} style={styles.icon} />}
          <Text style={[
            styles.text,
            isOutline && styles.outlineText,
            textStyle
          ]}>
            {title}
          </Text>
          {showArrow && <ArrowRight size={20} color={COLORS.white} style={styles.arrow} />}
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.primary,
    height: 56,
    borderRadius: SIZES.radiusLarge,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SIZES.padding,
    ...SHADOWS.light,
  },
  secondaryContainer: {
    backgroundColor: COLORS.black,
  },
  outlineContainer: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: COLORS.primary,
    elevation: 0,
    shadowOpacity: 0,
  },
  text: {
    color: COLORS.white,
    fontSize: SIZES.medium,
    fontWeight: '700',
  },
  outlineText: {
    color: COLORS.primary,
  },
  icon: {
    marginRight: SIZES.base,
  },
  arrow: {
    marginLeft: SIZES.base,
  }
});

export default CustomButton;
