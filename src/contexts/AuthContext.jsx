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
      const { token, id } = response.data;

      setToken(token);
      setUser({ ...userData, id });
      localStorage.setItem('token', token);
      localStorage.setItem('userType', userData.tipo);
      localStorage.setItem('userId', id);

      setLocation('/');
    } catch (error) {
      console.error('Error al registrar:', error);
    }
  };

  const login = async (credentials) => {
    try {
      const response = await api.post('/api/usuarios/login', credentials);
      const { token, tipo, id } = response.data;

      setToken(token);
      setUser({ email: credentials.email, tipo, id });
      localStorage.setItem('token', token);
      localStorage.setItem('userType', tipo);
      localStorage.setItem('userId', id);

      setLocation('/');
    } catch (error) {
      console.error('Error al iniciar sesión:', error.response ? error.response.data : error.message);
    }
  };

  const logout = () => {
    setUser(null);
    setToken('');
    localStorage.removeItem('token');
    localStorage.removeItem('userType');
    localStorage.removeItem('userId');
    setLocation('/login');
  };

  return (
    <AuthContext.Provider value={{ user, token, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
