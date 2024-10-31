import React, { useState, useEffect } from 'react';
import { Layout, Row, Col, Card, Progress, Table, Button, Typography, DatePicker,ConfigProvider } from 'antd';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { DownloadOutlined } from '@ant-design/icons';
import GreetingSection from '../components/GreetingSection';
import { formatDistance, formatDistanceToNow } from 'date-fns';
import CountUp from 'react-countup'
import locale from 'antd/es/date-picker/locale/en_US';
import newApiRequest from '../utils/apiRequests';

const { Content } = Layout;
const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

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

// Fix the time to UTC+5:30: nivindulakshitha
const fixDateTime = (originalTime) => {
	const date = new Date(originalTime);
	date.setMinutes(date.getMinutes() + 330); // UTC+5:30

	const newDate = date.toISOString().split('T')[0];
	const newTime = date.toISOString().split('T')[1].slice(0, 5);

	return Object.assign({ date: newDate, time: newTime });
}

import PropTypes from 'prop-types';
import { useAuth } from '../context/AuthContext';

const AdminDashboard = ({ userId, userName }) => {
	const [locationTraffic, setLocationTraffic] = useState({});
	const [libraryChartData, setLibraryChartData] = useState([])
	const [libraryStats, setLibraryStats] = useState({})
	const [medicalCenterChartData, setMedicalCenterChartData] = useState([])
	const [medicalCenterStats, setMedicalCenterStats] = useState({})
	const {user} = useAuth();
	const [logData, setLogData] = useState([
		{
			id: 0,
			name: "Library Log",
			logs: []
		},
		{
			id: 1,
			name: "Medical Center Log",
			logs: []
		}
	])

	// Fetch the required data for each location: nivindulakshitha
	useEffect(() => {
		const routeFix = { 'Student Canteen': 'canteen', 'Staff Canteen': 'canteen', 'Library': 'library', 'Medical Center': 'medical-center' };
		const locationsList = ['Student Canteen', 'Staff Canteen', 'Library', 'Medical Center'];
		let draftData = {};

		for (let location of locationsList) {
			newApiRequest(`/api/${routeFix[location]}/status`, 'POST', { "location": location })
				.then(response => {
					let dateNow = new Date().setHours(new Date().getHours() + 5, new Date().getMinutes() + 30)

					if (response.success && response.data) {
						// Set the data for each location: nivindulakshitha
						draftData[location] = {}
						draftData[location].id = locationsList.indexOf(location);
						draftData[location].lastModified = formatDistance(new Date(response.data.lastModified), dateNow, { addSuffix: true }),
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

		newApiRequest(`/api/library/history`, 'GET', {})
			.then(response => {
				if (response.success && response.data) {
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

	// Fetch the required data for library: nivindulakshitha
	useEffect(() => {
		newApiRequest(`/api/library/useraccess`, 'POST', {}) // Time slot should be included
			.then(response => {
				if (response.success && response.data) {
					// Set the data for library: nivindulakshitha
					let index = 0;
					response.data.map((user) => {
						const fixedEnterDateTime = fixDateTime(user.entryTime);
						const fixedExitDateTime = user.exitTime && fixDateTime(user.exitTime);
						user.checkIn = fixedEnterDateTime.time;
						user.date = fixedEnterDateTime.date;
						user.checkOut = fixedExitDateTime ? fixedExitDateTime.time : "--:--";

						newApiRequest(`/api/user/`, 'POST', { "teNumber": user.teNumber })
							.then(result => {
								user.student = result !== null && result.firstName && result.lastName ? `${result.firstName} ${result.lastName}` : user.teNumber.toUpperCase();
								response.data[index] = user;
								index++;
								response.data.key = response.data._id;
								logData[0].logs = response.data;
							});
					});
				}
			})
			.catch(error => {
				console.error('Error fetching library data:', error);
			})
	}, [userId])

	useEffect(() => {
		newApiRequest(`/api/medical-center/useraccess`, 'POST', {}) // Time slot should be included
			.then(response => {
				if (response.success && response.data) {
					// Set the data for medical center: nivindulakshitha
					let index = 0;
					response.data.map((user) => {
						const fixedEnterDateTime = fixDateTime(user.entryTime);
						const fixedExitDateTime = user.exitTime && fixDateTime(user.exitTime);
						user.checkIn = fixedEnterDateTime.time;
						user.date = fixedEnterDateTime.date;
						user.checkOut = fixedExitDateTime ? fixedExitDateTime.time : "--:--";

						newApiRequest(`/api/user/`, 'POST', { "teNumber": user.teNumber })
							.then(result => {
								user.student = result !== null && result.firstName && result.lastName ? `${result.firstName} ${result.lastName}` : user.teNumber.toUpperCase();
								response.data[index] = user;
								index++;
								response.data.key = response.data._id;
								logData[1].logs = response.data;
							});
					});
				}
			})
			.catch(error => {
				console.error('Error fetching library data:', error);
			})
	}, [userId])

	// Fetch the required data for medical center: nivindulakshitha
	useEffect(() => {
		// Fetch the required data for each location: nivindulakshitha
		let draftData = [];
		let totalEntrances = 0;
		let totalDays = 0;

		newApiRequest(`/api/medical-center/history`, 'GET', {})
			.then(response => {
				if (response.success && response.data) {
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

    const [visibleCalendars, setVisibleCalendars] = useState({});

    const toggleCalendarVisibility = (id) => {
        setVisibleCalendars((prevState) => ({
            ...prevState,
            [id]: !prevState[id]
        }));
    };

    const handleDatePickerChange = (id, date, dateString) => {
        console.log(`Table ${id}:`, date, dateString); // Handle the selected date here
        setVisibleCalendars((prevState) => ({
            ...prevState,
            [id]: false
        }));  // Close the calendar after selection
	};
	
	// Download the logs data functionality: nivindulakshitha
	const downloadLogs = (logId) => {
		const headers = Object.keys(logData[logId].logs[0]).join(',\t');
		const csv = [headers, ...logData[logId].logs.map(row => Object.values(row).join(',\t'))].join('\n');
		const blob = new Blob([csv], { type: 'text/csv' });
		const url = window.URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = `${logData[logId].name} Data.csv`;
		a.click();
		window.URL.revokeObjectURL(url);
	}

	const filterLogs = (key, start, end) => {
		console.log(key, start, end)
	}

	return (
		<Layout>
			<Content style={{ padding: '0 50px', overflow: 'auto' }}>
				{/* Greeting Section */}
				<div style={{ marginBottom: '20px' }}>
					<GreetingSection name={userName.first ? userName.first : user.firstName} />
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
							<CountUp style={{ margin: '8px 0', marginBottom: '.5em', fontWeight: '600px', fontSize: '30px' }} duration={5} end={libraryStats.visits ? libraryStats.visits.toLocaleString() : 0} />
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
							<CountUp style={{ margin: '8px 0', marginBottom: '.5em', fontWeight: '600px', fontSize: '30px' }} duration={5} end={medicalCenterStats.visits ? medicalCenterStats.visits.toLocaleString() : 0} />
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

                <ConfigProvider locale={locale}>
            <Row gutter={[16, 16]} style={{ marginTop: '20px' }}>
                {logData.map(log => (	
                    <Col xs={24} md={12} key={log.id}>
                        <Card
                            title={
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                                    <span>{log.name}</span>
                                    <div style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
										<Button type="default" onClick={() => { filterLogs(log.id, undefined, undefined) } } style={{ marginRight: '2px', fontSize: '14px', padding: '4px 12px' }}>All time</Button>
										<Button type="default" onClick={() => { filterLogs(log.id, new Date(), new Date()) }} style={{ marginRight: '2px', fontSize: '14px', padding: '4px 12px' }}>Today</Button>
                                        <Button
                                            type="default"
                                            style={{ marginRight: '8px', fontSize: '14px', padding: '4px 12px' }}
                                            onClick={() => toggleCalendarVisibility(log.id)}
                                        >
                                            Custom range
                                        </Button>
										<Button onClick={() => { downloadLogs(log.id) }} type="primary" icon={<DownloadOutlined />} style={{ fontSize: '14px', padding: '4px 12px' }}>
                                            Download log
                                        </Button>
                                        {visibleCalendars[log.id] && (
                                            <DatePicker
                                                open={true}
                                                onChange={(date, dateString) => handleDatePickerChange(log.id, date, dateString)}
                                                dropdownClassName="custom-range-picker-dropdown"
                                                getPopupContainer={trigger => trigger.parentNode} // Ensure it appears under the button
                                                onOpenChange={(open) => {
                                                    if (!open) {
                                                        setVisibleCalendars((prevState) => ({
                                                            ...prevState,
                                                            [log.id]: false
                                                        }));
                                                    }
                                                }}
                                            />
                                        )}
                                    </div>
                                </div>
                            }
                            bodyStyle={{ padding: 0 }}
                            style={{ width: '100%' }}
                        >
                            <Table
                                dataSource={log.logs}
                                columns={[
                                    { title: 'Date', dataIndex: 'date', key: 'date', align: 'center' },
                                    {
                                        title: 'Student',
                                        dataIndex: 'student',
                                        key: 'student',
                                        align: 'center',
                                        render: (text) => (
                                            <span style={{
                                                color: '#1890ff',
                                                cursor: 'pointer'
                                            }}>
                                                {text}
                                            </span>
                                        )
                                    },
                                    { title: 'Check in', dataIndex: 'checkIn', _id: 'checkIn', align: 'center' },
                                    { title: 'Check out', dataIndex: 'checkOut', _id: 'checkOut', align: 'center' }
                                ]}
                                pagination={{
                                    pageSize: 10,
                                    showSizeChanger: false,
                                    position: ['bottomCenter'],
                                    total: log.logs.length,
                                    showQuickJumper: true
                                }}
                                rowClassName="log-table-row"
                                style={{ width: '100%' }}
                            />
                        </Card>
                    </Col>
                ))}
            </Row>
        </ConfigProvider>
			</Content>
		</Layout>
	)
};

AdminDashboard.propTypes = {
	userId: PropTypes.string.isRequired,
	userName: PropTypes.shape({
		first: PropTypes.string.isRequired,
		last: PropTypes.string
	}).isRequired
};

export default AdminDashboard;
