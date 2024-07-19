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
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative flex items-center justify-center min-h-screen">
          <div className="relative px-8 py-12 text-left bg-white shadow-lg max-w-md mx-auto">
            <h3 className="text-4xl font-serif text-center mb-4">
              ¡Bienvenido!
            </h3>
            <p className="text-center font-serif text-base mb-8">
              Inicia sesión en Wyndham Incidencias para llenar un reporte.
            </p>
            <form onSubmit={handleSubmit}>
              <div className="mt-4">
                <div>
                  <label className="block" htmlFor="email">Email</label>
                  <input
                    type="email"
                    placeholder="Email"
                    className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="mt-4">
                  <label className="block" htmlFor="password">Contraseña</label>
                  <input
                    type="password"
                    placeholder="Contraseña"
                    className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="flex items-baseline justify-between">
                  <button className="w-full px-6 py-2 mt-6 text-white bg-blue-900 rounded-lg hover:bg-blue-700">Iniciar sesión</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
      <LoginFooter/>
    </div>
  );
};

export default LoginPage;
