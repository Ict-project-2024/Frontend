import React, { useEffect, useState } from 'react';
import { Layout, Row, Col, Card, Progress, Typography, Button, Checkbox, message } from 'antd';
import { TrophyOutlined } from '@ant-design/icons';
import GreetingSection from '../components/GreetingSection'; // Adjust the path as needed
import '../assets/css/StudentDashboard.css'; // Ensure you have the correct path
import FooterComponent from '../components/FooterComponent'; // Adjust the path as needed
import { newApiRequest } from '../utils/apiRequests';
import { formatDistanceToNow } from 'date-fns';

const { Content } = Layout;
const { Text, Title, Link } = Typography;

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

// Determine the major crowd count based on the votes: nivindulakshitha
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

const Dashboard = ({ userId, userName }) => {
	const [locationTraffic, setLocationTraffic] = useState({});

	// User badges data: nivindulakshitha
	const [userBadges, setUserBadges] = useState({})
	const badgeNames = {
		"firstStep": "First Step",
		"accuracyStar": "Accuracy Star",
		"dailyContributor": "Daily Contributor",
		"frequentContributor": "Frequent Contributor",
		"weeklyWarrior": "Weekly Warrior"
	}
	const congratulationTexts = {
		"firstStep": "Congratulations on making your first occupancy update!",
		"accuracyStar": "Congratulations on maintaining a high accuracy rate!",
		"dailyContributor": "Congratulations on contributing daily!",
		"frequentContributor": "Congratulations on contributing frequently!",
		"weeklyWarrior": "Congratulations on contributing weekly!"
	}
	const [nextBadgeLevel, setNextBadgeLevel] = useState(0)

	// User rankings data: nivindulakshitha
	const [userRankings, setUserRankings] = useState({});

	// Calculate the next badge level based on the current badge level: nivindulakshitha
	const prepareNextBadge = (frequentContributorLevel, currentVotes) => {
		if (frequentContributorLevel == null) {
			setNextBadgeLevel(10 * currentVotes);
		} else if (frequentContributorLevel == "Bronze") {
			setNextBadgeLevel(2 * currentVotes);
		} else {
			setNextBadgeLevel(1 * currentVotes);
		}
	}

	// Fetch the canteen data for each location: nivindulakshitha
	useEffect(() => {
		const routeFix = { 'Student Canteen': 'canteen', 'Staff Canteen': 'canteen', 'Library': 'library', 'Medical Center': 'medical-center' };
		const locationsList = ['Student Canteen', 'Staff Canteen', 'Library', 'Medical Center'];
		let draftData = {};

		for (let location of locationsList) {
			newApiRequest(`http://localhost:3000/api/${routeFix[location]}/status`, 'POST', { "location": location })
				.then(response => {
					if (response.success) {
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

	}, [userName]);

	// Fetch the badges data for the user: nivindulakshitha
	useEffect(() => {
		newApiRequest(`http://localhost:3000/api/votes/get`, 'POST', { "userId": userId })
			.then(response => {
				if (response.success) {
					setUserBadges(response.data);
					prepareNextBadge(response.data.badges.frequentContributor, response.data.votes);
				}
			})
			.catch(error => {
				console.error('Error fetching location data:', error);
			})
	}, [userName])

	let userVotes = {}

	// Fetch the rankings data for the user: nivindulakshitha
	useEffect(() => {
		newApiRequest(`http://localhost:3000/api/votes/all`, 'GET', {})
			.then(async response => {
				if (response.success) {
					const allUsers = response.data;

					allUsers.forEach(user => {
						userVotes[user.userId] = user.votes;
					});

					// Get the first three users with the highest votes: nivindulakshitha
					const firstThreeVotes = await allUsers
						.sort((a, b) => b.votes - a.votes)
						.slice(0, 3)

					// Fetch the user data for the first three users: nivindulakshitha
					let draftData = {};
					firstThreeVotes.map(user => {

						newApiRequest(`http://localhost:3000/api/user/`, 'POST', { userId: user.userId })
							.then(response => {
								response.entries = user.votes;
								draftData[firstThreeVotes.indexOf(user)] = response;
							})
							.catch(error => {
								console.error('Error fetching user data:', error);
							})
							.finally(() => {
								setUserRankings(draftData);
							});
					})
				}
			})
			.catch(error => {
				console.error('Error fetching location data:', error);
			})
	}, [userName])


	const [canteen, setCanteen] = useState(null);
	const [peopleRange, setPeopleRange] = useState(null);
	const [agreement, setAgreement] = useState(false);

	// Function to determine color based on percentage
	const getColor = (crowdedness) => {
		if (crowdedness === 'Very crowded') return 'red';
		if (crowdedness === 'Moderately crowded') return 'orange';
		if (crowdedness === 'Crowded') return 'blue';
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
			message.success('Data submitted successfully');
		} else {
			message.error('Failed to submit data. Please try again.');
		}
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
				<GreetingSection name={userName.first} />
				<div className="site-layout-content">
					<Row gutter={[16, 16]}>
						{
							//Display the location data: nivindulakshitha
							Object.keys(locationTraffic).map(location => (
								<Col xs={24} sm={12} md={6} key={locationTraffic[location].id}>
									<Card title={locationTraffic[location].name} extra={<span style={{ color: getColor(locationTraffic[location].status) }}>{locationTraffic[location].status}</span>}>
										<Progress type="circle" percent={locationTraffic[location].percent} size={80} strokeColor={getColor(locationTraffic[location].status)} />
										<p>{locationTraffic[location].description}</p>
										<p>Last update was {locationTraffic[location].lastModified}</p>
									</Card>
								</Col>
							))
						}
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
									{
										userRankings && Object.keys(userRankings).length > 0 && (
											<>
												<Col xs={24} sm={8}>
													<Card className="hero-card" cover={<img src="https://dummyimage.com/400x400/aaaaaa/2b2b2b.png&text=Dining Dynamo" alt="Dining Dynamo" />}>
														<Card.Meta title="Dining Dynamo" description={ userRankings[1] && `${userRankings[1].firstName} ${userRankings[1].lastName}`} />
														{userRankings[1] && (<Text>{ userRankings[1].entries}  Entries in a row</Text>)}
													</Card>
												</Col>
												<Col xs={24} sm={8} className="hero-card-big">
													<Card className="hero-card" cover={<img src="https://dummyimage.com/400x400/aaaaaa/2b2b2b.png&text=Canteen Champion" alt="Canteen Champion" />}>
														<Card.Meta title="Canteen Champion" description={ userRankings[0] && `${userRankings[0].firstName} ${userRankings[0].lastName}`} />
														{userRankings[0] && (<Text>{ userRankings[0].entries}  Entries in a row</Text>)}
													</Card>
												</Col>
												<Col xs={24} sm={8}>
													<Card className="hero-card" cover={<img src="https://dummyimage.com/400x400/aaaaaa/2b2b2b.png&text=Foodie Forecaster" alt="Foodie Forecaster" />}>
														<Card.Meta title="Foodie Forecaster" description={ userRankings[2] && `${userRankings[2].firstName} ${userRankings[2].lastName}`} />
														{userRankings[2] && (<Text>{ userRankings[2].entries}  Entries in a row</Text>)}
													</Card>
												</Col>
											</>
										)
									}
								</Row>
							</Card>
						</Col>
					</Row>
					<Row gutter={[16, 16]} style={{ marginTop: '20px' }}>
						<Col xs={24} md={12}>
							<Card className="badge-card">
								<Text>How close you are to your next badge?</Text>
								<Progress percent={nextBadgeLevel} />
								<Link href="/profile" className="profile-link">See your badges in profile</Link>
							</Card>
							{
								// Display the claimed badges: nivindulakshitha
								userBadges && userBadges.badges ? (
									Object.keys(userBadges.badges).map(badge => (
										// Some badges are holding true or false values; check for those: nivindulakshitha
										typeof userBadges.badges[badge] == 'boolean' && userBadges.badges[badge] && (
											<Card className="first-step-card" key={badge}>
												<div className="first-step-content">
													<img src={`https://dummyimage.com/400x400/aaaaaa/2b2b2b.png&text=${badgeNames[badge]}`} alt="Placeholder" className="placeholder-image" />
													<div className='width-full'>
														<Title level={4}>{badgeNames[badge]}</Title>
														<Text>{congratulationTexts[badge]}</Text>
														<Button type="primary" icon={<TrophyOutlined />} disabled>Claim now!</Button>
													</div>
												</div>
											</Card>
										)

									))) : (
									<p className='smallLetters'>No claimed badges available right now</p>
								)
							}
						</Col>
						<Col xs={24} md={12}>
							<Card title="Your next badges">
								<Row gutter={[16, 16]}>
									{
										// Display the badges data: nivindulakshitha
										userBadges && userBadges.badges ? (
											Object.keys(userBadges.badges).map(badge => (
												// Some badges are holding true or false values; check for those: nivindulakshitha
												typeof userBadges.badges[badge] == 'boolean' ? (!userBadges.badges[badge] && (
													<Col xs={24} sm={8} key={badge}>
														<Card cover={<img src={`https://dummyimage.com/400x400/aaaaaa/2b2b2b.png&text=${badge}`} alt={badge} />}>
															<Card.Meta title={badgeNames[badge]} />
														</Card>
													</Col>
												)) : (
														// Display the badges that are not boolean and not null: nivindulakshitha
														userBadges.badges[badge] !== null && (<Col xs={24} sm={8} key={badge}>
														<Card cover={<img src={`https://dummyimage.com/400x400/aaaaaa/2b2b2b.png&text=${userBadges.badges[badge]}`} alt={badge} />}>
															<Card.Meta title={badgeNames[badge]} />
														</Card>
														</Col>)
												)
											))
										) : (
											<p className='smallLetters'>No badges available right now</p>
										)
									}
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

