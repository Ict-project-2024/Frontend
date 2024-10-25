import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const VerifyEmail = () => {
    const [message, setMessage] = useState('');
    const [isVerified, setIsVerified] = useState(false);
    const navigate = useNavigate();
    const token = new URLSearchParams(window.location.search).get('token');

    useEffect(() => {
        if (token) {
            axios.get(`${import.meta.env.VITE_BASE_URL}/api/auth/verify-email`, {
                params: { token }
            })
                .then(response => {
                    setMessage('Email verified successfully! Redirecting...');
                    setIsVerified(true);
                    setTimeout(() => navigate('/'), 3000);
                })
                .catch(error => {
                    if (!isVerified) { // Only set error if not already verified
                        setMessage('Verification failed. Please try again.');
                    }
                });
        } else {
            setMessage('Invalid verification link.');
        }
    }, [token, history]);

    return (
        <div>
            <h2>{message}</h2>
        </div>
    );
};

export default VerifyEmail;
