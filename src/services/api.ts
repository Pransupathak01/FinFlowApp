import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import appConfig from '../config/appConfig';

const api = axios.create({
  baseURL: appConfig.API_URL,
  timeout: 15_000,
  headers: { 'Content-Type': 'application/json' },
});

// ── Request interceptor – attach token to every request ───────────────────
api.interceptors.request.use(
  async config => {
    const token = await AsyncStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error),
);

// ── Response interceptor – normalise errors ───────────────────────────────
api.interceptors.response.use(
  response => response,
  error => {
    const message =
      error?.response?.data?.message ||
      error?.message ||
      'Something went wrong';
    return Promise.reject(new Error(message));
  },
);

export default api;
