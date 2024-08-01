import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Footer } from '../components/Footer';
import { motion, AnimatePresence } from 'framer-motion';
import { FaClipboardList, FaSpinner, FaCheckCircle, FaPlus, FaComments, FaBars } from 'react-icons/fa';


const Dashboard = () => {
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
      .filter(inc => activeTab === 'all' || inc.Estado === estado)
      .map(incidencia => (
        <motion.li
          key={incidencia.ID}
          className={`p-4 md:p-6 rounded-lg shadow-md ${getBackgroundColor(incidencia.Estado)} transition-all duration-300 hover:shadow-xl`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg md:text-xl font-semibold text-gray-800">{incidencia.Asunto}</h3>
            {getStatusIcon(incidencia.Estado)}
          </div>
          <p className="text-sm md:text-base text-gray-600 mb-4">{incidencia.Descripción}</p>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between space-y-2 md:space-y-0 md:space-x-2">
            <select
              value={changedIncidencias[incidencia.ID] || incidencia.Estado}
              onChange={(e) => handleUpdateStatus(incidencia.ID, e.target.value)}
              className="w-full md:w-auto px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="pendiente">Pendiente</option>
              <option value="en progreso">En Progreso</option>
              <option value="resuelto">Resuelta</option>
            </select>
            <div className="flex space-x-2 w-full md:w-auto">
              <button
                onClick={() => handleSelectIncidencia(incidencia.ID)}
                className="flex-grow md:flex-grow-0 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300 flex items-center justify-center"
              >
                {selectedIncidenciaId === incidencia.ID ? 'Ocultar' : 'Ver Detalles'}
                <FaPlus className={`ml-2 transition-transform duration-300 ${selectedIncidenciaId === incidencia.ID ? 'rotate-45' : ''}`} />
              </button>
              {changedIncidencias[incidencia.ID] && (
                <button
                  onClick={() => handleSaveChanges(incidencia.ID)}
                  className="flex-grow md:flex-grow-0 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-300"
                >
                  Guardar
                </button>
              )}
            </div>
          </div>
          <AnimatePresence>
            {selectedIncidenciaId === incidencia.ID && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-4 bg-white rounded-lg p-4 shadow-inner"
              >
                <h4 className="text-lg font-semibold text-gray-700 mb-4">Imágenes</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                  {imagenes[incidencia.ID]?.map(img => (
                    <motion.div
                      key={img.ID}
                      className="bg-gray-200 p-2 rounded-lg overflow-hidden"
                      whileHover={{ scale: 1.05 }}
                    >
                      <img src={`http://localhost:3000/uploads/${img.URL}`} alt={`Imagen ${img.ID}`} className="w-full h-32 md:h-40 object-cover rounded" />
                    </motion.div>
                  ))}
                </div>
                <h4 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
                  <FaComments className="mr-2" /> Comentarios
                </h4>
                <div className="space-y-3 mb-4">
                  {comentarios[incidencia.ID]?.map(comment => (
                    <motion.div
                      key={comment.ID}
                      className="bg-gray-100 p-3 rounded-lg"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                    >
                      <p className="text-sm">{comment.Contenido}</p>
                    </motion.div>
                  ))}
                </div>
                <div className="flex items-center space-x-2">
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
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300 flex items-center"
                  >
                    <FaPlus className="mr-2" /> Añadir
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.li>
      ));
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Dashboard de Incidencias</h1>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="md:hidden bg-blue-600 text-white p-2 rounded-lg"
          >
            <FaBars />
          </button>
        </div>
      </header>
      <div className="flex flex-grow">
        <aside className={`${sidebarOpen ? 'block' : 'hidden'} md:block bg-white w-64 shadow-lg fixed inset-y-0 left-0 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 transition duration-200 ease-in-out`}>
          <nav className="mt-16 md:mt-5 px-4">
            <button
              onClick={() => setActiveTab('all')}
              className={`w-full text-left py-2 px-4 rounded ${activeTab === 'all' ? 'bg-blue-100 text-blue-800' : 'hover:bg-gray-100'}`}
            >
              Todas las incidencias
            </button>
            <button
              onClick={() => setActiveTab('pendiente')}
              className={`w-full text-left py-2 px-4 rounded ${activeTab === 'pendiente' ? 'bg-blue-100 text-blue-800' : 'hover:bg-gray-100'}`}
            >
              Pendientes
            </button>
            <button
              onClick={() => setActiveTab('en progreso')}
              className={`w-full text-left py-2 px-4 rounded ${activeTab === 'en progreso' ? 'bg-blue-100 text-blue-800' : 'hover:bg-gray-100'}`}
            >
              En Progreso
            </button>
            <button
              onClick={() => setActiveTab('resuelto')}
              className={`w-full text-left py-2 px-4 rounded ${activeTab === 'resuelto' ? 'bg-blue-100 text-blue-800' : 'hover:bg-gray-100'}`}
            >
              Resueltas
            </button>
          </nav>
        </aside>
        <main className="flex-grow p-4 md:p-8 md:ml-64">
          {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6" role="alert">
              <p className="font-bold">Error</p>
              <p>{error}</p>
            </div>
          )}
          <ul className="space-y-4">
            {renderIncidencias(activeTab)}
          </ul>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default Dashboard;
