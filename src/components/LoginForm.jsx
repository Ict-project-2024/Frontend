import React from 'react';
import { Input, Button, Checkbox } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import '../assets/css/LoginForm.css';

const LoginForm = () => {
    return (
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
    );
};

export default LoginForm;
