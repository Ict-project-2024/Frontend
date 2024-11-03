import React, { useEffect, useState } from 'react';
import { Avatar, Button, Row, Col, Card, Table } from 'antd';
import { LeftOutlined, RightOutlined, LockOutlined, EditOutlined } from '@ant-design/icons';
import '../assets/css/MyProfile.css'; // Ensure you have the correct path.
import FooterComponent from '../components/FooterComponent';
import newApiRequest from '../utils/apiRequests';
import { useAuth } from '../context/AuthContext';
import { te } from 'date-fns/locale';

const MyProfile = ({ userId }) => {
	// User badges data: nivindulakshitha
	const [userBadges, setUserBadges] = useState({})
	const { user } = useAuth();
	const [accessData, setAccessData] = useState({});

	const badgeImages = {
		"firstStep": "https://unimo.blob.core.windows.net/unimo/First Step.png",
		"accuracyStar": "https://unimo.blob.core.windows.net/unimo/Acuracy Star.png",
		"dailyContributor": "https://unimo.blob.core.windows.net/unimo/Daily Contributer.png",
		"frequentContributor": {
			"Silver": "https://unimo.blob.core.windows.net/unimo/Fequent Contributer - Silvar.png",
			"Bronze": "https://unimo.blob.core.windows.net/unimo/Fequent Contributer - Bronze.png",
			"Gold": "https://unimo.blob.core.windows.net/unimo/Fequent Contributer - Gold.png"
		},
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

	let timestamps = [];
	let tempAccessData = {};

	const updateAccessData = (data, place) => {
		timestamps = Object.keys(accessData);
		tempAccessData = accessData;

		data.forEach(accessData => {
			if (!timestamps.includes(accessData.entryTime)) {
				timestamps.push(accessData.entryTime);
			}

			accessData.key = accessData._id;
			accessData.date = new Date(accessData.entryTime).toLocaleDateString('en-US', {
				day: '2-digit',
				month: 'short',
				year: 'numeric'
			});
			accessData.day = new Date(accessData.entryTime).toLocaleDateString('en-US', {
				weekday: 'long'
			});
			accessData.place = place;
			accessData.checkin = new Date(accessData.entryTime).toLocaleTimeString('en-US', {
				hour: '2-digit',
				minute: '2-digit',
				hour12: true
			});
			accessData.checkout = accessData.exitTime ? new Date(accessData.exitTime).toLocaleTimeString('en-US', {
				hour: '2-digit',
				minute: '2-digit',
				hour12: true
			}) : '--:--';
			const timeSpend = accessData.exitTime ? Math.round((new Date(accessData.exitTime) - new Date(accessData.entryTime)) / 60000) : '--';
			accessData.timeSpend = timeSpend === '--' ? timeSpend : `${Math.floor(timeSpend / 60) > 0 ? `${Math.floor(timeSpend / 60)} hrs ` : ''}${timeSpend % 60} mins`;

			tempAccessData[accessData.entryTime] = accessData;
		});

		timestamps.forEach(timestamp => {
			setAccessData(prevState => ({
				...prevState,
				[timestamp]: tempAccessData[timestamp.toString()]
			}));
		});
	};

	const fetchLibraryAccessData = async () => {
		try {
			const response = await newApiRequest(`/api/library/useraccess`, 'POST', { teNumber: user.teNumber });
			if (response.success) {
				updateAccessData(response.data, 'Library');
			}
		} catch (error) {
			console.error('Error fetching attendance data:', error);
		}
	};

	const fetchMedicalCenterAccessData = async () => {
		try {
			const response = await newApiRequest(`/api/medical-center/useraccess`, 'POST', { teNumber: user.teNumber });
			if (response.success) {
				updateAccessData(response.data, 'Medical Center');
			}
		} catch (error) {
			console.error('Error fetching attendance data:', error);
		}
	};

	useEffect(() => {
		fetchBadgesData();
		fetchLibraryAccessData();
		fetchMedicalCenterAccessData();
	}, []);

	const columns = [
		{ title: 'Date', dataIndex: 'date', key: 'date' },
		{ title: 'Day', dataIndex: 'day', key: 'day' },
		{ title: 'Place', dataIndex: 'place', key: 'place' },
		{ title: 'Check-in Time', dataIndex: 'checkin', key: 'checkin' },
		{ title: 'Check-out Time', dataIndex: 'checkout', key: 'checkout' },
		{ title: 'Spend Time', dataIndex: 'timeSpend', key: 'timeSpend' },
	];

	return (
		<div className="my-profile">
			<Row gutter={[16, 16]} align="middle">
				{/* Left Side - Badges */}
				<Col xs={24} md={12}>
					<Row align="middle">
						<Col>
							<Avatar size={80} src={user.profileImage} />
						</Col>
						<Col style={{ marginLeft: '16px' }}>
							<h2>{user.firstName} {user.lastName}</h2>
						</Col>
					</Row>
					<h3>Your badges</h3>
					<Row align="middle" justify="center" style={{ marginTop: '16px' }}>
						<LeftOutlined style={{ fontSize: '24px', marginRight: '16px' }} />
						{Object.entries(userBadges).map(([badgeName, badgeData], index) => (
							((typeof badgeData === 'boolean' && badgeData) || typeof badgeData === 'string') && <Card
								key={index}
								hoverable
								cover={<img alt={badgeNames[badgeName]} src={typeof badgeData === 'boolean' ? badgeImages[badgeName] : badgeImages[badgeName][badgeData]} style={{ width: '130px' }} />}
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
						<p><strong>Name</strong>: {user.firstName} {user.lastName}</p>
						<p><strong>University registration number</strong>: {user.teNumber.toUpperCase()}</p>
						<p><strong>University email</strong>: {user.email.toLowerCase()}</p>
						<p><strong>Gender</strong>: {user.gender}</p>
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
					dataSource={Object.values(accessData).sort((a, b) => new Date(b.entryTime) - new Date(a.entryTime))}
					sortDirections={['descend']}
					pagination={{ pageSize: 5, position: ['bottomCenter'] }}
				/>
			</div>
			<FooterComponent />
		</div>
	);
};

export default MyProfile;
