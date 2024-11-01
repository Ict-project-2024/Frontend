import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Avatar } from 'antd';
import { LogoutOutlined } from '@ant-design/icons';
import { useAuth } from '../context/AuthContext.jsx';

const SimpleNavigatorBar = ({ userName }) => {
	const { user } = useAuth();
	const navigate = useNavigate();
	const [avatarUrl, setAvatarUrl] = useState('');

	useEffect(() => {
		const storedUserBio = JSON.parse(sessionStorage.getItem('userBio'));

		if (storedUserBio) {
			setAvatarUrl(storedUserBio.profileImage);
		} else if (user && user._id) {
			sessionStorage.setItem('userBio', JSON.stringify(user));
			setAvatarUrl(user.profileImage);
		} else {
			window.location.href = '/';
		}
	}, [user]);

	const handleLogout = () => {
		document.cookie.split(';').forEach((cookie) => {
			const cookieName = cookie.split('=')[0];
			document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
		});

		localStorage.clear();
		sessionStorage.clear();
		navigate('/login');
	};

	// Internal CSS styles
	const styles = {
		navigatorBar: {
			display: 'flex',
			justifyContent: 'space-between',
			alignItems: 'center',
			padding: '10px 20px',
			backgroundColor: '#fff',
			boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
		},
		logoContainer: {
			display: 'flex',
			alignItems: 'center',
		},
		logo: {
			height: '40px', // Adjust logo height as needed
			marginRight: '20px',
		},
		userSection: {
			display: 'flex',
			alignItems: 'center',
		},
		avatar: {
			width: '40px',
			height: '40px',
			marginRight: '10px',
		},
		username: {
			fontSize: '16px',
			fontWeight: '500',
			marginRight: '15px',
		},
		icon: {
			fontSize: '20px',
			cursor: 'pointer',
		},
	};

	return (
		<div style={styles.navigatorBar}>
			<div style={styles.logoContainer}>
				<img src="./images/logo.png" alt="Unimo Logo" style={styles.logo} /> {/* Update path as needed */}
			</div>
			<div style={styles.userSection}>
				<Avatar src={avatarUrl} style={styles.avatar} />
				<span style={styles.username}>{userName.first} {userName.last}</span>
				<LogoutOutlined style={styles.icon} onClick={handleLogout} />
			</div>
		</div>
	);
};

export default SimpleNavigatorBar;
