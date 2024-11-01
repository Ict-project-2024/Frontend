import { Routes, Route } from 'react-router-dom';
import NavigatorBar from '../components/NavigatorBar';
import SimpleNavigatorBar from '../components/SimpleNavigatorBar'; // Import the simplified navbar
import StudentDashboard from './StudentDashboard';
import AdminDashboard from './AdminDashboard';
import CheckingOfficerDashboard from './CheckingOfficerDashboard';
import News from './News';
import AboutUs from './AboutUs';
import '../assets/css/Home.css';
import { useAuth } from '../context/AuthContext';
import { useEffect, useState } from 'react';
import StudentProfile from './StudentProfile';

const Home = () => {
	const { user, isAuthenticated } = useAuth();
	const [userBio, setUserBio] = useState({});
	const [isCheckingOfficer, setIsCheckingOfficer] = useState(false);

	useEffect(() => {
		const storedUserBio = JSON.parse(sessionStorage.getItem('userBio'));

		if (isAuthenticated) {
			setUserBio(user);
		} else if (storedUserBio) {
			setUserBio(storedUserBio);
		} else {
			window.location.href = '/';
		}
	}, [user, isAuthenticated]);

	useEffect(() => {
		// Determine if user is a Checking Officer
		if (userBio.roles) {
			const role = userBio.roles[0].role;
			setIsCheckingOfficer(
				role === 'CheckingOfficer-medicalCenter' || role === 'CheckingOfficer-library'
			);
		}
	}, [userBio]);

	const renderDashboard = () => {
		if (!userBio.roles || userBio.roles.length === 0) return null;

		switch (userBio.roles[0].role) {
			case 'Admin':
				return <AdminDashboard userId={userBio._id} userName={{ first: userBio.firstName, last: userBio.lastName }} />;
			case 'CheckingOfficer-medicalCenter':
			case 'CheckingOfficer-library':
				return <CheckingOfficerDashboard role={userBio.roles[0].role} userId={userBio._id} userName={{ first: userBio.firstName, last: userBio.lastName }} />;
			default:
				return <StudentDashboard userId={userBio._id} userName={{ first: userBio.firstName, last: userBio.lastName }} />;
		}
	};

	return (
		<div className="home-container">
			{Object.keys(userBio).length > 0 && (
				<>
					{/* Conditionally render NavigatorBar or SimpleNavigatorBar */}
					{isCheckingOfficer ? (
						<SimpleNavigatorBar userName={{ first: userBio.firstName, last: userBio.lastName }} />
					) : (
						<NavigatorBar userName={{ first: userBio.firstName, last: userBio.lastName }} />
					)}
					<div className="home-content">
						<Routes>
							<Route path="/dashboard" element={renderDashboard()} />
							<Route path="/news" element={<News />} />
							<Route path="/about-us" element={<AboutUs />} />
							<Route path="/my-profile" element={<StudentProfile />} />
						</Routes>
					</div>
				</>
			)}
		</div>
	);
};

export default Home;
