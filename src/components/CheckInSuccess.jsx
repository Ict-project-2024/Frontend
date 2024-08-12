import React from 'react';
import { Button } from 'antd';
import '../assets/css/CheckInSuccess.css';

const CheckInSuccess = ({ onBackToHome, actionType }) => {
  const isCheckIn = actionType === 'checkin';

  return (
    <div className="success-container">
      <div className="success-icon">
        <div className="circle">
          <i className="checkmark">✓</i>
        </div>
      </div>
      <h2>Successfully marked as {isCheckIn ? 'check in' : 'check out'}</h2>
      <Button type="primary" onClick={onBackToHome}>
        Back to home
      </Button>
    </div>
  );
};

export default CheckInSuccess;
