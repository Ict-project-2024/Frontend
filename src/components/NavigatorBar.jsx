import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, Badge, Avatar } from 'antd';
import { BellOutlined, LogoutOutlined } from '@ant-design/icons';
import { useAuth } from '../components/context/AuthContext.jsx';
import '../assets/css/NavigatorBar.css'; // Ensure you have the correct path

const NavigatorBar = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState('FirstName');
  const [notifications, setNotifications] = useState(11);
  const [avatarUrl, setAvatarUrl] = useState('src/assets/images/avatar.png');

  useEffect(() => {
    // Simulate fetching user data from backend
    // You can replace this with an actual API call
    const fetchUserData = () => {
      // Dummy values
      setUsername('FirstName');
      setNotifications(11);
      setAvatarUrl('src/assets/images/avatar.png');
    };

    fetchUserData();
  }, []);

  const handleLogout = () => {
    logout(); // Update the authentication state
    navigate('/login'); // Redirect to login page or any other page
  };

  return (
    <div className="navigator-bar">
      <div className="logo">
        <img src="src/assets/images/logo.png" alt="Unimo Logo" />
      </div>
      <Menu mode="horizontal" className="nav-menu" defaultSelectedKeys={['live-status']}>
        <Menu.Item key="live-status">
          <Link to="/dashboard">Live Status</Link>
        </Menu.Item>
        <Menu.Item key="news">
          <Link to="/news">News</Link>
        </Menu.Item>
        <Menu.Item key="about-us">
          <Link to="/about-us">About Us</Link>
        </Menu.Item>
      </Menu>
      <div className="user-section">
        <Badge count={notifications} className="notification-badge">
          <BellOutlined className="icon" />
        </Badge>
        <Avatar src={avatarUrl} className="avatar" />
        <span className="username">{username}</span>
        <LogoutOutlined className="icon" onClick={handleLogout} />
      </div>
    </div>
  );
};

export default NavigatorBar;
