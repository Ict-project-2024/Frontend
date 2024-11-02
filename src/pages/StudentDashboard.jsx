import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { Layout, Row, Col, Card, Progress, Typography, Button, Checkbox, message, Spin } from 'antd';
import { TrophyOutlined } from '@ant-design/icons';
import GreetingSection from '../components/GreetingSection'; // Adjust the path as needed
import '../assets/css/StudentDashboard.css'; // Ensure you have the correct path
import FooterComponent from '../components/FooterComponent'; // Adjust the path as needed
import { formatDistance, formatDistanceToNow, set } from 'date-fns';
import RankingBox from '../components/RankingBox';
import newApiRequest from '../utils/apiRequests';

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
	const [voteSubmitting, setVoteSubmitting] = useState(false)

	// User badges data: nivindulakshitha
	const [userBadges, setUserBadges] = useState({})
	const badgeNames = {
		"firstStep": "First Step",
		"accuracyStar": "Accuracy Star",
		"dailyContributor": "Daily Contributor",
		"frequentContributor": "Frequent Contributor",
		"weeklyWarrior": "Weekly Warrior"
	}
	const badgeImages = {
		"firstStep": "https://unimo.blob.core.windows.net/unimo/First Step.png",
		"accuracyStar": "https://unimo.blob.core.windows.net/unimo/Acuracy Star.png",
		"dailyContributor": "https://unimo.blob.core.windows.net/unimo/Daily Contributer.png",
		"frequentContributor": "https://unimo.blob.core.windows.net/unimo/Fequent Contributer.png",
		"weeklyWarrior": "https://unimo.blob.core.windows.net/unimo/Weekly warior.png",
		"validateContributor": "https://unimo.blob.core.windows.net/unimo/Validated Contributer.png"
	}
	const congratulationTexts = {
		"firstStep": "Congratulations on making your first occupancy update!",
		"accuracyStar": "Congratulations on maintaining a high accuracy rate!",
		"dailyContributor": "Congratulations on contributing daily!",
		"frequentContributor": "Congratulations on contributing frequently!",
		"weeklyWarrior": "Congratulations on contributing weekly!"
	}
	const [nextBadgeLevel, setNextBadgeLevel] = useState(0)

	// User top rankings data: nivindulakshitha
	const [userTopRankings, setUserTopRankings] = useState({});

	// Ranking board data: nivindulakshitha
	const [rankingBoardData, setRankingBoardData] = useState({})

	// Doctor availability status: nivindulakshitha
	const [isDoctorAvailable, setIsDoctorAvailable] = useState(false);

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

	// Check if the current time is within working hours: nivindulakshitha
	const isWithinWorkingHours = () => {
		const now = new Date();
		const currentHour = now.getHours();
		return currentHour >= 8 && currentHour < 16;
	};

	// Fetch the badges data for the user: nivindulakshitha
	useEffect(() => {
		newApiRequest(`/api/votes/get`, 'POST', { "userId": userId })
			.then(response => {
				if (response.success && response.data) {
					setUserBadges(response);
					prepareNextBadge(response.data.badges.frequentContributor, response.data.votes);
				}
			})
			.catch(error => console.error('Error fetching location data:', error));
	}, [userId]); // Dependency array to re-fetch when userId changes


	const checkDoctorAvailability = async () => {
		try {
			const response = await newApiRequest(`/api/medical-center/doctor-availability`, 'GET', {});
			if (response.success) {
				switch (response.data.isAvailable) {
					case true: {
						setIsDoctorAvailable(true && isWithinWorkingHours());
						break;
					}
					case false: {
						setIsDoctorAvailable(false);
						break;
					}
				}
			} else {
				setIsDoctorAvailable(false);
			}
		} catch (error) {
			console.error('Error fetching rankings data:', error);
		}
	};

	const fetchLocationData = async () => {
		const routeFix = { 'Student Canteen': 'canteen', 'Staff Canteen': 'canteen', 'Library': 'library', 'Medical Center': 'medical-center' };
		const locationsList = ['Student Canteen', 'Staff Canteen', 'Library', 'Medical Center'];

		const requests = locationsList.map(location => newApiRequest(`/api/${routeFix[location]}/status`, 'POST', { location: location }));
		const responses = await Promise.all(requests);

		const draftData = responses.reduce((acc, response, index) => {
			if (response.success) {
				const location = locationsList[index];
				const percent = response.data.votes ? overallCrowdednessPercentage(response.data.votes) : overallCrowdednessPercentage(response.data.currentOccupancy);
				let dateNow = new Date().setHours(new Date().getHours() + 5, new Date().getMinutes() + 30)
				acc[location] = {
					id: index,
					lastModified: formatDistance(new Date(response.data.lastModified), dateNow, { addSuffix: true }),
					percent: percent,
					status: response.data.votes ? determineCrowdedness(percent) : determineCrowdedness(response.data.currentOccupancy, location),
					name: location,
					description: `${response.data.votes ? 'About ' + esimateCrowd(response.data.votes) : 'Exactly ' + response.data.currentOccupancy} people`
				};
			}
			return acc;
		}, {});
		setLocationTraffic((prev) => ({ ...prev, ...draftData }));
	};

	const [fetchTrigger, setFetchTrigger] = useState(false)
	useEffect(() => {
		setInterval(() => {
			fetchLocationData();
			checkDoctorAvailability();
		}, 60000);

		// Trigger the fetch every 5 seconds for live updates
		setInterval(() => {
			setFetchTrigger(!fetchTrigger)
		}, 60000);
	}, []);

	// Fetch the required data for each location: nivindulakshitha
	useEffect(() => {
		const fetchBadgesData = async () => {
			try {
				const response = await newApiRequest(`/api/votes/get`, 'POST', { userId });
				if (response.success) {
					setUserBadges(response.data);
					prepareNextBadge(response.data.badges.frequentContributor, response.data.votes);
				}
			} catch (error) {
				console.error('Error fetching badges data:', error);
			}
		};

		const fetchRankingsData = async () => {
			try {
				const response = await newApiRequest(`/api/votes/all`, 'GET', {});
				if (response.success) {
					const allUsers = response.data;
					const userVotes = {};
					allUsers.forEach(user => { userVotes[user.userId] = user.votes; });

					const rankingBoard = allUsers.sort((a, b) => b.votes - a.votes);
					const firstThreeVotes = rankingBoard.slice(0, 3);
					let draftRankingData = {};
					let draftTopThree = {};

					await Promise.all(rankingBoard.map(async user => {
						const userResponse = await newApiRequest(`/api/user/`, 'POST', { userId: user.userId });
						if (userResponse !== null) {
							userResponse.entries = user.votes;
							if (firstThreeVotes.includes(user)) {
								draftTopThree[firstThreeVotes.indexOf(user)] = userResponse;
							}
							draftRankingData[rankingBoard.indexOf(user)] = userResponse;
						}
					}));

					setUserTopRankings(draftTopThree);
					setRankingBoardData(draftRankingData);
				}
			} catch (error) {
				console.error('Error fetching rankings data:', error);
			}
		};

		fetchBadgesData();
		fetchRankingsData();
		fetchLocationData();
		checkDoctorAvailability();

	}, [fetchTrigger]);


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
		setVoteSubmitting(true);
		if (!canteen || !peopleRange || !agreement) {
			message.error('Please fill all the fields and agree to the terms.');
			setVoteSubmitting(false);
			return;
		}

		// Submit the traffic to the database according to the respective canteen: nivindulakshitha
		const request = await newApiRequest(`/api/canteen/report`, 'POST', { userId, canteen, peopleRange });
		if (request.success) {
			message.success('Data submitted successfully');
			setFetchTrigger(!fetchTrigger);
			setVoteSubmitting(false);
			setCanteen(null);
			setPeopleRange(null);
			setAgreement(false);
		} else {
			message.error('Failed to submit data. Please try again.');
			setVoteSubmitting(false);
		}
	};

	return (
		<Layout>
			<Content style={{ padding: '0 20px', overflow: 'auto' }}>
				<GreetingSection name={userName.first} />
				<div className="site-layout-content">
					<Row gutter={[16, 16]}>
						{
							//Display the location data: nivindulakshitha
							Object.keys(locationTraffic).length > 0 && Object.keys(locationTraffic).map(locationKey => (
								<Col xs={24} sm={12} md={6} key={locationTraffic[locationKey].id}>
									<Card title={locationTraffic[locationKey].name} extra={<span style={{ color: getColor(locationTraffic[locationKey].status) }}>{locationTraffic[locationKey].status}</span>}>
										<Progress type="circle" percent={locationTraffic[locationKey].percent} size={80} strokeColor={getColor(locationTraffic[locationKey].status)} />
										<p>{locationTraffic[locationKey].description}</p>
										{
											locationKey === 'Medical Center' &&
											(<p><span className={`doctor-availability-status ${isDoctorAvailable}`}></span> Doctor is {!isDoctorAvailable ? 'not' : ''} available</p>)
										}
										<p>last update was {locationTraffic[locationKey].lastModified}</p>
									</Card>
								</Col>
							))
						}

						{
							(!Object.keys(locationTraffic).includes("Medical Center")) && (
								<Col xs={24} sm={12} md={6} key={0}>
									<Card title="Medical Center">
										<p><span className={`doctor-availability-status ${isDoctorAvailable}`}></span> Doctor is {!isDoctorAvailable ? 'not' : ''} available</p>
									</Card>
								</Col>
							)
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
								<Spin spinning={voteSubmitting}>
									<Button type="primary" className="submit-button" onClick={handleSubmit}>
										Submit
									</Button>
								</Spin>
							</Card>
						</Col>
						<Col xs={24} md={12}>
							<Card title="This week's Canteen Heroes">
								<Row gutter={[16, 16]} className="heroes-row">
									{
										// Display the user rankings: nivindulakshitha
										userTopRankings && Object.keys(userTopRankings).length > 0 && (
											<>
												<Col xs={24} sm={8}>
													<Card className="hero-card" cover={<img src="https://unimo.blob.core.windows.net/unimo/Dinning Dynamo.png" alt="Dining Dynamo" />}>
														<Card.Meta title="Dining Dynamo" description={userTopRankings[1] && `${userTopRankings[1].firstName} ${userTopRankings[1].lastName}`} />
														{userTopRankings[1] && (<Text>{userTopRankings[1].entries}  Entries in a row</Text>)}
													</Card>
												</Col>
												<Col xs={24} sm={8} className="hero-card-big">
													<Card className="hero-card" cover={<img src="https://unimo.blob.core.windows.net/unimo/Canteen Champion.png" alt="Canteen Champion" />}>
														<Card.Meta title="Canteen Champion" description={userTopRankings[0] && `${userTopRankings[0].firstName} ${userTopRankings[0].lastName}`} />
														{userTopRankings[0] && (<Text>{userTopRankings[0].entries}  Entries in a row</Text>)}
													</Card>
												</Col>
												<Col xs={24} sm={8}>
													<Card className="hero-card" cover={<img src="https://unimo.blob.core.windows.net/unimo/Foodie Forcaster.png" alt="Foodie Forecaster" />}>
														<Card.Meta title="Foodie Forecaster" description={userTopRankings[2] && `${userTopRankings[2].firstName} ${userTopRankings[2].lastName}`} />
														{userTopRankings[2] && (<Text>{userTopRankings[2].entries}  Entries in a row</Text>)}
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
													<img src={badgeImages[badge]} alt={badgeNames[badge]} className="placeholder-image" />
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
														<Card cover={<img src={badgeImages[badge]} alt={badge} />}>
															<Card.Meta title={badgeNames[badge]} />
														</Card>
													</Col>
												)) : (
													// Display the badges that are not boolean and not null: nivindulakshitha
													userBadges.badges[badge] !== null && (<Col xs={24} sm={8} key={badge}>
														<Card cover={<img src={badgeImages[badge]} alt={badge} />}>
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
								{
									// Display the user ranking: nivindulakshitha
									Object.keys(rankingBoardData).length > 0 && Object.keys(rankingBoardData).map(key => {
										return (
											<RankingBox
												key={key}
												userPosition={Number.parseInt(key) + 1}
												userName={`${rankingBoardData[key].firstName} ${rankingBoardData[key].lastName}`}
												entriesCount={rankingBoardData[key].entries}
												selfBox={rankingBoardData[key]._id === userId}
											/>
										)
									})
								}
							</Card>
						</Col>
					</Row>
				</div>
			</Content>
			<FooterComponent />
		</Layout>
	);
};

Dashboard.propTypes = {
	userId: PropTypes.string.isRequired,
	userName: PropTypes.shape({
		first: PropTypes.string.isRequired,
		last: PropTypes.string.isRequired,
	}).isRequired,
};

export default Dashboard;

