import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import NavigatorBar from '../components/NavigatorBar'; // Adjust the path as needed
import FooterComponent from '../components/FooterComponent'; // Adjust the path as needed
import Dashboard from './Dashboard'; // Adjust the path as needed
import News from './News'; // Adjust the path as needed
import AboutUs from './AboutUs'; // Adjust the path as needed
import '../assets/css/Home.css'; // Ensure you have the correct path

const Home = () => {
  const location = useLocation();
  const userData = location.state;

  return (
    <div className="home-container">
      <NavigatorBar userName={{first: userData.firstName, last: userData.lastName}} />
      <div className="home-content">
        <Routes>
          <Route path="/dashboard" element={<Dashboard userId={userData._id} userName={{first: userData.firstName, last: userData.lastName}} /> } />
          <Route path="/news" element={<News />} />
          <Route path="/about-us" element={<AboutUs />} />
        </Routes>
       
      </div>

    </div>
  );
};

export default Home;
