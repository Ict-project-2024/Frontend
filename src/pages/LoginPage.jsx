import React, { useEffect, useState } from 'react';
import { Tabs } from 'antd';
import ParticlesComponent from '../components/ParticlesComponent';
import LoginForm from '../components/LoginForm'; // Adjust the path as needed
import RegistrationComponent from '../components/SignUpForm'; // Adjust the path as needed
import FooterComponent from '../components/FooterComponent'; // Import FooterComponent
import '../assets/css/Login.css';
import { useNavigate } from 'react-router-dom';

const { TabPane } = Tabs;

const LoginComponent = () => {

    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('1');

    const handleTabChange = (key) => {
        setActiveTab(key);
    };

    useEffect(() => {
        if (sessionStorage.getItem('user')) {
            navigate('/dashboard');
        }
    }, [navigate]);

    return (
        <div className="page-container">
            <ParticlesComponent />
            <div className="login-container">
                <div className="login-content">
                    <div className="login-header">
                        <img src="./images/logo.png" alt="Unimo Logo" className="login-logo" />
                        <p className="login-subtitle">Access real-time updates on faculty facilities from wherever you're at.<br />Run by students for students.</p>
                    </div>
                    <div className="login-form-container">
                        <Tabs activeKey={activeTab} onChange={handleTabChange} centered>
                            <TabPane tab="Login" key="1">
                                <div className="tab-content">
                                    <LoginForm />
                                </div>
                            </TabPane>
                            <TabPane tab="Sign Up" key="2">
                                <div className="tab-content">
                                    <RegistrationComponent onSwitchToLogin={() => setActiveTab('1')} />
                                </div>
                            </TabPane>
                        </Tabs>
                    </div>
                </div>
            </div>
            <FooterComponent /> {/* Add FooterComponent here */}
        </div>
    );
};

export default LoginComponent;
