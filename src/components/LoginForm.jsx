import React, { useState } from 'react';
import { Input, Button, Checkbox, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../components/context/AuthContext';
import '../assets/css/LoginForm.css';

const LoginForm = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleLogin = () => {
        // Replace this with your actual authentication logic
        if (username === 'admin' && password === 'password') {
            login();
            navigate('/dashboard');
        } else {
            message.error('Invalid username or password');
        }
    };

    return (
        <div className="login-form">
            <Input
                size="large"
                placeholder="Email"
                prefix={<UserOutlined />}
                className="login-input"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
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
