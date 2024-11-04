import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, Badge, Avatar } from 'antd';
import { MenuOutlined, BellOutlined, LogoutOutlined, CloseOutlined } from '@ant-design/icons';
import { useAuth } from '../context/AuthContext.jsx';
import '../assets/css/NavigatorBar.css';

const NavigatorBar = ({ userName }) => {
	const { user } = useAuth();
	const navigate = useNavigate();
	const [username, setUsername] = useState('');
	const [notifications, setNotifications] = useState(0);
	const [avatarUrl, setAvatarUrl] = useState('');
	const [menuVisible, setMenuVisible] = useState(false);
	const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

	useEffect(() => {
		const storedUserBio = JSON.parse(sessionStorage.getItem('userBio'));

		if (storedUserBio) {
			setUsername(`${storedUserBio.firstName} ${storedUserBio.lastName}`);
			setAvatarUrl(storedUserBio.profileImage);
		} else if (user && user._id) {
			sessionStorage.setItem('userBio', JSON.stringify(user));
			setUsername(`${user.firstName} ${user.lastName}`);
			setAvatarUrl(user.profileImage);
		} else {
			window.location.href = '/';
		}
	}, [user]);

	const handleResize = () => {
		const isCurrentlyMobile = window.innerWidth <= 768;
		setIsMobile(isCurrentlyMobile);
		if (!isCurrentlyMobile) {
			setMenuVisible(false); // Hide mobile menu on desktop view
		}
	};

	useEffect(() => {
		window.addEventListener('resize', handleResize);
		return () => window.removeEventListener('resize', handleResize);
	}, []);

	const handleLogout = () => {
		document.cookie.split(';').forEach((cookie) => {
			const cookieName = cookie.split('=')[0];
			document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
		});

		localStorage.clear();
		sessionStorage.clear();

		navigate('/login');
	};

	const toggleMenu = () => {
		setMenuVisible(!menuVisible);
	};

	return (
		<div className="navigator-bar">
			<div className="hamburger-menu" onClick={toggleMenu}>
				{menuVisible ? <CloseOutlined /> : <MenuOutlined />}
			</div>
			<div className="logo">
			<a href="/dashboard">
				<img src="./images/logo.png" alt="Unimo Logo" />
			</a>
			</div>

			{!isMobile && (
				<div className="nav-menu">
					<Menu mode="horizontal" defaultSelectedKeys={['live-status']}>
						<Menu.Item key="live-status">
							<Link to="/dashboard">Live Status</Link>
						</Menu.Item>
						<Menu.Item key="news">
							<Link to="/news">News</Link>
						</Menu.Item>
						<Menu.Item key="my-profile">
							<Link to="/my-profile">My Profile</Link>
						</Menu.Item>
						<Menu.Item key="about-us">
							<Link to="/about-us">About Us</Link>
						</Menu.Item>
					</Menu>
				</div>
			)}
			{!isMobile && (
				<div className="user-section">
					<Badge count={notifications} className="notification-badge">
						<BellOutlined className="icon" />
					</Badge>
					<Avatar
					src={avatarUrl}
					className="avatar"
					onClick={() => navigate('/my-profile')}
					/>
					<span className="username">{userName.first} {userName.last}</span>
					<LogoutOutlined className="icon" onClick={handleLogout} />
				</div>
			)}
			{menuVisible && isMobile && (
				<div className={`dropdown-menu ${menuVisible ? 'visible' : ''}`}>
					<Menu mode="vertical" defaultSelectedKeys={['live-status']}>
						<Menu.Item key="live-status" onClick={toggleMenu}>
							<Link to="/dashboard">Live Status</Link>
						</Menu.Item>
						<Menu.Item key="news" onClick={toggleMenu}>
							<Link to="/news">News</Link>
						</Menu.Item>
						<Menu.Item key="my-profile" onClick={toggleMenu}>
							<Link to="/my-profile">My Profile</Link>
						</Menu.Item>
						<Menu.Item key="about-us" onClick={toggleMenu}>
							<Link to="/about-us">About Us</Link>
						</Menu.Item>
						<Menu.Item key="notifications" onClick={toggleMenu}>
							<Badge count={notifications}>
								<Link to="/notifications">Notifications</Link>
							</Badge>
						</Menu.Item>
						<Menu.Item key="logout" onClick={toggleMenu}>
							<LogoutOutlined className="icon" onClick={handleLogout} />
							<span onClick={handleLogout}>Log out</span>
						</Menu.Item>
					</Menu>
				</div>
			)}
		</div>
	);
};

export default NavigatorBar;
