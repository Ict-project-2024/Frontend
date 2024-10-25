import React, { useState } from 'react';
import { Input, Button, Checkbox, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../assets/css/LoginForm.css';

const LoginForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_BASE_URL}/api/auth/login`,
                {
                    email,
                    password,
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );
    
            console.log('Login Response:', response.data);
    
            // Handle successful login
            if (response.status === 200 && response.data.success) {
                navigate('/dashboard', { state: response.data });
            } else {
                // Handle various error messages from the backend
                if (response.data.message) {
                    message.error(response.data.message);
                } else {
                    console.log('Unexpected response:', response.data);
                    message.error('Failed to login. Please try again.');
                }
            }
        } catch (error) {
            console.error('Login error:', error);
    
            // Specific error handling based on the error response
            if (error.response) {
                // Backend response with error
                if (error.response.status === 401) {
                    message.error('Invalid username or password');
                } else if (error.response.status === 403) {
                    message.error('Email not verified. Please check your email to verify your account.');
                } else {
                    message.error('Failed to login. Please try again.');
                }
            } else {
                // Network error or other issue
                message.error('An error occurred. Please check your internet connection and try again.');
            }
        }
    };
    
    

    return (
        <div className="login-form">
            <Input
                size="large"
                placeholder="Email"
                prefix={<UserOutlined />}
                className="login-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <Input.Password
                size="large"
                placeholder="Password"
                prefix={<LockOutlined />}
                className="login-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <div className="login-options">
                <Checkbox>Remember email</Checkbox>
                <a href="#" className="forgot-password-link">Forgot Password</a>
            </div>
            <Button
                type="primary"
                size="large"
                className="login-button"
                onClick={handleLogin}
            >
                Login
            </Button>
        </div>
    );
};

export default LoginForm;
