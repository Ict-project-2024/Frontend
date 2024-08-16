import React, { useState, useEffect } from 'react';
import { Layout, Row, Col, Card, Progress, Table, Button, Typography, Space, DatePicker } from 'antd';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { DownloadOutlined } from '@ant-design/icons';
import GreetingSection from '../components/GreetingSection';
import FooterComponent from '../components/FooterComponent';
import { newApiRequest } from '../utils/apiRequests';
import { formatDistanceToNow } from 'date-fns';
import CountUp from 'react-countup'

const { Content } = Layout;
const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

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

// Calculate the overall crowdedness percentage based on the votes: nivindulakshitha
const overallCrowdednessPercentage = (data) => {
	if (typeof data == 'object') { // For canteeen data
		let weights = {
			"0-15": 0.2,
			"15-25": 0.4,
			"25-35": 0.6,
			"35+": 1.0
		};

		let totalVotes = Object.values(data).reduce((sum, count) => sum + count, 0);
		let weightedSum = Object.keys(data).reduce((sum, range) => sum + data[range] * weights[range], 0);
		return ((totalVotes > 0) ? (weightedSum / totalVotes) * 100 : 0).toFixed(0);
	} else { // For library and medical center data
		return ((data / 50) * 100).toFixed(0);
	}
}

// Determine the crowdedness based on the percentage: nivindulakshitha
const determineCrowdedness = (percent, location = null) => {
	switch (location) {
		case 'Library': {
			if (percent > 40) return 'Very crowded';
			if (percent > 30) return 'Moderately crowded';
			if (percent > 20) return 'Crowded';
			return 'Not crowded';
		}
		case 'Medical Center': {
			if (percent > 10) return 'Very crowded';
			if (percent > 5) return 'Moderately crowded';
			if (percent > 3) return 'Crowded';
			return 'Not crowded';
		}
		default: {
			if (percent > 75) return 'Very crowded';
			if (percent > 50) return 'Moderately crowded';
			if (percent > 25) return 'Crowded';
			return 'Not crowded';
		}
	}
}

const esimateCrowd = (votes) => {
    let midpoints = {
        "0-15": 8,
        "15-25": 20,
        "25-35": 30,
        "35+": 40
    };

    let totalVotes = Object.values(votes).reduce((sum, count) => sum + count, 0);
    let estimatedCount = Object.keys(votes).reduce((sum, range) => sum + votes[range] * midpoints[range], 0) / (totalVotes / 2);

    return estimatedCount.toFixed(0);
}

