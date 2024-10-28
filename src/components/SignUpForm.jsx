import React, { useState } from 'react';
import { Input, Button, Row, Col, Radio, Upload, message, Progress } from 'antd';
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
		headshot: null,
	});

	const [isModalVisible, setIsModalVisible] = useState(false);
	const [errorMessage, setErrorMessage] = useState('');
	const [uploadProgress, setUploadProgress] = useState(0);
	const [uploading, setUploading] = useState(false);
	const [imageUploaded, setImageUploaded] = useState(false); // New flag for image upload status
	const [registering, setRegistering] = useState(false); // New state for registration loading indicator

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

	const handleImageChange = async (info) => {
		setUploading(true);
		setUploadProgress(0);

		if (info.file) {
			try {
				const tokenResponse = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/sas-token/genarate`);
				console.log(`${import.meta.env.VITE_BASE_URL}/api/sas-token/genarate`);
				const { sasUrl, blobUrl } = tokenResponse.data;
				const fileData = info.file; 
				console.log(info.file);
        
				const uploadResponse = await axios.put(sasUrl, fileData, {
					headers: {
						'x-ms-blob-type': 'BlockBlob',
						'Content-Type': fileData.type,
					},
					onUploadProgress: (progressEvent) => {
						const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
						setUploadProgress(progress);
					},
				});

				setForm((prevForm) => ({
					...prevForm,
					headshot: blobUrl,
				}));
				setImageUploaded(true); // Set flag to true after successful upload
				message.success(`${info.file.name} file uploaded successfully.`);
			} catch (error) {
				console.error("File Upload Error:", error.response ? error.response.data : error.message);
				message.error(`${info.file.name} file upload failed.`);
			} finally {
				setUploading(false);
			}
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
		console.log('Form Data:', form);

		const validationError = validateForm();
		if (validationError) {
			setErrorMessage(validationError);
			return;
		}

		if (!imageUploaded) {
			setErrorMessage('Please upload a profile picture before submitting.');
			return;
		}

		setErrorMessage('');
		setRegistering(true); // Start the registration loading indicator

		try {
			const formData = {
				...form,
				headshotUrl: form.headshot,
			};

			const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/auth/register`, formData);

			// Check for status 200 or 201 and handle accordingly
			if (response.status === 200) {
				setIsModalVisible(true); // Show modal only when status is 200
			} else if (response.status === 201) {
				message.success(`Note: ${response.data.message}`);
			} else {
				throw new Error('Registration failed. Status: ' + response.status);
			}
		} catch (error) {
		
			// Show the backend's error message if available
			if (error.response && error.response.data && error.response.data.message) {
				setErrorMessage(error.response.data.message);
			} else {
				setErrorMessage('Failed to register. Please try again later.');
			}
		} finally {
			setRegistering(false); // Stop the registration loading indicator
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
									loading={uploading}
								>
									{uploading ? 'Uploading...' : 'Upload Profile Picture'}
								</Button>
							</Upload>
							<div className="upload-description">
								This image is a must due to security reasons.
							</div>
							{uploading && (
								<Progress
									percent={uploadProgress}
									status={uploadProgress === 100 ? 'success' : 'active'}
									style={{ marginTop: '8px' }}
								/>
							)}
						</div>

						<Button type="primary" htmlType="submit" className="register-button" block loading={registering}>
							{registering ? 'Registering...' : 'Register'}
						</Button>
					</form>
					<RegistrationSuccessPopup isVisible={isModalVisible} onClose={handleCloseModal} />
				</div>
			</div>
		</div>
	);
};

export default RegistrationComponent;