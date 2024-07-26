import React, { useState, useEffect } from 'react';
import { Row, Col } from 'antd';
import { HomeOutlined, BookOutlined, DesktopOutlined } from '@ant-design/icons';
import '../assets/css/GreetingSection.css'; // Ensure you have the correct path

const GreetingSection = () => {
  const [user, setUser] = useState({
    name: 'Amanda',
    avatar: 'src/assets/images/avatar.png'
  });
  const [dateTime, setDateTime] = useState({
    date: '13/August',
    day: 'Monday',
    time: '10:33 AM'
  });

  useEffect(() => {
    // Simulate fetching data from backend
    const fetchUserData = () => {
      // Dummy values
      setUser({
        name: 'Amanda',
        avatar: 'src/assets/images/avatar.png'
      });
      setDateTime({
        date: '13/August',
        day: 'Monday',
        time: '10:33 AM'
      });
    };

    fetchUserData();
  }, []);

  return (
    <div className="greeting-section">
      <Row align="middle" justify="space-between" style={{ width: '100%' }}>
        <Col xs={24} sm={12}>
          <div className="greeting-left">
            <img src={user.avatar} alt="avatar" className="avatar" />
            <div className="greeting-text">
              <h2>Good morning {user.name}!</h2>
              <p>Here are some quick links</p>
              <div className="quick-links">
                <a href="https://lms.tech.sjp.ac.lk/"><HomeOutlined /> LMS</a>
                <a href="https://www.sjp.ac.lk/"><DesktopOutlined /> USJ Web</a>
                <a href="https://lib.sjp.ac.lk/"><BookOutlined /> E-Library</a>
              </div>
            </div>
          </div>
        </Col>
        <Col xs={24} sm={12}>
          <div className="greeting-right">
            <div className="date-time">
              <p><strong>Date</strong><br /><span>{dateTime.date}</span></p>
              <p><strong>Day</strong><br /><span>{dateTime.day}</span></p>
              <p><strong>Time</strong><br /><span>{dateTime.time}</span></p>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default GreetingSection;
