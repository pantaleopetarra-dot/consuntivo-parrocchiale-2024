// src/services/auth.js
import api from './api';

/**
 * Effettua il login e salva il token JWT
 */
export const login = async (email, password) => {
  try {
    const response = await api.post('/parrocchie/login/', {
      username: email,
      password: password
    });
    localStorage.setItem('token', response.data.access);
    localStorage.setItem('refresh', response.data.refresh);
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.response?.data?.error || 'Credenziali non valide' };
  }
};

/**
 * Disconnette l'utente
 */
export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('refresh');
};

/**
 * Verifica se l'utente è autenticato
 */
export const isAuthenticated = () => {
  return !!localStorage.getItem('token');
};

/**
 * Restituisce il token JWT
 */
export const getToken = () => {
  return localStorage.getItem('token');
};