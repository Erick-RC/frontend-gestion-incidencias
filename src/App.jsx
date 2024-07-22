import React from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { Route, Switch } from 'wouter';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage'; // Asegúrate de tener esta página

function App() {
  return (
    <AuthProvider>
      <Switch>
        <Route path="/" component={HomePage} />
        <Route path="/login" component={LoginPage} />
        <Route path="/register" component={RegisterPage} />
        <Route path="/dashboard" component={DashboardPage} /> {/* Agrega la ruta del dashboard */}
      </Switch>
    </AuthProvider>
  );
}

export default App;
