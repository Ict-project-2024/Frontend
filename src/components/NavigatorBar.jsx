import React from 'react';
import { Link } from 'react-router-dom';
import { Menu, Badge, Avatar } from 'antd';
import { BellOutlined, LogoutOutlined } from '@ant-design/icons';
import '../assets/css/NavigatorBar.css'; // Ensure you have the correct path

const NavigatorBar = () => {
  return (
    <div className="navigator-bar">
      <div className="logo"></div>
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
      <div className="user-section">
        <Badge count={11} className="notification-badge">
          <BellOutlined className="icon" />
        </Badge>
        <Avatar src="src/assets/images/avatar.webp" className="avatar" />
        <span className="username">Serati Ma</span>
        <LogoutOutlined className="icon" />
      </div>
    </div>
  );
};

export default NavigatorBar;
