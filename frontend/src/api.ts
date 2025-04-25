import axios, { AxiosHeaders, InternalAxiosRequestConfig } from 'axios';

const api = axios.create({ baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8000/api' });

// Allow join classroom and other custom endpoints
api.defaults.headers.common['Content-Type'] = 'application/json';

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers = new AxiosHeaders(config.headers).set('Authorization', `Bearer ${token}`);
  }
  return config;
});

export default api;
