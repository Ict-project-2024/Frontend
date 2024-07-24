import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage.jsx';
import Home from './pages/Home.jsx'; // Adjust the path as needed
import ProtectedRoute from './components/ProtectedRoute.jsx'; // Adjust the path as needed
import './App.css';
import FooterComponent from './components/FooterComponent.jsx'; // Adjust the path as needed

const App = () => {
  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/*" element={
            // <ProtectedRoute>
                <Home />
            // </ProtectedRoute>
        } />
        </Routes>
        
      </div>
      
    </Router>
  );
};

export default App;
