import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { message as antdMessage } from 'antd'; // Import Ant Design's message component

const VerifyEmail = () => {
    const [isVerified, setIsVerified] = useState(false);
    const navigate = useNavigate();
    const token = new URLSearchParams(window.location.search).get('token');
    const hasNotified = useRef(false); // Ref to track if a notification has already been shown

    useEffect(() => {
        if (token && !hasNotified.current) {
            axios.get(`${import.meta.env.VITE_BASE_URL}/api/auth/verify-email`, {
                params: { token }
            })
                .then(response => {
                    antdMessage.success('Email verified successfully! Redirecting...');
                    setIsVerified(true);
                    hasNotified.current = true; // Mark as notified
                    setTimeout(() => navigate('/'), 3000);
                })
                .catch(error => {
                    if (!isVerified && !hasNotified.current) { // Only set error if not already verified and hasn't been notified
                        antdMessage.error('Verification failed. Please try again.');
                        hasNotified.current = true; // Mark as notified
                    }
                });
        } else if (!token && !hasNotified.current) {
            antdMessage.error('Invalid verification link.');
            hasNotified.current = true; // Mark as notified
        }
    }, [token, navigate, isVerified]);

    return (
        <div>
            <h2>{isVerified ? 'Verification Successful' : 'Verification Unsuccessful'}</h2>
        </div>
    );
};

export default VerifyEmail;
