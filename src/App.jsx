import React from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { Route, Switch } from 'wouter';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import RegisterPage from './pages/RegisterPage';

function App() {
  return (
    <AuthProvider>
      <Switch>
        <Route path="/" component={HomePage} />
        <Route path="/login" component={LoginPage} />
        <Route path="/register" component={RegisterPage} />
      </Switch>
    </AuthProvider>
  );
}

export default App;