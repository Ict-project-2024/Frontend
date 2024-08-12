import React, { useEffect, useState } from 'react';
import { Layout, Row, Col, Card, Progress, Typography, Button, Checkbox, message } from 'antd';
import { TrophyOutlined } from '@ant-design/icons';
import GreetingSection from '../components/GreetingSection'; // Adjust the path as needed
import '../assets/css/Dashboard.css'; // Ensure you have the correct path
import FooterComponent from '../components/FooterComponent'; // Adjust the path as needed
import { useLocation } from 'react-router-dom';
import { newApiRequest } from '../utils/apiRequests';

const { Content } = Layout;
const { Text, Title, Link } = Typography;

const Dashboard = ({ userId, userName }) => {

	useEffect(() => {
		const targetLocations = ['student']

		for (let location of targetLocations) {
			newApiRequest(`http://localhost:3000/api/canteen/status`, 'GET', { "canteen": location })
				.then(data => {
					console.log('Location data:', data);
				})
				.catch(error => {
					console.error('Error fetching location data:', error);
				});
		}

	}, [userName])

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

	const [canteen, setCanteen] = useState(null);
	const [peopleRange, setPeopleRange] = useState(null);
	const [agreement, setAgreement] = useState(false);

	// Function to determine color based on percentage
	const getColor = (percent) => {
		if (percent > 75) return 'red';
		if (percent > 50) return 'orange';
		if (percent > 25) return 'blue';
		return 'green';
	};

	// Handle form submission
	const handleSubmit = async () => {
		if (!canteen || !peopleRange || !agreement) {
			message.error('Please fill all the fields and agree to the terms.');
			return;
		}

		// Submit the traffic to the database according to the respective canteen: nivindulakshitha
		const request = await newApiRequest(`http://localhost:3000/api/canteen/report`, 'POST', { userId, canteen, peopleRange });
		if (request.success) {
			console.log('Data submitted successfully:', request);
			message.success('Data submitted successfully');
		} else {
			message.error('Failed to submit data. Please try again.');
		}
	};

	return (
		<Layout>
			<Content style={{ padding: '0 50px', overflow: 'auto' }}>
				<GreetingSection name={userName.first} />
				<div className="site-layout-content">
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
					<Row gutter={[16, 16]} style={{ marginTop: '20px' }}>
						<Col xs={24} md={12}>
							<Card title={<span>Tell us what you see to become a savior <a href="/data-policy" className="data-policy-link">Data Policy</a></span>}>
								<div className="form-item">
									<Text>Where are you at?</Text>
									<Button.Group>
										<Button
											type={canteen === 'Student Canteen' ? 'primary' : 'default'}
											onClick={() => setCanteen('Student Canteen')}
										>
											Student Canteen
										</Button>
										<Button
											type={canteen === 'Staff Canteen' ? 'primary' : 'default'}
											onClick={() => setCanteen('Staff Canteen')}
										>
											Staff Canteen
										</Button>
									</Button.Group>
								</div>
								<div className="form-item">
									<Text>How many people you see?</Text>
									<Button.Group>
										<Button
											type={peopleRange === '0-15' ? 'primary' : 'default'}
											onClick={() => setPeopleRange('0-15')}
										>
											0-15
										</Button>
										<Button
											type={peopleRange === '15-25' ? 'primary' : 'default'}
											onClick={() => setPeopleRange('15-25')}
										>
											15-25
										</Button>
										<Button
											type={peopleRange === '25-35' ? 'primary' : 'default'}
											onClick={() => setPeopleRange('25-35')}
										>
											25-35
										</Button>
										<Button
											type={peopleRange === '35+' ? 'primary' : 'default'}
											onClick={() => setPeopleRange('35+')}
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
						</Col>
						<Col xs={24} md={12}>
							<Card title="This week's Canteen Heroes">
								<Row gutter={[16, 16]} className="heroes-row">
									<Col xs={24} sm={8}>
										<Card className="hero-card" cover={<img src="src/assets/images/badge.png" alt="Dining Dynamo" />}>
											<Card.Meta title="Dining Dynamo" description="Jhonne Doe" />
											<Text>98 Entries in a row</Text>
										</Card>
									</Col>
									<Col xs={24} sm={8} className="hero-card-big">
										<Card className="hero-card" cover={<img src="src/assets/images/badge.png" alt="Canteen Champion" />}>
											<Card.Meta title="Canteen Champion" description="Jhonne Doe" />
											<Text>154 Entries in a row</Text>
										</Card>
									</Col>
									<Col xs={24} sm={8}>
										<Card className="hero-card" cover={<img src="src/assets/images/badge.png" alt="Foodie Forecaster" />}>
											<Card.Meta title="Foodie Forecaster" description="Jhonne Doe" />
											<Text>54 Entries in a row</Text>
										</Card>
									</Col>
								</Row>
							</Card>
						</Col>
					</Row>
					<Row gutter={[16, 16]} style={{ marginTop: '20px' }}>
						<Col xs={24} md={12}>
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
						<Col xs={24} md={12}>
							<Card title="Your next badges">
								<Row gutter={[16, 16]}>
									<Col xs={24} sm={8}>
										<Card cover={<img src="src/assets/images/badge.png" alt="First Step" />}>
											<Card.Meta title="First Step" />
										</Card>
									</Col>
									<Col xs={24} sm={8}>
										<Card cover={<img src="src/assets/images/badge.png" alt="Frequent Contributor" />}>
											<Card.Meta title="Frequent Contributor" />
										</Card>
									</Col>
									<Col xs={24} sm={8}>
										<Card cover={<img src="src/assets/images/badge.png" alt="Daily Contributor" />}>
											<Card.Meta title="Daily Contributor" />
										</Card>
									</Col>
								</Row>
								<Link href="/badges" className="view-all-link">View all</Link>
							</Card>
							<Card title="Your Ranking">
								<Row>
									<Col xs={12}>
										<ol className="ranking-list">
											<li>Gongzhuan No.1 shop</li>
											<li>Gongzhuan No.2 shop</li>
											<li>Gongzhuan No.3 shop</li>
											<li>Gongzhuan No.4 shop</li>
											<li>Gongzhuan No.5 shop</li>
											<li>Gongzhuan No.6 shop</li>
										</ol>
									</Col>
									<Col xs={12}>
										<ul className="ranking-list">
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
			<FooterComponent />
		</Layout>
	);
};

export default Dashboard;
