import React, { useState } from 'react';
import { Layout, Row, Col, Card, Progress, Typography, Button, Checkbox, message, Table } from 'antd';
import { TrophyOutlined } from '@ant-design/icons';
import GreetingSection from '../components/GreetingSection'; // Adjust the path as needed
import '../assets/css/Dashboard.css'; // Ensure you have the correct path
import FooterComponent from '../components/FooterComponent'; // Adjust the path as needed

const { Content } = Layout;
const { Text, Title, Link } = Typography;

const Dashboard = () => {
  // Dummy data
  const canteenData = [
    {
      id: 1,
      name: "Student Canteen",
      percent: 86,
      status: "Very crowded",
      description: "Around 35+ people",
      lastUpdate: "10min ago"
    },
    {
      id: 2,
      name: "Staff Canteen",
      percent: 55,
      status: "Moderately crowded",
      description: "Around 15-25 people",
      lastUpdate: "5min ago"
    },
    {
      id: 3,
      name: "Library",
      percent: 28,
      status: "Crowded",
      description: "Exactly 5 people",
      lastUpdate: "5min ago"
    },
    {
      id: 4,
      name: "Medical Center",
      percent: 12,
      status: "Not crowded",
      description: "Exactly 5 people",
      lastUpdate: "1hr ago"
    }
  ];

  // Form state
  const [location, setLocation] = useState(null);
  const [peopleCount, setPeopleCount] = useState(null);
  const [agreement, setAgreement] = useState(false);

  // Function to determine color based on percentage
  const getColor = (percent) => {
    if (percent > 75) return 'red';
    if (percent > 50) return 'orange';
    if (percent > 25) return 'blue';
    return 'green';
  };

  // Handle form submission
  const handleSubmit = () => {
    if (!location || !peopleCount || !agreement) {
      message.error('Please fill all the fields and agree to the terms.');
      return;
    }
    // Handle form submission logic here
    console.log('Form submitted:', { location, peopleCount, agreement });
    message.success('Data submitted successfully.');
  };

  // Ranking Data
  const rankingData = [
    { key: 1, rank: 1, name: 'Gongzhuan No.1 shop', entries: 323234 },
    { key: 2, rank: 2, name: 'Gongzhuan No.2 shop', entries: 323234 },
    { key: 3, rank: 3, name: 'Gongzhuan No.3 shop', entries: 323234 },
    { key: 4, rank: 4, name: 'Amanda Joe', entries: 323234 },
    { key: 5, rank: 5, name: 'Gongzhuan No.5 shop', entries: 323234 },
    { key: 6, rank: 6, name: 'Gongzhuan No.6 shop', entries: 323234 }
  ];

  const columns = [
    {
      title: '',
      dataIndex: 'rank',
      key: 'rank',
      render: (text, record) => (
        <span style={{ display: 'flex', alignItems: 'center' }}>
          <span style={{ fontWeight: record.rank === 4 ? 'bold' : 'normal', color: record.rank === 4 ? '#1890ff' : 'inherit' }}>{record.rank}</span>
        </span>
      ),
      responsive: ['md'],
    },
    { title: 'Your Ranking', dataIndex: 'name', key: 'name' },
    { title: 'Entries', dataIndex: 'entries', key: 'entries' }
  ];

  return (
    <Layout>
      <Content style={{ padding: '0 50px', overflow: 'auto' }}>
        <GreetingSection />
        <div className="site-layout-content">
          <Row gutter={[16, 16]}>
            <Col xs={24} md={12}>
              <Card title={<span>Tell us what you see to become a savior <a href="/data-policy" className="data-policy-link">Data Policy</a></span>}>
                <div className="form-item">
                  <Text>Where are you at?</Text>
                  <Button.Group>
                    <Button 
                      type={location === 'Student Canteen' ? 'primary' : 'default'}
                      onClick={() => setLocation('Student Canteen')}
                    >
                      Student Canteen
                    </Button>
                    <Button 
                      type={location === 'Staff Canteen' ? 'primary' : 'default'}
                      onClick={() => setLocation('Staff Canteen')}
                    >
                      Staff Canteen
                    </Button>
                  </Button.Group>
                </div>
                <div className="form-item">
                  <Text>How many people you see?</Text>
                  <Button.Group>
                    <Button 
                      type={peopleCount === '0-15' ? 'primary' : 'default'}
                      onClick={() => setPeopleCount('0-15')}
                    >
                      0-15
                    </Button>
                    <Button 
                      type={peopleCount === '15-25' ? 'primary' : 'default'}
                      onClick={() => setPeopleCount('15-25')}
                    >
                      15-25
                    </Button>
                    <Button 
                      type={peopleCount === '25-35' ? 'primary' : 'default'}
                      onClick={() => setPeopleCount('25-35')}
                    >
                      25-35
                    </Button>
                    <Button 
                      type={peopleCount === '35+' ? 'primary' : 'default'}
                      onClick={() => setPeopleCount('35+')}
                    >
                      35+
                    </Button>
                  </Button.Group>
                </div>
                <div className="form-item">
                  <Checkbox checked={agreement} onChange={(e) => setAgreement(e.target.checked)}>
                    I agree that I’m submitting true data only
                  </Checkbox>
                </div>
                <Button type="primary" className="submit-button" onClick={handleSubmit}>
                  Submit
                </Button>
              </Card>
              <Card className="badge-card">
                <Text>How close you are to your next badge?</Text>
                <Progress percent={20} />
                <Link href="/profile" className="profile-link">See your badges in profile</Link>
              </Card>
              <Card className="first-step-card">
                <div className="first-step-content">
                  <img src="src/assets/images/badge.png" alt="Placeholder" className="placeholder-image" />
                  <div>
                    <Title level={4}>First Step</Title>
                    <Text>Congratulations on making your first occupancy update! </Text>
                    <Button type="primary" icon={<TrophyOutlined />} disabled>Claim now!</Button>
                  </div>
                </div>
              </Card>
            </Col>
            <Col xs={24} md={12}>
              <Card title="This week's Canteen Heroes" className="canteen-heroes-card">
                <Row gutter={[16, 16]} className="heroes-row">
                  <Col xs={24} sm={8} md={8}>
                    <Card className="hero-card" cover={<img src="src/assets/images/badge.png" alt="Dining Dynamo" />}>
                      <Card.Meta title="Dining Dynamo" description="Jhonne Doe" />
                      <Text>98 Entries in a row</Text>
                    </Card>
                  </Col>
                  <Col xs={24} sm={8} md={8}>
                    <Card className="hero-card" cover={<img src="src/assets/images/badge.png" alt="Canteen Champion" />}>
                      <Card.Meta title="Canteen Champion" description="Jhonne Doe" />
                      <Text>154 Entries in a row</Text>
                    </Card>
                  </Col>
                  <Col xs={24} sm={8} md={8}>
                    <Card className="hero-card" cover={<img src="src/assets/images/badge.png" alt="Foodie Forecaster" />}>
                      <Card.Meta title="Foodie Forecaster" description="Jhonne Doe" />
                      <Text>54 Entries in a row</Text>
                    </Card>
                  </Col>
                </Row>
              </Card>
              <Card title="Your Ranking" className="ranking-card">
                <Table dataSource={rankingData} columns={columns} pagination={false} />
              </Card>
              <Card title="Your next badges" className="last-row-card">
                <Row gutter={[16, 16]} className="badges-row">
                  <Col xs={8} sm={8} md={8}>
                    <Card cover={<img src="src/assets/images/badge.png" alt="First Step" />}>
                      <Card.Meta title="First Step" />
                    </Card>
                  </Col>
                  <Col xs={8} sm={8} md={8}>
                    <Card cover={<img src="src/assets/images/badge.png" alt="Frequent Contributor" />}>
                      <Card.Meta title="Frequent Contributor" />
                    </Card>
                  </Col>
                  <Col xs={8} sm={8} md={8}>
                    <Card cover={<img src="src/assets/images/badge.png" alt="Daily Contributor" />}>
                      <Card.Meta title="Daily Contributor" />
                    </Card>
                  </Col>
                </Row>
                <Link href="/badges" className="view-all-link">View all</Link>
              </Card>
            </Col>
          </Row>
        </div>
      </Content>
      <FooterComponent />
    </Layout>
  );
};

export default Dashboard;
