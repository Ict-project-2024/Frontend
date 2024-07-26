import React from 'react';
import { Routes, Route } from 'react-router-dom';
import NavigatorBar from '../components/NavigatorBar'; // Adjust the path as needed
import FooterComponent from '../components/FooterComponent'; // Adjust the path as needed
import Dashboard from './Dashboard'; // Adjust the path as needed
import News from './News'; // Adjust the path as needed
import AboutUs from './AboutUs'; // Adjust the path as needed
import '../assets/css/Home.css'; // Ensure you have the correct path

const Home = () => {
  return (
    <div className="home-container">
      <NavigatorBar />
      <div className="home-content">
        <Routes>
          <Route path="/dashboard" element={<Dashboard /> } />
          <Route path="/news" element={<News />} />
          <Route path="/about-us" element={<AboutUs />} />
        </Routes>
<<<<<<< HEAD
       
      </div>
     <FooterComponent />
=======
      </div>
      <FooterComponent className="footer" />
>>>>>>> b8951fe0705282ae3e86af16389dfe4e89581081
    </div>
  );
};

export default Home;
