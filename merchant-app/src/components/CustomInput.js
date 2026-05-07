import React from 'react';
import { View, TextInput, Text, StyleSheet } from 'react-native';
import { Colors } from '../constants/colors';

const CustomInput = ({ 
  label, 
  value, 
  onChangeText, 
  placeholder, 
  secureTextEntry, 
  icon: Icon,
  error,
  keyboardType = 'default'
}) => {
  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={[styles.inputContainer, error && styles.inputError]}>
        {Icon && <Icon size={20} color={Colors.textSecondary} style={styles.icon} />}
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#A0A0A0"
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          style={styles.input}
        />
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9F9F9',
    borderRadius: 12,
    paddingHorizontal: 15,
    height: 56,
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  inputError: {
    borderColor: Colors.error,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: Colors.text,
  },
  errorText: {
    color: Colors.error,
    fontSize: 12,
    marginTop: 5,
  }
});

export default CustomInput;
