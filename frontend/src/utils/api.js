// Centralized Axios instance with sensible defaults
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000/api';

const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
  timeout: 30000, // increase to 30s to cover heavy fixture generation
});

// Ensure Authorization header is forwarded from global axios (set by auth store)
api.interceptors.request.use((config) => {
  // Guard against undefined headers on custom calls
  config.headers = config.headers || {};
  const bearer = axios.defaults.headers.common['Authorization'];
  if (bearer && !config.headers['Authorization']) {
    config.headers['Authorization'] = bearer;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.code === 'ECONNABORTED') {
      console.warn('Request timed out:', err.config?.url);
    }
    return Promise.reject(err);
  }
);

export default api;