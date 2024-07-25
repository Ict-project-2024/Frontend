import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, Badge, Avatar, Drawer } from 'antd';
import { BellOutlined, LogoutOutlined } from '@ant-design/icons';
import { useAuth } from '../components/context/AuthContext.jsx';
import '../assets/css/NavigatorBar.css'; // Ensure you have the correct path

const NavigatorBar = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState('FirstName');
  const [notifications, setNotifications] = useState(11);
  const [avatarUrl, setAvatarUrl] = useState('src/assets/images/avatar.png');
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Initial check

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleLogout = () => {
    logout(); // Update the authentication state
    navigate('/login'); // Redirect to login page or any other page
  };

  const showDrawer = () => {
    setDrawerVisible(true);
  };

  const onClose = () => {
    setDrawerVisible(false);
  };

  return (
    <div className="navigator-bar">
      <div className="logo" onClick={isMobile ? showDrawer : null}>
        <img src="src/assets/images/logo.png" alt="Unimo Logo" />
      </div>
      {!isMobile && (
        <Menu mode="horizontal" className="nav-menu">
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
      )}
      <div className="user-section">
        <Badge count={notifications} className="notification-badge">
          <BellOutlined className="icon" />
        </Badge>
        <Avatar src={avatarUrl} className="avatar" />
        <span className="username">{username}</span>
        <LogoutOutlined className="icon" onClick={handleLogout} />
      </div>
      {isMobile && (
        <Drawer
          title="Menu"
          placement="left"
          onClose={onClose}
          visible={drawerVisible}
        >
          <Menu mode="vertical" className="drawer-menu">
            <Menu.Item key="live-status">
              <Link to="/dashboard" onClick={onClose}>Live Status</Link>
            </Menu.Item>
            <Menu.Item key="news">
              <Link to="/news" onClick={onClose}>News</Link>
            </Menu.Item>
            <Menu.Item key="about-us">
              <Link to="/about-us" onClick={onClose}>About Us</Link>
            </Menu.Item>
          </Menu>
        </Drawer>
      )}
    </div>
  );
};

export default NavigatorBar;
