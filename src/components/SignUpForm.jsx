import React, { useState } from 'react';
import { Input, Button, Row, Col, Radio } from 'antd';
import axios from 'axios';
import '../assets/css/Signup.css';
import RegistrationSuccessPopup from '../components/RegistrationSuccessPopup';

const RegistrationComponent = ({ onSwitchToLogin }) => {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    gender: '',
    registrationNumber: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
    universityEmail: '',
  });

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
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

  const validateForm = () => {
    const emailRegex = /^[a-z]+[0-9]+@fot\.sjp\.ac\.lk$/;
    const { firstName, lastName, gender, registrationNumber, password, confirmPassword, phoneNumber, universityEmail } = form;
    if (!firstName || !lastName || !gender || !registrationNumber || !password || !confirmPassword || !phoneNumber || !universityEmail) {
      return 'One or more details you entered were incorrect. Please try again.';
    }
    if (password !== confirmPassword) {
      return 'Passwords do not match.';
    }
    if (!emailRegex.test(universityEmail)) {
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

    try {
      const response = await axios.post('http://localhost:3000/api/auth/register', form, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('Backend POST Request Details:', {
        url: 'http://localhost:3000/api/auth/register',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: form,
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
