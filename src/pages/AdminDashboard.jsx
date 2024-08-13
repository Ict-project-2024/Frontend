import React from 'react';
import { Layout, Row, Col, Card, Progress, Table, Button, Typography } from 'antd';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { DownloadOutlined } from '@ant-design/icons';
import GreetingSection from '../components/GreetingSection'; // Adjust the path as needed

const { Content } = Layout;
const { Title, Text } = Typography;

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

const statisticsData = [
    {
        id: 1,
        name: "Library",
        visits: 8846,
        avgDailyVisits: 1234,
    },
    {
        id: 2,
        name: "Medical Center",
        visits: 8846,
        avgDailyVisits: 1234,
    }
];

const logData = [
    {
        id: 1,
        name: "Library Log",
        logs: [
            { key: '1', date: '22/04/2024', student: 'UserName', checkIn: '09:22 am', checkOut: '10:48 am' },
            { key: '2', date: '22/04/2024', student: 'geekblue', checkIn: '09:22 am', checkOut: '10:48 am' },
            { key: '3', date: '22/04/2024', student: 'red', checkIn: '09:22 am', checkOut: '10:48 am' },
            { key: '4', date: '22/04/2024', student: 'purple', checkIn: '09:22 am', checkOut: '10:48 am' },
            { key: '5', date: '22/04/2024', student: 'green', checkIn: '09:22 am', checkOut: '10:48 am' },
            // More log data...
        ]
    },
    {
        id: 2,
        name: "Medical Center Log",
        logs: [
            { key: '1', date: '22/04/2024', student: 'UserName', checkIn: '09:22 am', checkOut: '10:48 am' },
            { key: '2', date: '22/04/2024', student: 'text', checkIn: '09:22 am', checkOut: '10:48 am' },
            // More log data...
        ]
    }
];

const chartData = [
  { name: '1', value: 20 },
  { name: '2', value: 30 },
  { name: '3', value: 40 },
  { name: '4', value: 35 },
  { name: '5', value: 50 },
  { name: '6', value: 45 },
  { name: '7', value: 60 },
];


const getColor = (percent) => {
  if (percent > 75) return 'red';
  if (percent > 50) return 'orange';
  if (percent > 25) return 'blue';
  return 'green';
};

const AdminDashboard = ({ userName }) => {
return (
  <Layout>
    <Content style={{ padding: '0 50px', overflow: 'auto' }}>
      {/* Greeting Section */}
      <div style={{ marginBottom: '20px' }}>
      <GreetingSection name={userName.first}/>
      </div>

      {/* Canteen Data Section */}
      <Row gutter={[16, 16]}>
        {canteenData.map(canteen => (
          <Col xs={24} sm={12} md={6} key={canteen.id}>
            <Card title={canteen.name} extra={<span style={{ color: getColor(canteen.percent) }}>{canteen.status}</span>}>
              <Progress type="circle" percent={canteen.percent} width={80} strokeColor={getColor(canteen.percent)} />
              <p>{canteen.description}</p>
              <p>Last update was {canteen.lastUpdate}</p>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Statistics Section */}
      <Row gutter={[16, 16]} style={{ marginTop: '20px' }}>
        {statisticsData.map(stat => (
          <Col xs={24} md={12} key={stat.id}>
            <Card>
              <Title level={5}>{stat.name}</Title>
              <Text type="secondary">Last 28 Days</Text>
              <Title level={2} style={{ margin: '8px 0' }}>{stat.visits.toLocaleString()}</Title>
              <ResponsiveContainer width="100%" height={100}>
                <AreaChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" hide />
                  <YAxis hide />
                  <Tooltip />
                  <Area type="monotone" dataKey="value" stroke="#8884d8" fill="#8884d8" fillOpacity={0.3} />
                </AreaChart>
              </ResponsiveContainer>
              <Text>Average Daily Visits: {stat.avgDailyVisits.toLocaleString()}</Text>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Logs Section */}
      <Row gutter={[16, 16]} style={{ marginTop: '20px' }}>
        {logData.map(log => (
          <Col xs={24} md={12} key={log.id}>
            <Card
              title={log.name}
              extra={
                <Button type="primary" icon={<DownloadOutlined />}>
                  Download log
                </Button>
              }
            >
              <div style={{ marginBottom: '16px' }}>
                <Button type="primary">All time</Button>
                <Button style={{ marginLeft: '8px' }}>Today</Button>
                <Button style={{ marginLeft: '8px' }}>Custom range</Button>
              </div>
              <Table
                dataSource={log.logs}
                columns={[
                  { title: 'Date', dataIndex: 'date', key: 'date' },
                  { 
                    title: 'Student', 
                    dataIndex: 'student', 
                    key: 'student',
                    render: (text) => (
                      <Text style={{ 
                        backgroundColor: text.toLowerCase(),
                        color: ['red', 'purple', 'green'].includes(text.toLowerCase()) ? 'white' : 'black',
                        padding: '2px 6px',
                        borderRadius: '4px'
                      }}>
                        {text}
                      </Text>
                    )
                  },
                  { title: 'Check in', dataIndex: 'checkIn', key: 'checkIn' },
                  { title: 'Check out', dataIndex: 'checkOut', key: 'checkOut' }
                ]}
                pagination={{ pageSize: 10 }}
              />
            </Card>
          </Col>
        ))}
      </Row>
    </Content>
  </Layout>
);
};

export default AdminDashboard;