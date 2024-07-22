import { useState } from 'react';
import { useLocation } from 'wouter'; // Asegúrate de tener wouter instalado
import api from '../services/api'; // Asegúrate de que la ruta sea correcta

export const useAuth = () => {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [, setLocation] = useLocation(); // Usamos setLocation para cambiar la ubicación

  const login = async ({ email, password }) => {
    try {
      const response = await api.post('/api/usuarios/login', { email, password });
      const { token, tipo } = response.data;
      setToken(token);
      localStorage.setItem('token', token);

      // Redirige según el tipo de usuario
      if (tipo === 'residente') {
        setLocation('/crear-incidencia'); // Cambia esta ruta si es diferente
      } else if (tipo === 'administrador') {
        setLocation('/dashboard');
      }
    } catch (error) {
      console.error('Error en el login:', error.response ? error.response.data : error.message);
    }
  };

  return { token, login };
};