const AdminDashboard = ({ userId, userName }) => {
	const [locationTraffic, setLocationTraffic] = useState({});
	const [libraryChartData, setLibraryChartData] = useState([])
	const [libraryStats, setLibraryStats] = useState({})
	const [medicalCenterChartData, setMedicalCenterChartData] = useState([])
	const [medicalCenterStats, setMedicalCenterStats] = useState({})

	// Fetch the required data for each location: nivindulakshitha
	useEffect(() => {
		const routeFix = { 'Student Canteen': 'canteen', 'Staff Canteen': 'canteen', 'Library': 'library', 'Medical Center': 'medical-center' };
		const locationsList = ['Student Canteen', 'Staff Canteen', 'Library', 'Medical Center'];
		let draftData = {};

		for (let location of locationsList) {
			newApiRequest(`http://localhost:3000/api/${routeFix[location]}/status`, 'POST', { "location": location })
				.then(response => {
					if (response.success) {
						// Set the data for each location: nivindulakshitha
						draftData[location] = {}
						draftData[location].id = locationsList.indexOf(location);
						draftData[location].lastModified = formatDistanceToNow(response.data.lastModified, { addSuffix: true });
						draftData[location].percent = response.data.votes != undefined ? overallCrowdednessPercentage(response.data.votes) : overallCrowdednessPercentage(response.data.currentOccupancy);
						draftData[location].status = response.data.votes != undefined ? determineCrowdedness(draftData[location].percent) : determineCrowdedness(response.data.currentOccupancy, location);
						draftData[location].name = location;
						draftData[location].description = `${response.data.votes != undefined ? 'About ' + esimateCrowd(response.data.votes) : 'Exactly ' + response.data.currentOccupancy} people`;
					}
				})
				.catch(error => {
					console.error('Error fetching location data:', error);
				})
				.finally(() => {
					setLocationTraffic(draftData);
				});
		}

	}, [userId]);

	// Fetch the required data for library: nivindulakshitha
	useEffect(() => {
		// Fetch the required data for each location: nivindulakshitha
		let draftData = [];
		let totalEntrances = 0;
		let totalDays = 0;

		newApiRequest(`http://localhost:3000/api/library/history`, 'GET', {})
			.then(response => {
				if (response.success) {
					// Set the data for library: nivindulakshitha
					response.data.map((data, index) => {
						draftData[index] = new Object({
							"Date": data.date,
							"Students": data.entrances
						})

						totalEntrances += data.entrances;
						totalDays++;
					})
				}
			})
			.catch(error => {
				console.error('Error fetching library data:', error);
			})
			.finally(() => {
				setLibraryChartData(...libraryChartData, draftData);
				setLibraryStats({ visits: totalEntrances, avgDailyVisits: (totalEntrances / totalDays).toFixed(0) });
			});
	}, [userId])

	// Fetch the required data for medical center: nivindulakshitha
	useEffect(() => {
		// Fetch the required data for each location: nivindulakshitha
		let draftData = [];
		let totalEntrances = 0;
		let totalDays = 0;

		newApiRequest(`http://localhost:3000/api/medical-center/history`, 'GET', {})
			.then(response => {
				if (response.success) {
					// Set the data for library: nivindulakshitha
					response.data.map((data, index) => {
						draftData[index] = new Object({
							"Date": data.date,
							"Students": data.entrances
						})

						totalEntrances += data.entrances;
						totalDays++;
					})
				}
			})
			.catch(error => {
				console.error('Error fetching medical center data:', error);
			})
			.finally(() => {
				setMedicalCenterChartData(...libraryChartData, draftData);
				setMedicalCenterStats({ visits: totalEntrances, avgDailyVisits: (totalEntrances / totalDays).toFixed(0) });
			});
	}, [userId])


	return (
		<Layout>
			<Content style={{ padding: '0 50px', overflow: 'auto' }}>
				{/* Greeting Section */}
				<div style={{ marginBottom: '20px' }}>
					<GreetingSection name={userName.first} />
				</div>

				{/* Canteen Data Section */}
				<Row gutter={[16, 16]}>
					{
						//Display the location data: nivindulakshitha
						Object.keys(locationTraffic).map(location => (
							<Col xs={24} sm={12} md={6} key={locationTraffic[location].id}>
								<Card title={locationTraffic[location].name} extra={<span style={{ color: getColor(locationTraffic[location].percent) }}>{locationTraffic[location].status}</span>}>
									<Progress type="circle" percent={locationTraffic[location].percent} size={80} strokeColor={getColor(locationTraffic[location].percent)} />
									<p>{locationTraffic[location].description}</p>
									<p>Last update was {locationTraffic[location].lastModified}</p>
								</Card>
							</Col>
						))
					}
				</Row>

				<Row gutter={[16, 16]} style={{ marginTop: '20px' }}>
					{/* Display the statistics data: nivindulakshitha */}
					<Col xs={24} md={12} key={1}>
						<Card>
							<Title level={5}>Library</Title>
							<Text type="secondary">Last {Object.keys(libraryChartData).length} Days</Text>
							<CountUp style={{ margin: '8px 0', marginBottom: '.5em', fontWeight: '600px', fontSize: '30px' }} end={libraryStats.visits ? libraryStats.visits.toLocaleString() : 0} />
							<ResponsiveContainer width="100%" height={100}>
								<AreaChart data={libraryChartData}>
									<CartesianGrid strokeDasharray="3 3" />
									<XAxis dataKey="Date" hide />
									<YAxis hide />
									<Tooltip />
									<Area type="monotone" dataKey="Students" stroke="#8884d8" fill="#8884d8" fillOpacity={0.3} />
								</AreaChart>
							</ResponsiveContainer>
							<Text>Average Daily Visits: {libraryStats.avgDailyVisits && !isNaN(libraryStats.avgDailyVisits) ? libraryStats.avgDailyVisits.toLocaleString() : 0}</Text>
						</Card>
					</Col>
					<Col xs={24} md={12} key={2}>
						<Card>
							<Title level={5}>Medical Center</Title>
							<Text type="secondary">Last {Object.keys(medicalCenterChartData).length} Days</Text>
							<CountUp style={{ margin: '8px 0', marginBottom: '.5em', fontWeight: '600px', fontSize: '30px' }} end={medicalCenterStats.visits ? medicalCenterStats.visits.toLocaleString() : 0} />
							<ResponsiveContainer width="100%" height={100}>
								<AreaChart data={medicalCenterChartData}>
									<CartesianGrid strokeDasharray="3 3" />
									<XAxis dataKey="Date" hide />
									<YAxis hide />
									<Tooltip />
									<Area type="monotone" dataKey="Students" stroke="#8884d8" fill="#8884d8" fillOpacity={0.3} />
								</AreaChart>
							</ResponsiveContainer>
							<Text>Average Daily Visits: {medicalCenterStats.avgDailyVisits && !isNaN(medicalCenterStats.avgDailyVisits) ? medicalCenterStats.avgDailyVisits.toLocaleString() : 0}</Text>
						</Card>
					</Col>
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
