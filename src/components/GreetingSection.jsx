import React from 'react';
import { Row, Col } from 'antd';
import { HomeOutlined, BookOutlined, DesktopOutlined } from '@ant-design/icons';
import '../assets/css/GreetingSection.css'; // Ensure you have the correct path

const GreetingSection = () => {
  return (
    <div className="greeting-section">
      <Row align="middle" justify="space-between">
        <Col>
          <div className="greeting-left">
            <img src="src/assets/images/avatar.webp" alt="avatar" className="avatar" />
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
              <p><strong>Date</strong><br />13/August</p>
              <p><strong>Day</strong><br />Monday</p>
              <p><strong>Time</strong><br />10:33 AM</p>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default GreetingSection;
