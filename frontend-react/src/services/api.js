// src/services/api.js
import axios from 'axios';

// URL del backend Django
const API_URL = 'http://localhost:8000/api';

// Crea un'istanza di axios
const api = axios.create({
  baseURL: API_URL,
});

// Interceptor: aggiunge il token JWT a ogni richiesta
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;