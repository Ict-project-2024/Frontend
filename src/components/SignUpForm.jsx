import React, { useState } from 'react';
import { Input, Button, Row, Col, Radio, Upload, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import axios from 'axios';
import '../assets/css/Signup.css';
import RegistrationSuccessPopup from '../components/RegistrationSuccessPopup';

const RegistrationComponent = ({ onSwitchToLogin }) => {
	const [form, setForm] = useState({
		firstName: '',
		lastName: '',
		gender: 'Male',
		registrationNumber: '',
		password: '',
		confirmPassword: '',
		phoneNumber: '',
		universityEmail: '',
		headshot: null, // Add a new field for the image
	});

	const [isModalVisible, setIsModalVisible] = useState(false);
	const [errorMessage, setErrorMessage] = useState('');

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setErrorMessage('');
		setForm((prevForm) => ({
			...prevForm,
			[name]: value,
		}));
	};

	const handleGenderChange = (e) => {
		setForm((prevForm) => ({
			...prevForm,
			gender: e.target.value,
		}));
	};

	const handleImageChange = (info) => {
		if (info.file.status === 'done') {
			message.success(`${info.file.name} file uploaded successfully.`);
			setForm((prevForm) => ({
				...prevForm,
				headshot: info.file.originFileObj,
			}));
		} else if (info.file.status === 'error') {
			message.error(`${info.file.name} file upload failed.`);
		}
	};

	const validateForm = () => {
		const emailRegex = /^[a-z]+[0-9]+@fot\.sjp\.ac\.lk$/;
		const teRegex = /^TE\d{6}$/i;

		const { firstName, lastName, gender, registrationNumber, password, confirmPassword, phoneNumber, universityEmail, headshot } = form;

		if (!firstName || !lastName || !gender || !registrationNumber || !password || !confirmPassword || !phoneNumber || !universityEmail || !headshot) {
			return 'One or more details you entered were incorrect. Please try again.';
		} else if (!teRegex.test(registrationNumber)) {
			return 'Invalid registration number format. It should start with "TE" followed by 6 digits.';
		} else if (password !== confirmPassword) {
			return 'Passwords do not match.';
		} else if (password.length < 6) {
			return 'Password should be at least 6 characters long.';
		} else if (phoneNumber.length !== 9) {
			return 'Invalid phone number. Please enter a valid 0 removed 9-digit phone number.';
		} else if (!emailRegex.test(universityEmail)) {
			return 'Invalid email format. Please use your university email.';
		}
		return '';
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		const validationError = validateForm();
		if (validationError) {
			setErrorMessage(validationError);
			return;
		}
		setErrorMessage('');

		const formData = new FormData();
		for (const key in form) {
			formData.append(key, form[key]);
		}

		try {
			const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/auth/register`, formData, {
				headers: {
					'Content-Type': 'multipart/form-data',
				},
			});

			console.log('Backend POST Request Details:', {
				url: `${import.meta.env.VITE_BASE_URL}/api/auth/register`,
				method: 'POST',
				headers: {
					'Content-Type': 'multipart/form-data',
				},
				body: formData,
				response: response.data,
			});

			if (response.status !== 200) {
				throw new Error('Registration failed. Status: ' + response.status);
			}

			setIsModalVisible(true); // Show the popup when registration is successful
		} catch (error) {
			console.error('Registration Error:', error);
			setErrorMessage('Failed to register. Please try again later.');
		}
	};

	const handleCloseModal = () => {
		setIsModalVisible(false);
		onSwitchToLogin();
	};

	return (
		<div className="registration-container">
			<div className="registration-content">
				<div className="registration-form-container">
					<form onSubmit={handleSubmit} className="registration-form">
						{errorMessage && (
							<div className="error-message">
								{errorMessage}
							</div>
						)}
						<Row gutter={16} style={{ marginBottom: '16px' }}>
							<Col span={12}>
								<Input
									name="firstName"
									placeholder="First name"
									value={form.firstName}
									onChange={handleInputChange}
								/>
							</Col>
							<Col span={12}>
								<Input
									name="lastName"
									placeholder="Last name"
									value={form.lastName}
									onChange={handleInputChange}
								/>
							</Col>
						</Row>
						<div style={{ marginBottom: '16px' }}>
							<Radio.Group onChange={handleGenderChange} value={form.gender}>
								<Radio value="Male">Male</Radio>
								<Radio value="Female">Female</Radio>
								<Radio value="Other">Other</Radio>
							</Radio.Group>
						</div>
						<Input
							style={{ marginBottom: '16px' }}
							name="registrationNumber"
							placeholder="University registration number (TE218993)"
							value={form.registrationNumber}
							onChange={handleInputChange}
						/>
						<Input.Password
							style={{ marginBottom: '16px' }}
							name="password"
							placeholder="Password (6 digits at least, case sensitive)"
							value={form.password}
							onChange={handleInputChange}
						/>
						<Input.Password
							style={{ marginBottom: '16px' }}
							name="confirmPassword"
							placeholder="Confirm password"
							value={form.confirmPassword}
							onChange={handleInputChange}
						/>
						<Input
							style={{ marginBottom: '16px' }}
							name="phoneNumber"
							placeholder="Phone number"
							value={form.phoneNumber}
							onChange={handleInputChange}
							addonBefore="+94"
						/>
						<Input
							style={{ marginBottom: '16px' }}
							name="universityEmail"
							placeholder="University Email"
							value={form.universityEmail}
							onChange={handleInputChange}
						/>

						<div className="upload-container" style={{ marginBottom: '16px' }}>
							<Upload
								name="headshot"
								showUploadList={false}
								beforeUpload={() => false}
								onChange={handleImageChange}
								className="upload-button"
							>
								<Button
									icon={<UploadOutlined />}
									className="custom-upload-button"
								>
									Upload Profile Picture
								</Button>
							</Upload>
							<div className="upload-description">
								This image is a must due security reasons.
							</div>
						</div>

						<Button type="primary" htmlType="submit" className="register-button" block>
							Register
						</Button>
					</form>
				</div>
			</div>
			<RegistrationSuccessPopup
				isVisible={isModalVisible}
				onClose={handleCloseModal}
			/>
		</div>
	);
};

export default RegistrationComponent;
