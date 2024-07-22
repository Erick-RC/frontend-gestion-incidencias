import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Footer } from '../components/Footer';

const Dashboard = () => {
  const [incidencias, setIncidencias] = useState([]);
  const [selectedIncidencia, setSelectedIncidencia] = useState(null);
  const [comentario, setComentario] = useState('');

  const fetchIncidencias = async () => {
    try {
      const response = await api.get('/api/incidencias');
      setIncidencias(response.data);
    } catch (error) {
      console.error('Error al obtener las incidencias:', error);
    }
  };

  const handleUpdateStatus = async (id, estado) => {
    try {
      await api.put(`/api/incidencias/${id}`, { estado });
      fetchIncidencias();
    } catch (error) {
      console.error('Error al actualizar la incidencia:', error);
    }
  };

  const handleAddComment = async (incidenciaId) => {
    try {
      await api.post('/api/comentarios', { incidenciaId, contenido: comentario });
      setComentario('');
      fetchIncidencias();
    } catch (error) {
      console.error('Error al añadir comentario:', error);
    }
  };

  const handleSelectIncidencia = async (id) => {
    try {
      const response = await api.get(`/api/imagenes/${id}`);
      setSelectedIncidencia(response.data);
    } catch (error) {
      console.error('Error al obtener las imágenes:', error);
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
                              value={incidencia.Estado}
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
                              Ver Imágenes
                            </button>
                          </div>
                          <div className="mt-4 flex items-center space-x-2">
                            <input
                              type="text"
                              value={comentario}
                              onChange={(e) => setComentario(e.target.value)}
                              placeholder="Añadir comentario"
                              className="flex-grow px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <button
                              onClick={() => handleAddComment(incidencia.ID)}
                              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-300"
                            >
                              Añadir Comentario
                            </button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                  {selectedIncidencia && (
                    <div>
                      <h2 className="text-xl font-semibold text-gray-700 mb-4">Imágenes de la Incidencia</h2>
                      <div className="grid grid-cols-2 gap-4">
                        {selectedIncidencia.map(img => (
                          <div key={img.ID} className="bg-gray-100 p-2 rounded-lg">
                            <img src={`http://localhost:3000/uploads/${img.URL}`} alt={`Imagen ${img.ID}`} className="w-full h-auto rounded" />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
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