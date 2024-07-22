import React, { useState } from 'react';
import { Input, Button, Row, Col } from 'antd';
import './Signup.css'; // Adjust the path as needed

const RegistrationComponent = () => {
    const [form, setForm] = useState({
      firstName: '',
      lastName: '',
      password: '',
      confirmPassword: '',
      phoneNumber: '',
      universityEmail: '',
      verificationCode: ''
    });
  
    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setForm(prevForm => ({
        ...prevForm,
        [name]: value
      }));
    };
  
    const handleSubmit = (e) => {
      e.preventDefault();
      // Handle form submission here
      console.log(form);
    };
  
    const handleGetCode = () => {
      // Handle getting verification code
      console.log("Getting verification code for:", form.universityEmail);
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
            <Row gutter={16} style={{ marginBottom: '16px' }}>
              <Col span={18}>
                <Input
                  name="universityEmail"
                  placeholder="University Email"
                  value={form.universityEmail}
                  onChange={handleInputChange}
                />
              </Col>
              <Col span={6}>
                <Button onClick={handleGetCode} className="get-code-button" block>
                  Get Code
                </Button>
              </Col>
            </Row>
            <Input
              style={{ marginBottom: '16px' }}
              name="verificationCode"
              placeholder="Verification code"
              value={form.verificationCode}
              onChange={handleInputChange}
            />
            <Button type="primary" htmlType="submit" className="register-button" block>
              Register
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegistrationComponent;

