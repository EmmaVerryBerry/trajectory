import axios from 'axios';

// Base API URL - should come from environment variables
const API_URL = process.env.API_URL || 'http://localhost:3000/api';

// In-memory token storage (works without AsyncStorage package)
let authToken = null;
let userData = null;

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth token
api.interceptors.request.use(
  (config) => {
    if (authToken) {
      config.headers.Authorization = `Bearer ${authToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      authToken = null;
      userData = null;
      console.log('Unauthorized access - token cleared');
    }
    return Promise.reject(error);
  }
);

// Auth API functions
export const authAPI = {
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    if (response.data.token) {
      authToken = response.data.token;
      userData = response.data.user;
    }
    return response.data;
  },

  register: async (username, email, password, university, major) => {
    const response = await api.post('/auth/register', {
      username, email, password, university, major,
    });
    if (response.data.token) {
      authToken = response.data.token;
      userData = response.data.user;
    }
    return response.data;
  },

  logout: () => {
    authToken = null;
    userData = null;
  },

  getStoredToken: () => authToken,
  getStoredUser: () => userData,
};

export default api;
