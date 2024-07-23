import React from 'react';
import { Layout, Row, Col, Card, Progress, Typography, Button, Checkbox } from 'antd';
import GreetingSection from '../components/GreetingSection'; // Adjust the path as needed
import '../assets/css/Dashboard.css'; // Ensure you have the correct path


const { Content } = Layout;
const { Title, Text } = Typography;

const Dashboard = () => {
  return (
    <Layout>
      <Content style={{ padding: '0 50px', overflow: 'auto' }}>
        <GreetingSection />
        <div className="site-layout-content">
          <Row gutter={16}>
            <Col span={6}>
              <Card title="Student Canteen" extra={<span style={{ color: 'red' }}>Very crowded</span>}>
                <Progress type="circle" percent={86} width={80} />
                <p>Around 35+ people</p>
                <p>Last update was 10min ago</p>
              </Card>
            </Col>
            <Col span={6}>
              <Card title="Staff Canteen" extra={<span style={{ color: 'orange' }}>Moderately crowded</span>}>
                <Progress type="circle" percent={55} width={80} />
                <p>Around 15-25 people</p>
                <p>Last update was 5min ago</p>
              </Card>
            </Col>
            <Col span={6}>
              <Card title="Library" extra={<span style={{ color: 'blue' }}>Crowded</span>}>
                <Progress type="circle" percent={28} width={80} />
                <p>Exactly 5 people</p>
                <p>Last update was 5min ago</p>
              </Card>
            </Col>
            <Col span={6}>
              <Card title="Medical Center" extra={<span style={{ color: 'green' }}>Not crowded</span>}>
                <Progress type="circle" percent={12} width={80} />
                <p>Exactly 5 people</p>
                <p>Last update was 1hr ago</p>
              </Card>
            </Col>
          </Row>
          <Row gutter={16} style={{ marginTop: '20px' }}>
            <Col span={12}>
              <Card title="Tell us what you see to become a savior">
                <Text>Where are you at?</Text>
                <Button.Group>
                  <Button>Student Canteen</Button>
                  <Button>Staff Canteen</Button>
                </Button.Group>
                <Text>How many people you see?</Text>
                <Button.Group>
                  <Button>0-15</Button>
                  <Button>15-25</Button>
                  <Button>25-35</Button>
                  <Button>35+</Button>
                </Button.Group>
                <Checkbox>I agree that I'm submitting true data only</Checkbox>
                <Button type="primary">Submit</Button>
              </Card>
            </Col>
            <Col span={12}>
              <Card title="This week's Canteen Heroes">
                <p>Dining Dynamo</p>
                <p>Jhonne Doe</p>
                <p>98 Entries in a row</p>
                <p>Canteen Champion</p>
                <p>Jhonne Doe</p>
                <p>154 Entries in a row</p>
                <p>Foodie Forecaster</p>
                <p>Jhonne Doe</p>
                <p>54 Entries in a row</p>
              </Card>
            </Col>
          </Row>
          <Row gutter={16} style={{ marginTop: '20px' }}>
            <Col span={12}>
              <Card>
                <Text>How close are you to your next badge?</Text>
                <Progress percent={20} />
              </Card>
            </Col>
            <Col span={12}>
              <Card>
                <Title level={4}>First Step</Title>
                <Text>Congratulations on making your first occupancy update!</Text>
                <Button type="primary">Claim now!</Button>
              </Card>
            </Col>
          </Row>
        </div>
      </Content>
    </Layout>
  );
};

export default Dashboard;
