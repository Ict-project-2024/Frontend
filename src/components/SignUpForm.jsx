import React, { useState } from 'react';
import { Input, Button, Row, Col, Radio, Upload, message, Progress, Spin } from 'antd';
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

	const [fieldErrors, setFieldErrors] = useState({}); // New state for field-specific errors
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [errorMessage, setErrorMessage] = useState('');
	const [uploadProgress, setUploadProgress] = useState(0);
	const [uploading, setUploading] = useState(false);
	const [imageUploaded, setImageUploaded] = useState(false); // New flag for image upload status
	const [registering, setRegistering] = useState(false); // New state for registration loading indicator

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setFieldErrors((prevErrors) => ({ ...prevErrors, [name]: '' })); // Clear specific field error
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
				const { sasUrl, blobUrl } = tokenResponse.data;
				const fileData = info.file;

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

	// Updated validateForm to track individual field errors
	const validateForm = () => {
		const errors = {};
		const emailRegex = /^[a-z]+[0-9]+@fot\.sjp\.ac\.lk$/;
		const teRegex = /^TE\d{6}$/i;

		if (!form.firstName) errors.firstName = 'First name is required.';
		if (!form.lastName) errors.lastName = 'Last name is required.';
		if (!teRegex.test(form.registrationNumber)) {
			errors.registrationNumber = 'Registration number must start with "TE" followed by 6 digits.';
		}
		if (form.password.length < 6) {
			errors.password = 'Password must be at least 6 characters long.';
		}
		if (form.password !== form.confirmPassword) {
			errors.confirmPassword = 'Passwords do not match.';
		}
		if (form.phoneNumber.length !== 9) {
			errors.phoneNumber = 'Phone number must be 9 digits long.';
		}
		if (!emailRegex.test(form.universityEmail)) {
			errors.universityEmail = 'Use your university email (e.g., example@fot.sjp.ac.lk).';
		}
		if (!imageUploaded) {
			errors.headshot = 'Profile picture is required.';
		}

		setFieldErrors(errors); // Update the state with field-specific errors
		return Object.keys(errors).length === 0; // Return true if no errors
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		// Validate the form and display errors if invalid
		if (!validateForm()) return;

		setRegistering(true); // Start the registration loading indicator

		try {
			const formData = {
				...form,
				headshotUrl: form.headshot,
			};

			const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/auth/register`, formData);

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
						<Row gutter={16} style={{ marginBottom: '16px' }}>
							<Col span={12}>
								<Input
									name="firstName"
									placeholder="First name"
									value={form.firstName}
									onChange={handleInputChange}
								/>
								{fieldErrors.firstName && <div className="error-message">{fieldErrors.firstName}</div>}
							</Col>
							<Col span={12}>
								<Input
									name="lastName"
									placeholder="Last name"
									value={form.lastName}
									onChange={handleInputChange}
								/>
								{fieldErrors.lastName && <div className="error-message">{fieldErrors.lastName}</div>}
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
							placeholder="University registration number (TE000000)"
							value={form.registrationNumber}
							onChange={handleInputChange}
						/>
						{fieldErrors.registrationNumber && <div className="error-message">{fieldErrors.registrationNumber}</div>}
						<Input.Password
							style={{ marginBottom: '16px' }}
							name="password"
							placeholder="Password"
							value={form.password}
							onChange={handleInputChange}
						/>
						{fieldErrors.password && <div className="error-message">{fieldErrors.password}</div>}
						<Input.Password
							style={{ marginBottom: '16px' }}
							name="confirmPassword"
							placeholder="Confirm password"
							value={form.confirmPassword}
							onChange={handleInputChange}
						/>
						{fieldErrors.confirmPassword && <div className="error-message">{fieldErrors.confirmPassword}</div>}
						<Input
							style={{ marginBottom: '16px' }}
							name="phoneNumber"
							placeholder="Phone number"
							value={form.phoneNumber}
							onChange={handleInputChange}
							addonBefore="+94"
						/>
						{fieldErrors.phoneNumber && <div className="error-message">{fieldErrors.phoneNumber}</div>}
						<Input
							style={{ marginBottom: '16px' }}
							name="universityEmail"
							placeholder="University Email"
							value={form.universityEmail}
							onChange={handleInputChange}
						/>
						{fieldErrors.universityEmail && <div className="error-message">{fieldErrors.universityEmail}</div>}
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
							{fieldErrors.headshot && <div className="error-message">{fieldErrors.headshot}</div>}
						</div>
						{uploadProgress > 0 && <Progress percent={uploadProgress} />}
						{errorMessage && <div className="error-message">{errorMessage}</div>}
						<div className="register-button-container">
							<Spin spinning={registering}>
								<Button type="primary" htmlType="submit" disabled={uploading || registering}>
									Register
								</Button>
							</Spin>
						</div>
					</form>
				</div>
				<RegistrationSuccessPopup visible={isModalVisible} onClose={handleCloseModal} />
			</div>
		</div>
	);
};

export default RegistrationComponent;
