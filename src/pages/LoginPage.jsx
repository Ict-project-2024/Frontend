import React from 'react';
import { Tabs } from 'antd';
import ParticlesComponent from '../components/ParticlesComponent';
import LoginForm from '../components/LoginForm'; // Adjust the path as needed
import RegistrationComponent from '../components/SignUpForm'; // Adjust the path as needed
import '../assets/css/Login.css';

const { TabPane } = Tabs;

const LoginComponent = () => {
    return (
        <div className="page-container">
            <ParticlesComponent />
            <div className="login-container">
                <div className="login-content">
                    <div className="login-header">
                        <img src="src/assets/images/logo.png" alt="Unimo Logo" className="login-logo" />
                        <p className="login-subtitle">Access real-time updates on faculty facilities from wherever you're at.<br />Run by students for students.</p>
                    </div>
                    <div className="login-form-container">
                        <Tabs defaultActiveKey="1" centered>
                            <TabPane tab="Login" key="1">
                                <div className="tab-content">
                                    <LoginForm />
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
        </div>
    );
};

export default LoginComponent;
