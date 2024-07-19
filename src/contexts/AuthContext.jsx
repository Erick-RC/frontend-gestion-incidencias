import React, { createContext, useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import api from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete api.defaults.headers.common['Authorization'];
    }
  }, [token]);

  const register = async (userData) => {
    try {
      const response = await api.post('/api/usuarios', userData);
      setToken(response.data.token);
      setUser(response.data);
      localStorage.setItem('token', response.data.token);
      setLocation('/');
    } catch (error) {
      console.error('Error al registrar:', error);
    }
  };

  const login = async (credentials) => {
    try {
      const response = await api.post('/api/usuarios/login', credentials);
      if (response.data && response.data.token) {
        setToken(response.data.token);
        localStorage.setItem('token', response.data.token);
        setUser({ email: credentials.email }); 
        setLocation('/');
      } else {
        throw new Error('No se recibió un token válido');
      }
    } catch (error) {
      console.error('Error al iniciar sesión:', error.response ? error.response.data : error.message);
    }
  };

  const logout = () => {
    setUser(null);
    setToken('');
    localStorage.removeItem('token');
    setLocation('/login');
  };

  return (
    <AuthContext.Provider value={{ user, token, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};