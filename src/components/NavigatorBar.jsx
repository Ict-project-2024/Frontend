import React from 'react';
import { Menu } from 'antd';
import '../assets/css/NavigatorBar.css'; // Ensure you have the correct path

const NavigatorBar = () => {
  return (
    <div className="header">
      <Menu mode="horizontal" className="nav-menu">
        <Menu.Item key="live-status">Live Status</Menu.Item>
        <Menu.Item key="news">News</Menu.Item>
        <Menu.Item key="about-us">About Us</Menu.Item>
      </Menu>
      <Menu mode="horizontal" className="user-menu">
        <Menu.Item key="notifications">13</Menu.Item>
        <Menu.Item key="user">Serati Ma</Menu.Item>
      </Menu>
    </div>
  );
};

export default NavigatorBar;
