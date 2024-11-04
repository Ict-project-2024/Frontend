import React from 'react';
import { Button } from 'antd';
import '../assets/css/CheckInSuccess.css';

const CheckInSuccess = ({ onBackToHome, actionType, TeNumber }) => {
  const isCheckIn = actionType === 'checkin';

  return (
    <div className="success-container">
      <div className="success-icon">
        <div className="circle">
          <i className="checkmark">✓</i>
        </div>
      </div>
      <h2>Successfully marked as {isCheckIn ? 'checked in' : 'checked out'}</h2>
      <Button type="primary" onClick={onBackToHome} style={{padding: '20px 0px'}}>
        Back to home
      </Button>
    </div>
  );
};

export default CheckInSuccess;
