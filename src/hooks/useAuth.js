import { useState } from 'react';
import { useLocation } from 'wouter'; // Asegúrate de tener wouter instalado
import api from '../services/api'; // Asegúrate de que la ruta sea correcta

export const useAuth = () => {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [userType, setUserType] = useState(localStorage.getItem('userType') || '');
  const [userId, setUserId] = useState(localStorage.getItem('userId') || '');
  const [, setLocation] = useLocation(); 

  const login = async ({ email, password }) => {
    try {
      const response = await api.post('/api/usuarios/login', { email, password });
      const { token, tipo, id } = response.data;
      setToken(token);
      setUserType(tipo);
      setUserId(id);
      localStorage.setItem('token', token);
      localStorage.setItem('userType', tipo);
      localStorage.setItem('userId', id);

      // Redirige según el tipo de usuario
      if (tipo === 'residente') {
        setLocation('/crear-incidencia');
      } else if (tipo === 'administrador') {
        setLocation('/dashboard');
      }
    } catch (error) {
      console.error('Error en el login:', error.response ? error.response.data : error.message);
    }
  };

  return { token, userType, userId, login };
};
