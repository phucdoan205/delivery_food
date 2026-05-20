export const API_URL = 'http://localhost:5000/api';

export const setToken = (token) => {
  if (token) {
    localStorage.setItem('admin_token', token);
  } else {
    localStorage.removeItem('admin_token');
  }
};

export const getToken = () => {
  return localStorage.getItem('admin_token');
};

export const request = async (endpoint, options = {}) => {
  const url = `${API_URL}${endpoint}`;
  const token = getToken();
  
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
  
  console.log(`[Admin API Request] ${config.method || 'GET'} ${url}`);
  try {
    const response = await fetch(url, config);
    if (response.status === 204) {
      return null;
    }
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Something went wrong');
    }
    return data;
  } catch (error) {
    console.error(`[Admin API Error] ${url}`, error);
    throw error;
  }
};
