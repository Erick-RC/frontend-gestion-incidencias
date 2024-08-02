import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../hooks/useAuth'; 

const CreateIncidentPage = () => {
  const { userId, token } = useAuth(); // Obtén userId del hook useAuth
  const [asunto, setAsunto] = useState('');
  const [tipo, setTipo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [incidencias, setIncidencias] = useState([]);
  const [comentarios, setComentarios] = useState({});
  const [selectedIncidenciaId, setSelectedIncidenciaId] = useState(null);

  useEffect(() => {
    const fetchIncidencias = async () => {
      try {
        if (!token || !userId) {
          throw new Error('No estás autenticado');
        }

        const response = await api.get('/api/incidencias', {
          headers: { Authorization: `Bearer ${token}` }
        });

        // Filtrar incidencias basadas en el userId
        const filteredIncidencias = response.data.filter(
          incidencia => incidencia.Usuario_ID === userId
        );

        setIncidencias(filteredIncidencias);
      } catch (error) {
        console.error('Error al obtener incidencias:', error.response ? error.response.data : error.message);
      }
    };

    fetchIncidencias();
  }, [token, userId]); // Agregar token y userId como dependencias

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!token || !userId) {
        throw new Error('No estás autenticado');
      }
      await api.post('/api/incidencias', { 
        asunto, 
        tipo, 
        descripcion, 
        estado: 'pendiente',
        Usuario_ID: userId // Usa userId directamente
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Recargar las incidencias después de crear una nueva
      const response = await api.get('/api/incidencias', {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Filtra las incidencias por el ID del usuario
      const filteredIncidencias = response.data.filter(
        incidencia => incidencia.Usuario_ID === userId
      );
      setIncidencias(filteredIncidencias);

      // Limpiar el formulario
      setAsunto('');
      setTipo('');
      setDescripcion('');
    } catch (error) {
      console.error('Error al crear la incidencia:', error.response ? error.response.data : error.message);
    }
  };

  const handleSelectIncidencia = async (id) => {
    if (selectedIncidenciaId === id) {
      setSelectedIncidenciaId(null);
    } else {
      setSelectedIncidenciaId(id);
      try {
        const response = await api.get(`/api/comentarios/${id}`);
        setComentarios(prev => ({ ...prev, [id]: response.data }));
      } catch (error) {
        console.error('Error al obtener los comentarios:', error.response ? error.response.data : error.message);
      }
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
              <button
                type="submit"
                className="w-full px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Crear Incidencia
              </button>
            </div>
          </form>
          <div className="mt-8">
            <h3 className="text-xl font-bold mb-4 text-gray-800">Incidencias Creadas</h3>
            <ul className="space-y-4">
              {incidencias.length > 0 ? (
                incidencias.map((incidencia) => (
                  <li key={incidencia.ID} className="p-4 border border-gray-300 rounded-md">
                    <h4 className="text-lg font-semibold text-gray-800">{incidencia.Asunto}</h4>
                    <p className="text-sm text-gray-600"><strong>Tipo:</strong> {incidencia.Tipo}</p>
                    <p className="text-sm text-gray-600"><strong>Descripción:</strong> {incidencia.Descripcion}</p>
                    <p className="text-sm text-gray-600"><strong>Estado:</strong> {incidencia.Estado}</p>
                    <button
                      onClick={() => handleSelectIncidencia(incidencia.ID)}
                      className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                      {selectedIncidenciaId === incidencia.ID ? 'Ocultar Comentarios' : 'Ver Comentarios'}
                    </button>
                    {selectedIncidenciaId === incidencia.ID && (
                      <div className="mt-4">
                        <h4 className="text-lg font-semibold text-gray-700 mb-2">Comentarios</h4>
                        <ul className="space-y-2">
                          {(comentarios[incidencia.ID] || []).map(comment => (
                            <li key={comment.ID} className="p-2 border border-gray-300 rounded-md">
                              {comment.Contenido}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </li>
                ))
              ) : (
                <p className="text-gray-600">No hay incidencias disponibles.</p>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateIncidentPage;
