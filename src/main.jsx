import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx'; // Adjust the path as needed
import { AuthProvider } from './context/AuthContext.jsx'; // Adjust the path as needed
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);
