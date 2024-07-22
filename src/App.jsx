import React from 'react';
import LoginComponent from './pages/LoginPage.jsx'; // Adjust the path as needed
import FooterComponent from './components/FooterComponent.jsx'; // Adjust the path as needed
import './App.css'; // Adjust the path as needed

const App = () => {
    return (
        <div className="app-container">
            <LoginComponent />
            <FooterComponent />
        </div>
    );
};

export default App;
