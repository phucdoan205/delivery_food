import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const API_URL = 'http://192.168.1.102:5000/api';

let token = '';

export const loadToken = async () => {
  try {
    const t = await AsyncStorage.getItem('merchant_token');
    if (t) token = t;
  } catch (e) {
    console.error('Error loading token', e);
  }
};

export const setToken = async (t) => {
  token = t;
  try {
    if (t) {
      await AsyncStorage.setItem('merchant_token', t);
    } else {
      await AsyncStorage.removeItem('merchant_token');
    }
  } catch (e) {
    console.error('Error saving token', e);
  }
};

export const getToken = () => {
  return token;
};

export const request = async (endpoint, options = {}) => {
  const url = `${API_URL}${endpoint}`;
  
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  const config = {
    ...options,
    headers,
  };
  
  if (options.body && typeof options.body === 'object') {
    config.body = JSON.stringify(options.body);
  }
  
  console.log(`[API Request] ${config.method || 'GET'} ${url}`);
  try {
    const response = await fetch(url, config);
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Something went wrong');
    }
    return data;
  } catch (error) {
    console.error(`[API Error] ${url}`, error);
    throw error;
  }
};
