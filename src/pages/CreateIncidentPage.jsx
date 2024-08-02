import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../hooks/useAuth';
import { Footer } from '../components/Footer';
import { useLocation } from 'wouter';

const CreateIncidentPage = () => {
  const { userId, token, logout } = useAuth();
  const [asunto, setAsunto] = useState('');
  const [tipo, setTipo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [incidencias, setIncidencias] = useState([]);
  const [comentarios, setComentarios] = useState({});
  const [selectedIncidenciaId, setSelectedIncidenciaId] = useState(null);
  const [, setLocation] = useLocation();

  useEffect(() => {
    fetchIncidencias();
  }, [token, userId]);

  const fetchIncidencias = async () => {
    try {
      if (!token || !userId) {
        throw new Error('No estás autenticado');
      }
      const response = await api.get('/api/incidencias', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const filteredIncidencias = response.data.filter(
        incidencia => incidencia.Usuario_ID === userId
      );

      const estadoPrioridades = {
        'pendiente': 1,
        'en progreso': 2,
        'resuelto': 3
      };

      const incidenciasOrdenadas = filteredIncidencias.sort((a, b) => {
        return estadoPrioridades[a.Estado.toLowerCase()] - estadoPrioridades[b.Estado.toLowerCase()];
      });

      setIncidencias(incidenciasOrdenadas);
    } catch (error) {
      console.error('Error al obtener incidencias:', error.response ? error.response.data : error.message);
    }
  };

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
        Usuario_ID: userId
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAsunto('');
      setTipo('');
      setDescripcion('');
      fetchIncidencias();
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

  const getStatusColor = (estado) => {
    switch (estado.toLowerCase()) {
      case 'resuelto':
        return 'bg-green-100 border-green-500 text-green-700';
      case 'en progreso':
        return 'bg-yellow-100 border-yellow-500 text-yellow-700';
      case 'pendiente':
        return 'bg-red-100 border-red-500 text-red-700';
      default:
        return 'bg-green-100 border-green-500 text-green-700';
    }
  };

  const handleLogout = () => {
    logout();
    setLocation('/login');
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div className="relative flex-1 bg-cover bg-center bg-fixed" 
        style={{ backgroundImage: "url('https://www.wyndhamhotels.com/content/dam/property-images/en-us/mt/mx/others/culiacan/28019/28019_exterior_view_1a.jpg?crop=5424:3616;*,*&downsize=1800:*')" }}>
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative container mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-white">Crear Incidencia</h1>
            <button 
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 text-white font-semibold rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              Cerrar Sesión
            </button>
          </div>
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="w-full lg:w-1/2 bg-white rounded-lg shadow-xl p-6">
              <h2 className="text-2xl font-bold mb-4 text-gray-800">Llenar reporte de incidencia</h2>
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
            </div>
            <div className="w-full lg:w-1/2 bg-white rounded-lg shadow-xl p-6">
              <h3 className="text-xl font-bold mb-4 text-gray-800">Estado de reporte</h3>
              <ul className="space-y-4 max-h-96 overflow-y-auto">
                {incidencias.length > 0 ? (
                  incidencias.map((incidencia) => (
                    <li key={incidencia.ID} className={`p-4 border-l-4 rounded-md ${getStatusColor(incidencia.Estado)}`}>
                      <h4 className="text-lg font-semibold">{incidencia.Asunto}</h4>
                      <p className="text-sm"><strong>Tipo:</strong> {incidencia.Tipo}</p>
                      <p className="text-sm"><strong>Descripción:</strong> {incidencia.Descripcion}</p>
                      <p className="text-sm"><strong>Estado:</strong> {incidencia.Estado}</p>
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
                              <li key={comment.ID} className="p-2 bg-gray-100 rounded-md">
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
      <Footer />
    </div>
  );
};

export default CreateIncidentPage;
