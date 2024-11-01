import React from 'react';
import { Card, Typography, Divider, Layout } from 'antd';
import FooterComponent from '../components/FooterComponent';
import '../assets/css/AboutUs.css'; 

const { Title, Paragraph } = Typography;
const { Content } = Layout;

const AboutUs = () => {
  return (
    <Layout>
      <Content className="about-us-content">
        <Card className="about-us-card" bordered={false}>
          <Title level={1} className="about-us-title">About Unimo Campus Resource Utilization</Title>
          
          <Divider />

          <Paragraph className="about-us-paragraph">
            In a dynamic university environment, efficient use of campus resources is vital for maximizing the benefits they offer to students and staff. Our project, "Community-Driven Solution for Checking Occupy Status of Library, Medical Center, and Canteens," aims to develop an intuitive system that provides real-time information on the occupancy status of these critical campus facilities.
          </Paragraph>

          <Paragraph className="about-us-paragraph">
            The Unimo Campus Resource Utilization App is designed to improve accessibility and utilization of campus resources. Students and staff often face challenges with overcrowded canteens, unavailable library seating, and long waits at the medical center. This app addresses these issues by providing real-time data on the occupancy status of the library, medical center, and canteens, allowing users to make informed decisions and manage their time more effectively.
          </Paragraph>

          <Title level={2} className="about-us-subtitle">Project Purpose</Title>

          <Paragraph className="about-us-paragraph">
            Our primary objective is to create a user-friendly system that enables students and staff to check the current occupancy status of essential campus facilities. By implementing Uni ID tracking, which allows library and medical center workers to scan IDs and update occupancy statuses, we ensure accurate and up-to-date data. This system is intended to reduce overcrowding, enhance resource management, and improve the overall campus experience.
          </Paragraph>

          <Title level={2} className="about-us-subtitle">Benefits of the Unimo App</Title>

          <Paragraph className="about-us-paragraph">
            Our solution is highly relevant in modern educational institutions where time management and resource efficiency are essential. By offering real-time updates on campus occupancy, we enhance convenience for users and promote optimal resource utilization. This project benefits a wide range of users, including students planning study schedules, staff needing quick access to the medical center, and those looking for less crowded dining options. 
          </Paragraph>

          <Paragraph className="about-us-paragraph">
            By improving the utilization of campus resources, the Unimo Campus Resource Utilization App aligns with our broader goal of enhancing campus life and operational efficiency.
          </Paragraph>
        </Card>
      </Content>
      <FooterComponent />
    </Layout>
  );
};

export default AboutUs;
