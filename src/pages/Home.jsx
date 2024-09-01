import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import NavigatorBar from '../components/NavigatorBar'; // Adjust the path as needed
import FooterComponent from '../components/FooterComponent'; // Adjust the path as needed
import StudentDashboard from './StudentDashboard'; // Adjust the path as needed
import AdminDashboard from './AdminDashboard'; // Adjust the path as needed
import CheckingOfficerDashboard from './CheckingOfficerDashboard'; // Adjust the path as needed
import News from './News'; // Adjust the path as needed
import AboutUs from './AboutUs'; // Ensure you have the correct path
import '../assets/css/Home.css'; // Ensure you have the correct path

const Home = () => {
    const location = useLocation();
    // const userData = location.state;  

    // Temporary hardcoded user data for development
    const userData = {
    _id: "45eytbu8bq7iyn9oqefmlik",
      firstName: 'John',
      lastName: 'Doe',
      role: '', // Hardcoded as 'Admin' to render AdminDashboard
    };
  // Determine which dashboard to display based on the user's role
  const renderDashboard = () => {
    switch(userData.role) {
      case 'Admin':
        return <AdminDashboard userId={userData._id} userName={{first: userData.firstName, last: userData.lastName}} />;
      case 'CheckingOfficer':
        return <CheckingOfficerDashboard role="MC" userId={userData._id} userName={{first: userData.firstName, last: userData.lastName}} />;
      default:
        return <StudentDashboard userId={userData._id} userName={{first: userData.firstName, last: userData.lastName}} />;
    }
  };

	return (
		<div className="home-container">
			<NavigatorBar userName={{ first: userData.firstName, last: userData.lastName }} />
			<div className="home-content">
				<Routes>
					<Route path="/dashboard" element={renderDashboard()} />
					<Route path="/news" element={<News />} />
					<Route path="/about-us" element={<AboutUs />} />
				</Routes>
			</div>
		</div>
	);
};

export default Home;
