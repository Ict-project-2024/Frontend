import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, Badge, Avatar } from 'antd';
import { MenuOutlined, BellOutlined, LogoutOutlined, CloseOutlined } from '@ant-design/icons';
import { useAuth } from '../components/context/AuthContext.jsx';
import '../assets/css/NavigatorBar.css'; // Ensure you have the correct path

const NavigatorBar = ({ userName }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('Serati Ma');
  const [notifications, setNotifications] = useState(11);
  const [avatarUrl, setAvatarUrl] = useState('./images/avatar.png');
  const [menuVisible, setMenuVisible] = useState(false);

  useEffect(() => {
    // Simulate fetching user data from backend
    // You can replace this with an actual API call
    const fetchUserData = () => {
      // Dummy values
      setUsername('Serati Ma');
      setNotifications(11);
      setAvatarUrl('./images/avatar.png');
    };

    fetchUserData();
  }, []);

  const handleLogout = () => {
    logout(); // Update the authentication state
    navigate('/login'); // Redirect to login page or any other page
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
        <img src="./images/logo.png" alt="Unimo Logo" />
      </div>
      <div className="nav-menu">
        <Menu mode="horizontal" defaultSelectedKeys={['live-status']}>
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
      </div>
      <div className="user-section">
        <Badge count={notifications} className="notification-badge">
          <BellOutlined className="icon" />
        </Badge>
        <Avatar src={avatarUrl} className="avatar" />
        <span className="username">{userName.first} {userName.last}</span>
        <LogoutOutlined className="icon" onClick={handleLogout} />
      </div>
      {menuVisible && (
        <div className={`dropdown-menu ${menuVisible ? 'visible' : ''}`}>
          <Menu mode="vertical" defaultSelectedKeys={['live-status']}>
            <Menu.Item key="live-status">
              <Link to="/dashboard">Live Status</Link>
            </Menu.Item>
            <Menu.Item key="news">
              <Link to="/news">News</Link>
            </Menu.Item>
            <Menu.Item key="about-us">
              <Link to="/about-us">About Us</Link>
            </Menu.Item>
            <Menu.Item key="notifications">
              <Badge count={notifications}>
                <Link to="/notifications">Notifications</Link>
              </Badge>
            </Menu.Item>
            <Menu.Item key="logout">
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
