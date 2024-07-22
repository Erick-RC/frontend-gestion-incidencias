import { useState } from 'react';
import { useLocation } from 'wouter'; // Asegúrate de tener wouter instalado
import api from '../services/api'; // Asegúrate de que la ruta sea correcta

export const useAuth = () => {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [, setLocation] = useLocation(); // Usamos setLocation para cambiar la ubicación

  const login = async ({ email, password }) => {
    try {
      const response = await api.post('/api/usuarios/login', { email, password });
      const { token } = response.data;
      setToken(token);
      localStorage.setItem('token', token);
      setLocation('/dashboard'); // Redirige al dashboard
    } catch (error) {
      console.error('Error en el login:', error.response ? error.response.data : error.message);
    }
  };

  return { token, login };
};
