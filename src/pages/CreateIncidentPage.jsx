import React, { useState } from 'react';
import api from '../services/api'; // Asegúrate de que la ruta sea correcta
import { useLocation } from 'wouter';

const CreateIncidentPage = () => {
  const [asunto, setAsunto] = useState('');
  const [tipo, setTipo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [estado, setEstado] = useState('pendiente'); // Valor por defecto para el estado
  const [, setLocation] = useLocation(); // Usamos setLocation para redirigir después de crear la incidencia

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No estás autenticado');
      }
      await api.post('/api/incidencias', { asunto, tipo, descripcion, estado }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setLocation('/dashboard'); // Redirige al dashboard después de crear la incidencia
    } catch (error) {
      console.error('Error al crear la incidencia:', error.response ? error.response.data : error.message);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <div className="flex-1 flex items-center justify-center">
        <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Crear Incidencia</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="asunto" className="block text-sm font-semibold text-gray-700 mb-2">
                Asunto
              </label>
              <input
                type="text"
                id="asunto"
                value={asunto}
                onChange={(e) => setAsunto(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label htmlFor="tipo" className="block text-sm font-semibold text-gray-700 mb-2">
                Tipo
              </label>
              <input
                type="text"
                id="tipo"
                value={tipo}
                onChange={(e) => setTipo(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label htmlFor="descripcion" className="block text-sm font-semibold text-gray-700 mb-2">
                Descripción
              </label>
              <textarea
                id="descripcion"
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                required
                rows="4"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              ></textarea>
            </div>
            <div>
              <label htmlFor="estado" className="block text-sm font-semibold text-gray-700 mb-2">
                Estado
              </label>
              <input
                type="text"
                id="estado"
                value={estado}
                readOnly // Campo de solo lectura, ya que el valor es fijo
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-200"
              />
            </div>
            <div>
              <button
                type="submit"
                className="w-full px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Crear Incidencia
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateIncidentPage;
