import { Platform } from 'react-native';

export const API_URL = 'http://192.168.1.102:5000/api';

let token = '';

export const setToken = (t) => {
  token = t;
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
