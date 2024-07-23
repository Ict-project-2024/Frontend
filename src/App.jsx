import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage.jsx'; // Adjust the path as needed
import Dashboard from './pages/Dashboard.jsx'; // Adjust the path as needed
import FooterComponent from './components/FooterComponent.jsx'; // Adjust the path as needed
import ProtectedRoute from './components/ProtectedRoute.jsx'; // Adjust the path as needed
import './App.css'; // Adjust the path as needed

const App = () => {
    return (
        <div className="app-container">
            <Routes>
                <Route path="/" element={<LoginPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route 
                    path="/dashboard" 
                    element={
                        //<ProtectedRoute>
                            <Dashboard />
                        //</ProtectedRoute>
                    } 
                />
            </Routes>
            <FooterComponent />
        </div>
    );
};

export default App;
