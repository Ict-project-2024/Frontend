import { Routes, Route } from 'react-router-dom';
import NavigatorBar from '../components/NavigatorBar'; // Adjust the path as needed
// import FooterComponent from '../components/FooterComponent'; // Adjust the path as needed
import StudentDashboard from './StudentDashboard'; // Adjust the path as needed
import AdminDashboard from './AdminDashboard'; // Adjust the path as needed
import CheckingOfficerDashboard from './CheckingOfficerDashboard'; // Adjust the path as needed
import News from './News'; // Adjust the path as needed
import AboutUs from './AboutUs'; // Ensure you have the correct path
import '../assets/css/Home.css'; // Ensure you have the correct path
import { useAuth } from '../context/AuthContext';
import { useEffect, useState } from 'react';


const Home = () => {
	const { user, isAuthenticated } = useAuth();
	const [userBio, setUserBio] = useState({});

	useEffect(() => {
		const storedUserBio = JSON.parse(sessionStorage.getItem('userBio'));
		if (!isAuthenticated) {
			if (storedUserBio) {
				setUserBio(storedUserBio);
			} else {
				window.location.href = '/';
			}
		} else {
			setUserBio(user);
		}
	}, []);

	const renderDashboard = () => {
		switch (userBio.roles[0].role) {
			case 'Admin':
				return <AdminDashboard userId={userBio._id} userName={{ first: userBio.firstName, last: userBio.lastName }} />;
			case 'CheckingOfficer-medicalCenter':
				return <CheckingOfficerDashboard role={userBio.roles[0].role} userId={userBio._id} userName={{ first: userBio.firstName, last: userBio.lastName }} />;
			case 'CheckingOfficer-library':
				return <CheckingOfficerDashboard role={userBio.roles[0].role} userId={userBio._id} userName={{ first: userBio.firstName, last: userBio.lastName }} />;
			default:
				return <StudentDashboard userId={userBio._id} userName={{ first: userBio.firstName, last: userBio.lastName }} />;
		}
	};

	return (
		<div className="home-container">
			{Object.keys(userBio).length > 0 ? (
				<>
					<NavigatorBar userName={{ first: userBio.firstName, last: userBio.lastName }} />
					<div className="home-content">
						<Routes>
							<Route path="/dashboard" element={renderDashboard()} />
							<Route path="/news" element={<News />} />
							<Route path="/about-us" element={<AboutUs />} />
						</Routes>
					</div>
				</>
			) : null}
		</div>
	);
};

export default Home;
