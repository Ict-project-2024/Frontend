import React from 'react';
import { Input, Button, Checkbox, Tabs } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import ParticlesComponent from '../components/ParticlesComponent';
import './Login.css'; // Adjust the path as needed
import RegistrationComponent from './SignUpPage'; // Adjust the path as needed

const { TabPane } = Tabs;

const LoginComponent = () => {
    return (
        <div className="login-container">
            <ParticlesComponent />
            <div className="login-content">
                <div className="login-header">
                    <img src="src/assets/images/logo.png" alt="Unimo Logo" className="login-logo" />
                    <p className="login-subtitle">Access real-time updates on faculty facilities from wherever you're at.<br />Run by students for students.</p>
                </div>
                <div className="login-form-container">
                    <Tabs defaultActiveKey="1" centered>
                        <TabPane tab="Login" key="1">
                            <div className="tab-content">
                                <div className="login-form">
                                    <Input
                                        size="large"
                                        placeholder="Username"
                                        prefix={<UserOutlined />}
                                        className="login-input"
                                    />
                                    <Input.Password
                                        size="large"
                                        placeholder="Password"
                                        prefix={<LockOutlined />}
                                        className="login-input"
                                    />
                                    <div className="login-options">
                                        <Checkbox>Remember username</Checkbox>
                                        <a href="#" className="forgot-password-link">Forgot Password</a>
                                    </div>
                                    <Button type="primary" size="large" className="login-button">Login</Button>
                                </div>
                            </div>
                        </TabPane>
                        <TabPane tab="Sign Up" key="2">
                            <div className="tab-content">
                                <RegistrationComponent />
                            </div>
                        </TabPane>
                    </Tabs> 
                </div>
            </div>
        </div>
    );
};

export default LoginComponent;
