import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Footer } from '../components/Footer';
import { motion } from 'framer-motion';
import { FaClipboardList, FaSpinner, FaCheckCircle, FaPlus, FaComments, FaSignOutAlt } from 'react-icons/fa';
import { useAuth } from '../hooks/useAuth'; // Asegúrate de importar useAuth

const Dashboard = () => {
  const { logout } = useAuth(); // Usa el hook useAuth para obtener la función logout
  const [incidencias, setIncidencias] = useState([]);
  const [selectedIncidenciaId, setSelectedIncidenciaId] = useState(null);
  const [comentarios, setComentarios] = useState({});
  const [imagenes, setImagenes] = useState({});
  const [error, setError] = useState(null);
  const [changedIncidencias, setChangedIncidencias] = useState({});
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('all');

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

  const handleSaveChanges = async (id) => {
    try {
      const incidencia = incidencias.find(inc => inc.ID === id);
      const estado = changedIncidencias[id];
      console.log('Datos a enviar:', {
        id,
        asunto: incidencia.Asunto,
        tipo: incidencia.Tipo,
        descripcion: incidencia.Descripción,
        estado
      });

      await api.put(`/api/incidencias/${id}`, {
        asunto: incidencia.Asunto,
        tipo: incidencia.Tipo,
        descripcion: incidencia.Descripción,
        estado
      });

      setIncidencias(incidencias.map(inc =>
        inc.ID === id ? { ...inc, Estado: estado } : inc
      ));
      setChangedIncidencias(prev => {
        const newState = { ...prev };
        delete newState[id];
        return newState;
      });
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
      const response = await api.get(`/api/comentarios/${incidenciaId}`);
      setComentarios(prev => ({
        ...prev,
        [incidenciaId]: {
          ...response.data,
          newComment: ''
        }
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

  const getBackgroundColor = (estado) => {
    switch (estado) {
      case 'pendiente':
        return 'bg-orange-300';
      case 'en progreso':
        return 'bg-yellow-200';
      case 'resuelto':
        return 'bg-green-200';
      default:
        return 'bg-gray-100';
    }
  };

  const getStatusIcon = (estado) => {
    switch (estado) {
      case 'pendiente':
        return <FaClipboardList className="text-orange-600" />;
      case 'en progreso':
        return <FaSpinner className="text-yellow-500 animate-spin" />;
      case 'resuelto':
        return <FaCheckCircle className="text-green-500" />;
      default:
        return null;
    }
  };

  const renderIncidencias = (estado) => {
    return incidencias
      .filter(inc => inc.Estado === estado)
      .map(incidencia => (
        <motion.li
          key={incidencia.ID}
          className={`p-4 sm:p-6 rounded-lg shadow-md ${getBackgroundColor(incidencia.Estado)} transition-all duration-300 hover:shadow-xl`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-800">{incidencia.Asunto}</h3>
            {getStatusIcon(incidencia.Estado)}
          </div>
          <p className="text-sm sm:text-base text-gray-600 mb-4">{incidencia.Descripción}</p>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0 sm:space-x-2">
            <select
              value={changedIncidencias[incidencia.ID] || incidencia.Estado}
              onChange={(e) => handleUpdateStatus(incidencia.ID, e.target.value)}
              className="w-full sm:w-auto px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="pendiente">Pendiente</option>
              <option value="en progreso">En Progreso</option>
              <option value="resuelto">Resuelta</option>
            </select>
            <div className="flex space-x-2 w-full sm:w-auto">
              <button
                onClick={() => handleSelectIncidencia(incidencia.ID)}
                className="flex-grow sm:flex-grow-0 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300 flex items-center justify-center"
              >
                {selectedIncidenciaId === incidencia.ID ? 'Ocultar Detalles' : 'Ver Detalles'}
                <FaPlus className={`ml-2 transition-transform duration-300 ${selectedIncidenciaId === incidencia.ID ? 'rotate-45' : ''}`} />
              </button>
              {changedIncidencias[incidencia.ID] && (
                <button
                  onClick={() => handleSaveChanges(incidencia.ID)}
                  className="flex-grow sm:flex-grow-0 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-300"
                >
                  Guardar Cambios
                </button>
              )}
            </div>
          </div>
          {selectedIncidenciaId === incidencia.ID && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-6 bg-white rounded-lg p-4 shadow-inner"
            >
              <h4 className="text-lg font-semibold text-gray-700 mb-4">Imágenes</h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
                {imagenes[incidencia.ID]?.map(img => (
                  <motion.div
                    key={img.ID}
                    className="bg-gray-200 p-2 rounded-lg overflow-hidden"
                    whileHover={{ scale: 1.05 }}
                  >
                    <img src={`http://localhost:3000/uploads/${img.URL}`} alt={`Imagen ${img.ID}`} className="w-full h-32 sm:h-40 object-cover rounded" />
                  </motion.div>
                ))}
              </div>
              <h4 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
                <FaComments className="mr-2" /> Comentarios
              </h4>
              <div className="space-y-3 mb-4">
                {(Array.isArray(comentarios[incidencia.ID]) ? comentarios[incidencia.ID] : []).map(comment => (
                  <motion.div
                    key={comment.ID}
                    className="bg-gray-100 p-3 rounded-lg"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                  >
                    <p>{comment.Contenido}</p>
                  </motion.div>
                ))}
              </div>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
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
                  className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300 flex items-center justify-center"
                >
                  <FaPlus className="mr-2" />
                  <span className="sm:hidden">Añadir</span>
                  <span className="hidden sm:inline">Añadir Comentario</span>
                </button>
              </div>
            </motion.div>
          )}
        </motion.li>
      ));
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100" style={{ backgroundImage: 'url(/path/to/your/background-image.jpg)', backgroundSize: 'cover', backgroundAttachment: 'fixed' }}>
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Dashboard de Incidencias</h1>
          <button
            onClick={() => logout()}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center"
          >
            <FaSignOutAlt className="mr-2" />
            Cerrar Sesión
          </button>
        </div>
      </header>
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6" role="alert">
            <p className="font-bold">Error</p>
            <p>{error}</p>
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <FaClipboardList className="mr-2 text-orange-500" /> Pendientes
            </h2>
            <ul className="space-y-4">
              {renderIncidencias('pendiente')}
            </ul>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <FaSpinner className="mr-2 text-yellow-500 animate-spin" /> En Progreso
            </h2>
            <ul className="space-y-4">
              {renderIncidencias('en progreso')}
            </ul>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <FaCheckCircle className="mr-2 text-green-500" /> Resueltas
            </h2>
            <ul className="space-y-4">
              {renderIncidencias('resuelto')}
            </ul>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;
