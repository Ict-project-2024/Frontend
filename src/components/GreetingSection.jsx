import React from 'react';
import { Row, Col } from 'antd';
import { HomeOutlined, BookOutlined, DesktopOutlined } from '@ant-design/icons';
import '../assets/css/GreetingSection.css'; // Ensure you have the correct path

const GreetingSection = () => {
  return (
    <div className="greeting-section">
      <Row align="middle" justify="space-between" style={{ width: '100%' }}>
        <Col>
          <div className="greeting-left">
            <img src="src/assets/images/avatar.png" alt="avatar" className="avatar" />
            <div className="greeting-text">
              <h2>Good morning Amanda!</h2>
              <p>Here are some quick links</p>
              <div className="quick-links">
                <a href="/lms"><HomeOutlined /> LMS</a>
                <a href="/usj-web"><DesktopOutlined /> USJ Web</a>
                <a href="/e-library"><BookOutlined /> E-Library</a>
              </div>
            </div>
          </div>
        </Col>
        <Col>
          <div className="greeting-right">
            <div className="date-time">
              <p><strong>Date</strong><br /><span>13/August</span></p>
              <p><strong>Day</strong><br /><span>Monday</span></p>
              <p><strong>Time</strong><br /><span>10:33 AM</span></p>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default GreetingSection;
