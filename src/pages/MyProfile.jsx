import React, { useEffect, useState } from 'react';
import { Avatar, Button, Row, Col, Card, Table } from 'antd';
import { LeftOutlined, RightOutlined, LockOutlined, EditOutlined } from '@ant-design/icons';
import '../assets/css/MyProfile.css'; // Ensure you have the correct path.
import FooterComponent from '../components/FooterComponent';
import newApiRequest from '../utils/apiRequests';

const MyProfile = ({ userId }) => {
	// User badges data: nivindulakshitha
	const [userBadges, setUserBadges] = useState({})

	const badgeImages = {
		"firstStep": "https://unimo.blob.core.windows.net/unimo/First Step.png",
		"accuracyStar": "https://unimo.blob.core.windows.net/unimo/Acuracy Star.png",
		"dailyContributor": "https://unimo.blob.core.windows.net/unimo/Daily Contributer.png",
		"frequentContributor": "https://unimo.blob.core.windows.net/unimo/Fequent Contributer.png",
		"weeklyWarrior": "https://unimo.blob.core.windows.net/unimo/Weekly warior.png",
		"validateContributor": "https://unimo.blob.core.windows.net/unimo/Validated Contributer.png"
	}

	const badgeNames = {
		"firstStep": "First Step",
		"accuracyStar": "Accuracy Star",
		"dailyContributor": "Daily Contributor",
		"frequentContributor": "Frequent Contributor",
		"weeklyWarrior": "Weekly Warrior"
	}

	const badgeDescriptions = {
		"firstStep": "Congratulations on making your first occupancy update!",
		"accuracyStar": "Congratulations on maintaining a high accuracy rate!",
		"dailyContributor": "Congratulations on contributing daily!",
		"frequentContributor": "Congratulations on contributing frequently!",
		"weeklyWarrior": "Congratulations on contributing weekly!"
	}

	const fetchBadgesData = async () => {
		try {
			const response = await newApiRequest(`/api/votes/get`, 'POST', { userId });
			if (response.success) {
				setUserBadges(response.data.badges);
			}
		} catch (error) {
			console.error('Error fetching badges data:', error);
		}
	};

	useEffect(() => {
		fetchBadgesData();
	}, [])

	const columns = [
		{ title: 'Date', dataIndex: 'date', key: 'date' },
		{ title: 'Place', dataIndex: 'place', key: 'place' },
		{ title: 'Check-in Time', dataIndex: 'checkin', key: 'checkin' },
		{ title: 'Check-out Time', dataIndex: 'checkout', key: 'checkout' },
	];

	const data = [
		{ key: '1', date: '2024-08-01', place: 'Present', checkin: '09:00 AM', checkout: '05:00 PM' },
		{ key: '2', date: '2024-08-02', place: 'Absent', checkin: '-', checkout: '-' },
		{ key: '3', date: '2024-08-03', place: 'Present', checkin: '09:15 AM', checkout: '05:10 PM' },
		{ key: '4', date: '2024-08-04', place: 'Present', checkin: '09:05 AM', checkout: '05:00 PM' },
		{ key: '5', date: '2024-08-05', place: 'Present', checkin: '09:00 AM', checkout: '05:00 PM' },
		{ key: '6', date: '2024-08-06', place: 'Absent', checkin: '-', checkout: '-' },
		{ key: '7', date: '2024-08-01', place: 'Present', checkin: '09:00 AM', checkout: '05:00 PM' },
		{ key: '8', date: '2024-08-02', place: 'Absent', checkin: '-', checkout: '-' },
		{ key: '9', date: '2024-08-03', place: 'Present', checkin: '09:15 AM', checkout: '05:10 PM' },
		{ key: '10', date: '2024-08-04', place: 'Present', checkin: '09:05 AM', checkout: '05:00 PM' },
		{ key: '11', date: '2024-08-05', place: 'Present', checkin: '09:00 AM', checkout: '05:00 PM' },
		{ key: '12', date: '2024-08-06', place: 'Absent', checkin: '-', checkout: '-' },
		// Add more data as needed
	];

	return (
		<div className="my-profile">
			<Row gutter={[16, 16]} align="middle">
				{/* Left Side - Badges */}
				<Col xs={24} md={12}>
					<Row align="middle">
						<Col>
							<Avatar size={80} src="src/assets/images/avatar.png" />
						</Col>
						<Col style={{ marginLeft: '16px' }}>
							<h2>Serati Ma</h2>
						</Col>
					</Row>
					<h3>Your badges</h3>
					<Row align="middle" justify="center" style={{ marginTop: '16px' }}>
						<LeftOutlined style={{ fontSize: '24px', marginRight: '16px' }} />
						{Object.entries(userBadges).map(([badgeName, badgeData], index) => (
							((typeof badgeData === 'boolean' && badgeData) || typeof badgeData === 'string') && <Card
								key={index}
								hoverable
								cover={<img alt={badgeNames[badgeName]} src={badgeImages[badgeName]} style={{ width: '130px' }} />}
								style={{ width: 130, margin: '0 8px' }}
							>
								<Card.Meta title={badgeNames[badgeName]} description={badgeDescriptions[badgeName]} />
							</Card>
						))}
						<RightOutlined style={{ fontSize: '24px', marginLeft: '16px' }} />
					</Row>
				</Col>

				{/* Right Side - User Details */}
				<Col xs={24} md={12}>
					<div className="profile-info">
						<p><strong>Name</strong>: Serati Ma</p>
						<p><strong>University registration number</strong>: TE2190756</p>
						<p><strong>University email</strong>: serati@university.com</p>
						<p><strong>Gender</strong>: Male</p>
						<div className="profile-actions">
							<Button type="link" icon={<LockOutlined />}>Change password</Button>
							<Button type="link" icon={<EditOutlined />}>Edit details</Button>
						</div>
					</div>
				</Col>
			</Row>

			{/* Attendance Log Section */}
			<div className="attendance-log">
				<h3 className="centered-text">Places you visited</h3>
				<Table
					columns={columns}
					dataSource={data}
					pagination={{ pageSize: 5, position: ['bottomCenter'] }}
				/>
			</div>
			<FooterComponent />
		</div>
	);
};

export default MyProfile;
