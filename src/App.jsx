import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage.jsx';
import Home from './pages/Home.jsx';
import VerifyEmail from './pages/VerifyEmail.jsx';

const App = () => {
  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/*" element={
            <Home />
          } />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
