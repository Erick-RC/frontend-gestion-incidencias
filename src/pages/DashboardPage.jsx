import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Footer } from '../components/Footer';

const Dashboard = () => {
  const [incidencias, setIncidencias] = useState([]);
  const [selectedIncidenciaId, setSelectedIncidenciaId] = useState(null);
  const [comentarios, setComentarios] = useState({});
  const [imagenes, setImagenes] = useState({});
  const [error, setError] = useState(null);
  const [changedIncidencias, setChangedIncidencias] = useState({});

  const fetchIncidencias = async () => {
    try {
      const response = await api.get('/api/incidencias');
      setIncidencias(response.data);
    } catch (error) {
      setError('Error al obtener las incidencias. Por favor, intente de nuevo.');
    }
  };

  const fetchComentarios = async (incidenciaId) => {
    if (comentarios[incidenciaId]) return; // No fetch if already loaded
    try {
      const response = await api.get(`/api/comentarios/${incidenciaId}`);
      setComentarios(prev => ({ ...prev, [incidenciaId]: response.data }));
    } catch (error) {
      setError('Error al obtener los comentarios. Por favor, intente de nuevo.');
    }
  };

  const handleUpdateStatus = (id, estado) => {
    setChangedIncidencias(prev => ({ ...prev, [id]: estado }));
  };

  const handleSaveChanges = async () => {
    try {
      const promises = Object.entries(changedIncidencias).map(([id, estado]) => {
        const incidencia = incidencias.find(inc => inc.ID.toString() === id);
        console.log('Updating Incidencia:', { id, estado, incidencia });
        return api.put(`/api/incidencias/${id}`, {
          asunto: incidencia.Asunto,
          tipo: incidencia.Tipo,
          descripcion: incidencia.Descripción, // Asegúrate de usar "Descripción" aquí
          estado: estado
        });
      });
      await Promise.all(promises);
      setIncidencias(incidencias.map(inc => 
        changedIncidencias[inc.ID] ? { ...inc, Estado: changedIncidencias[inc.ID] } : inc
      ));
      setChangedIncidencias({});
      setError(null);
    } catch (error) {
      setError('Error al guardar los cambios. Por favor, intente de nuevo.');
    }
  };

  const handleAddComment = async (incidenciaId) => {
    try {
      const contenido = comentarios[incidenciaId]?.newComment || '';
      if (!contenido.trim()) return;
      await api.post('/api/comentarios', { incidenciaId, contenido });
      fetchComentarios(incidenciaId);
      setComentarios(prev => ({
        ...prev,
        [incidenciaId]: { ...prev[incidenciaId], newComment: '' }
      }));
      setError(null);
    } catch (error) {
      setError('Error al añadir comentario. Por favor, intente de nuevo.');
    }
  };

  const handleSelectIncidencia = async (id) => {
    if (selectedIncidenciaId === id) {
      setSelectedIncidenciaId(null);
    } else {
      setSelectedIncidenciaId(id);
      if (!imagenes[id]) {
        try {
          const response = await api.get(`/api/imagenes/${id}`);
          setImagenes(prev => ({ ...prev, [id]: response.data }));
        } catch (error) {
          setError('Error al obtener las imágenes. Por favor, intente de nuevo.');
        }
      }
      fetchComentarios(id);
    }
  };

  useEffect(() => {
    fetchIncidencias();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <div className="relative flex-1 bg-cover bg-center bg-fixed"
           style={{ backgroundImage: "url('https://www.wyndhamhotels.com/content/dam/property-images/en-us/mt/mx/others/culiacan/28019/28019_exterior_view_1a.jpg?crop=5424:3616;*,*&downsize=1800:*')" }}>
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative flex items-center justify-center min-h-screen px-4 py-12">
          <div className="w-full max-w-4xl">
            <div className="bg-white rounded-lg shadow-xl overflow-hidden">
              <div className="px-10 py-8">
                <h1 className="text-3xl font-bold text-gray-800 text-center mb-6">Dashboard de Incidencias</h1>
                {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">{error}</div>}
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-700 mb-4">Incidencias</h2>
                    <ul className="space-y-4">
                      {incidencias.map(incidencia => (
                        <li key={incidencia.ID} className="bg-gray-100 p-4 rounded-lg">
                          <h3 className="text-lg font-semibold text-gray-800">{incidencia.Asunto}</h3>
                          <p className="text-gray-600 mt-2">{incidencia.Descripcion}</p>
                          <div className="mt-4 flex items-center space-x-4">
                            <select
                              value={changedIncidencias[incidencia.ID] || incidencia.Estado}
                              onChange={(e) => handleUpdateStatus(incidencia.ID, e.target.value)}
                              className="px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                              <option value="pendiente">Pendiente</option>
                              <option value="en_progreso">En Progreso</option>
                              <option value="resuelta">Resuelta</option>
                            </select>
                            <button
                              onClick={() => handleSelectIncidencia(incidencia.ID)}
                              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300"
                            >
                              {selectedIncidenciaId === incidencia.ID ? 'Ocultar Detalles' : 'Ver Detalles'}
                            </button>
                          </div>
                          {selectedIncidenciaId === incidencia.ID && (
                            <div className="mt-4">
                              <h4 className="text-lg font-semibold text-gray-700 mb-2">Imágenes</h4>
                              <div className="grid grid-cols-2 gap-4">
                                {imagenes[incidencia.ID]?.map(img => (
                                  <div key={img.ID} className="bg-gray-200 p-2 rounded-lg">
                                    <img src={`http://localhost:3000/uploads/${img.URL}`} alt={`Imagen ${img.ID}`} className="w-full h-auto rounded" />
                                  </div>
                                ))}
                              </div>
                              <div className="mt-4">
                                <h4 className="text-lg font-semibold text-gray-700 mb-2">Comentarios</h4>
                                <div className="space-y-2">
                                  {comentarios[incidencia.ID]?.map(comment => (
                                    <div key={comment.ID} className="bg-gray-200 p-2 rounded-lg">
                                      <p>{comment.Contenido}</p>
                                    </div>
                                  ))}
                                </div>
                                <div className="mt-4 flex items-center space-x-2">
                                  <input
                                    type="text"
                                    value={comentarios[incidencia.ID]?.newComment || ''}
                                    onChange={(e) => setComentarios(prev => ({ 
                                      ...prev, 
                                      [incidencia.ID]: { 
                                        ...(prev[incidencia.ID] || {}), 
                                        newComment: e.target.value 
                                      } 
                                    }))}
                                    placeholder="Añadir comentario"
                                    className="flex-grow px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                  />
                                  <button
                                    onClick={() => handleAddComment(incidencia.ID)}
                                    className="px-4 py-2 bg-windhamBlue text-white rounded-lg hover:bg-green-700 transition duration-300"
                                  >
                                    Añadir Comentario
                                  </button>
                                </div>
                              </div>
                            </div>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                {Object.keys(changedIncidencias).length > 0 && (
                  <div className="mt-6">
                    <button
                      onClick={handleSaveChanges}
                      className="w-full px-4 py-2 bg-windhamBlue text-white rounded-lg hover:bg-green-700 transition duration-300"
                    >
                      Guardar Cambios
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Dashboard;