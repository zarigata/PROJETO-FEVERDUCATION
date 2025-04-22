import axios, { AxiosHeaders, InternalAxiosRequestConfig } from 'axios';

const api = axios.create({ baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8000/api' });

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers = new AxiosHeaders(config.headers).set('Authorization', `Bearer ${token}`);
  }
  return config;
});

export default api;
