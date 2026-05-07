import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../constants/colors';

const CustomButton = ({ 
  title, 
  onPress, 
  type = 'primary', 
  loading = false, 
  icon: Icon, 
  style, 
  textStyle,
  gradient
}) => {
  const isOutline = type === 'outline';
  const isSecondary = type === 'secondary';
  
  const content = (
    <>
      {loading ? (
        <ActivityIndicator color={isOutline ? Colors.primary : Colors.white} />
      ) : (
        <>
          <Text style={[
            styles.text, 
            isOutline && styles.textOutline,
            isSecondary && styles.textSecondary,
            textStyle
          ]}>
            {title}
          </Text>
          {Icon && <Icon size={20} color={isOutline ? Colors.primary : Colors.white} style={styles.icon} />}
        </>
      )}
    </>
  );

  if (type === 'primary' || gradient) {
    return (
      <TouchableOpacity 
        onPress={onPress} 
        disabled={loading}
        style={[styles.container, style]}
      >
        <LinearGradient
          colors={gradient || [Colors.primary, '#E67E22']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.gradient}
        >
          {content}
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity 
      onPress={onPress} 
      disabled={loading}
      style={[
        styles.container, 
        isOutline && styles.containerOutline,
        isSecondary && styles.containerSecondary,
        style
      ]}
    >
      {content}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 56,
    borderRadius: 28,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
  },
  containerOutline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  containerSecondary: {
    backgroundColor: Colors.secondary,
  },
  gradient: {
    flex: 1,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  text: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '700',
  },
  textOutline: {
    color: Colors.primary,
  },
  textSecondary: {
    color: Colors.primary,
  },
  icon: {
    marginLeft: 10,
  }
});

export default CustomButton;
