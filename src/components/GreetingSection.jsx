import React, { useState, useEffect } from 'react';
import { Row, Col } from 'antd';
import { HomeOutlined, BookOutlined, DesktopOutlined } from '@ant-design/icons';
import '../assets/css/GreetingSection.css'; // Ensure you have the correct path

const GreetingSection = ({ name }) => {
	const [user, setUser] = useState({
		name: name,
		avatar: 'src/assets/images/avatar.png'
	});
	const [dateTime, setDateTime] = useState({
		date: '',
		month: '',
		day: '',
		time: '',
		greeting: ''
	});

	useEffect(() => {
		// Function to update date, day, and time
		const updateDateTime = () => {
			const now = new Date();
			const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
			const date = now.toLocaleDateString('en-GB', { day: 'numeric' });
			const month = now.toLocaleDateString('en-GB', { month: 'long' });
			const day = now.toLocaleDateString('en-GB', { weekday: 'long' });
			const time = now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: true });

			// Determine whether it is morning, afternoon, or night
			let greeting = '';
			const currentHour = now.getHours();

			if (currentHour >= 5 && currentHour < 12) {
				greeting = 'morning';
			} else if (currentHour >= 12 && currentHour < 18) {
				greeting = 'afternoon';
			} else {
				greeting = 'night';
			}

			setDateTime({ date, month, day, time, greeting });
		};

		// Initial call to set the date and time
		updateDateTime();

		// Update the date and time every second
		const intervalId = setInterval(updateDateTime, 1000);

		// Cleanup interval on component unmount
		return () => clearInterval(intervalId);
	}, []);

	return (
		<div className="greeting-section">
			<Row align="middle" justify="space-between" style={{ width: '100%' }}>
				<Col xs={24} sm={12}>
					<div className="greeting-left">
						<img src={user.avatar} alt="avatar" className="greet-avatar" />
						<div className="greeting-text">
							<h2>Good {dateTime.greeting} {user.name}!</h2>
							<p>Here are some quick links</p>
							<div className="quick-links">
								<a href="https://lms.tech.sjp.ac.lk/"><HomeOutlined /> LMS</a>
								<a href="https://www.sjp.ac.lk/"><DesktopOutlined /> USJ Web</a>
								<a href="https://lib.sjp.ac.lk/"><BookOutlined /> E-Library</a>
							</div>
						</div>
					</div>
				</Col>
				<Col xs={24} sm={12}>
					<div className="greeting-right">
						<div className="date-time">
							<p><strong>Date</strong><br /><span>{dateTime.date}<span className='smallLetters'>/{dateTime.month}</span></span></p>
							<p><strong>Day</strong><br /><span>{dateTime.day}</span></p>
							<p><strong>Time</strong><br /><span className="uppercaseText">{dateTime.time}</span></p>
						</div>
					</div>
				</Col>
			</Row>
		</div>
	);
};

export default GreetingSection;
