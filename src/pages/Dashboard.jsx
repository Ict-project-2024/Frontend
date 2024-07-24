import React from 'react';
import { Layout, Row, Col, Card, Progress, Typography, Button, Checkbox } from 'antd';
import { TrophyOutlined } from '@ant-design/icons';
import GreetingSection from '../components/GreetingSection'; // Adjust the path as needed
import '../assets/css/Dashboard.css'; // Ensure you have the correct path

const { Content } = Layout;
const { Text, Title, Link } = Typography;

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
              <Card title={<span>Tell us what you see to become a savior <a href="/data-policy" className="data-policy-link">Data Policy</a></span>}>
                <div className="form-item">
                  <Text>Where are you at?</Text>
                  <Button.Group>
                    <Button type="primary">Student Canteen</Button>
                    <Button>Staff Canteen</Button>
                  </Button.Group>
                </div>
                <div className="form-item">
                  <Text>How many people you see?</Text>
                  <Button.Group>
                    <Button type="primary">0-15</Button>
                    <Button>15-25</Button>
                    <Button>25-35</Button>
                    <Button>35+</Button>
                  </Button.Group>
                </div>
                <div className="form-item">
                  <Checkbox>I agree that I’m submitting true data only</Checkbox>
                </div>
                <Button type="primary" className="submit-button">Submit</Button>
              </Card>
            </Col>
            <Col span={12}>
              <Card title="This week's Canteen Heroes">
                <Row gutter={16}>
                  <Col span={8}>
                    <Card cover={<img src="src\assets\images\badge.png" alt="Dining Dynamo" />}>
                      <Card.Meta title="Dining Dynamo" description="Jhonne Doe" />
                      <Text>98 Entries in a row</Text>
                    </Card>
                  </Col>
                  <Col span={8}>
                    <Card cover={<img src="src\assets\images\badge.png" alt="Canteen Champion" />}>
                      <Card.Meta title="Canteen Champion" description="Jhonne Doe" />
                      <Text>154 Entries in a row</Text>
                    </Card>
                  </Col>
                  <Col span={8}>
                    <Card cover={<img src="src\assets\images\badge.png" alt="Foodie Forecaster" />}>
                      <Card.Meta title="Foodie Forecaster" description="Jhonne Doe" />
                      <Text>54 Entries in a row</Text>
                    </Card>
                  </Col>
                </Row>
              </Card>
            </Col>
          </Row>
          <Row gutter={16} style={{ marginTop: '20px' }}>
            <Col span={12}>
              <Card className="badge-card">
                <Text>How close you are to your next badge?</Text>
                <Progress percent={20} />
                <Link href="/profile" className="profile-link">See your badges in profile</Link>
              </Card>
              <Card className="first-step-card">
                <div className="first-step-content">
                  <img src="src/assets/images/image.png" alt="Placeholder" className="placeholder-image" />
                  <div>
                    <Title level={4}>First Step</Title>
                    <Text>Congratulations on making your first occupancy update!</Text>
                    <Button type="primary" icon={<TrophyOutlined />} disabled>Claim now!</Button>
                  </div>
                </div>
              </Card>
            </Col>
            <Col span={12}>
              <Card title="Your next badges">
                <Row gutter={16}>
                  <Col span={8}>
                    <Card cover={<img src="src\assets\images\badge.png" alt="First Step" />}>
                      <Card.Meta title="First Step" />
                    </Card>
                  </Col>
                  <Col span={8}>
                    <Card cover={<img src="src\assets\images\badge.png" alt="Frequent Contributor" />}>
                      <Card.Meta title="Frequent Contributor" />
                    </Card>
                  </Col>
                  <Col span={8}>
                    <Card cover={<img src="src\assets\images\badge.png" alt="Daily Contributor" />}>
                      <Card.Meta title="Daily Contributor" />
                    </Card>
                  </Col>
                </Row>
                <Link href="/badges" className="view-all-link">View all</Link>
              </Card>
              <Card title="Your Ranking">
                <Row>
                  <Col span={12}>
                    <ol>
                      <li>Gongzhuan No.1 shop</li>
                      <li>Gongzhuan No.2 shop</li>
                      <li>Gongzhuan No.3 shop</li>
                      <li>Gongzhuan No.4 shop</li>
                      <li>Gongzhuan No.5 shop</li>
                      <li>Gongzhuan No.6 shop</li>
                    </ol>
                  </Col>
                  <Col span={12}>
                    <ul>
                      <li>323,234</li>
                      <li>323,234</li>
                      <li>323,234</li>
                      <li>323,234</li>
                      <li>323,234</li>
                      <li>323,234</li>
                    </ul>
                  </Col>
                </Row>
              </Card>
            </Col>
          </Row>
        </div>
      </Content>
    </Layout>
  );
};

export default Dashboard;
