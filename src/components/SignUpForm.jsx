import React, { useState } from 'react';
import { Input, Button, Row, Col } from 'antd';
import '../assets/css/Signup.css';
import RegistrationSuccessPopup from '../components/RegistrationSuccessPopup';

const RegistrationComponent = ({ onSwitchToLogin }) => {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
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

  const validateForm = () => {
    const emailRegex = /^[a-z]+[0-9]+@fot\.sjp\.ac\.lk$/;
    const { firstName, lastName, password, confirmPassword, phoneNumber, universityEmail } = form;
    if (!firstName || !lastName || !password || !confirmPassword || !phoneNumber || !universityEmail) {
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

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationError = validateForm();
    if (validationError) {
      setErrorMessage(validationError);
      return;
    }
    setErrorMessage('');
    setIsModalVisible(true); // Show the popup when the form is submitted successfully
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
