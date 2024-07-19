import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { Link } from 'wouter';

const HomePage = () => {
  const { user, logout } = useAuth();

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <div className="p-8 bg-white shadow-md rounded-lg">
          <h1 className="text-3xl font-bold mb-4 text-center text-gray-800">Bienvenido</h1>
          <p className="mb-6 text-center text-gray-600">Por favor, inicia sesión o regístrate para continuar.</p>
          <div className="flex justify-center space-x-4">
            <Link href="/login">
              <a className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300">Iniciar sesión</a>
            </Link>
            <Link href="/register">
              <a className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition duration-300">Registrarse</a>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="p-8 bg-white shadow-md rounded-lg">
        <h1 className="text-3xl font-bold mb-4 text-center text-gray-800">Bienvenido, {user.nombre}</h1>
        <p className="mb-6 text-center text-gray-600">Tipo de usuario: {user.tipo}</p>
        <div className="flex justify-center">
          <button 
            onClick={logout}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition duration-300"
          >
            Cerrar sesión
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;