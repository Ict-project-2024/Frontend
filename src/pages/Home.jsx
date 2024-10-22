import { Routes, Route, useLocation } from 'react-router-dom';
import NavigatorBar from '../components/NavigatorBar'; // Adjust the path as needed
// import FooterComponent from '../components/FooterComponent'; // Adjust the path as needed
import StudentDashboard from './StudentDashboard'; // Adjust the path as needed
import AdminDashboard from './AdminDashboard'; // Adjust the path as needed
import CheckingOfficerDashboard from './CheckingOfficerDashboard'; // Adjust the path as needed
import News from './News'; // Adjust the path as needed
import AboutUs from './AboutUs'; // Ensure you have the correct path
import '../assets/css/Home.css'; // Ensure you have the correct path
import { useAuth } from '../context/AuthContext';


const Home = () => {
	const { user } = useAuth();
	console.log(user);
	const location = useLocation();
	localStorage.setItem('userData', JSON.stringify(location.state || {}));
	const userData = JSON.parse(localStorage.getItem('userData'));
	//userData.role = "Admin"; // Temporary hardcoded user data for development

	// Temporary hardcoded user data for development
	/* const userData = {
	_id: "45eytbu8bq7iyn9oqefmlik",
	  firstName: 'John',
	  lastName: 'Doe',
	  role: 'Admin', // Hardcoded as 'Admin' to render AdminDashboard
	}; */
	// Determine which dashboard to display based on the user's role
	
	//corrected admin login dont use harcoded data
	const renderDashboard = () => {
		switch (user.roles[0].role) {
			case 'Admin':
				return <AdminDashboard userId={user._id} userName={{ first: user.firstName, last: user.lastName }} />;
			case 'CheckingOfficer':
				return <CheckingOfficerDashboard role="MC" userId={user._id} userName={{ first: user.firstName, last: user.lastName }} />;
			default:
				return <StudentDashboard userId={user._id} userName={{ first: user.firstName, last: user.lastName }} />;
		}
	};

	return (
		<div className="home-container">
			<NavigatorBar userName={{ first: user.firstName, last: user.lastName }} />
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
