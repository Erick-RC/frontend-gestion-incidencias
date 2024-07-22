import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { LoginFooter } from '../components/LoginFooter';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();

  const handleSubmit = (e) => {
    e.preventDefault();
    login({ email, password });
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div className="relative flex-1 bg-cover bg-center bg-fixed" 
        style={{ backgroundImage: "url('https://www.wyndhamhotels.com/content/dam/property-images/en-us/mt/mx/others/culiacan/28019/28019_exterior_view_1a.jpg?crop=5424:3616;*,*&downsize=1800:*')" }}>
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative flex items-center justify-center min-h-screen px-4">
          <div className="w-full max-w-md">
            <div className="bg-white rounded-lg shadow-xl overflow-hidden">
              <div className="px-10 py-12">
                <h2 className="text-3xl font-bold text-gray-800 text-center mb-4">
                  Bienvenido a Wyndham Incidencias
                </h2>
                <p className="text-center text-gray-600 mb-8">
                  Inicia sesión para llenar un reporte.
                </p>
                <form onSubmit={handleSubmit}>
                  <div className="space-y-6">
                    <div>
                      <label className="text-sm font-bold text-gray-700 block mb-2" htmlFor="email">
                        Correo electrónico
                      </label>
                      <input
                        type="email"
                        id="email"
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="tu@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <label className="text-sm font-bold text-gray-700 block mb-2" htmlFor="password">
                        Contraseña
                      </label>
                      <input
                        type="password"
                        id="password"
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Tu contraseña"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div className="mt-8">
                    <button
                      type="submit"
                      className="w-full px-4 py-3 rounded-lg font-bold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:shadow-outline transition duration-300"
                    >
                      Iniciar sesión
                    </button>
                  </div>
                </form>
              </div>
              <div className="px-10 py-4 bg-gray-100 border-t border-gray-200 flex justify-between">
                <a href="#" className="text-sm text-blue-600 hover:underline">¿Olvidaste tu contraseña?</a>
                <a href="#" className="text-sm text-blue-600 hover:underline">Crear cuenta</a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <LoginFooter />
    </div>
  );
};

export default LoginPage;
