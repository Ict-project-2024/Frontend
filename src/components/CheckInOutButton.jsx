import React from 'react';
import { Button } from 'antd';
import { SwapRightOutlined } from '@ant-design/icons';

const CheckInOutButton = ({ handleCheckInOut, scanComplete, actionType }) => {
  return (
    <Button
      className="check-in-button"
      type="primary"
      onClick={handleCheckInOut}
      disabled={!scanComplete} // Enable button only after scan is complete
      style={{
        backgroundColor: scanComplete 
          ? (actionType === 'checkin' ? 'green' : 'red') 
          : '#f5f5f5', // Disabled background color
        borderColor: scanComplete 
          ? (actionType === 'checkin' ? 'green' : 'red') 
          : '#ddd', // Disabled border color
        color: scanComplete ? 'white' : '#ccc', // Disabled text color
        cursor: scanComplete ? 'pointer' : 'not-allowed', // Change cursor based on the state
      }}
      icon={<SwapRightOutlined style={{ color: scanComplete ? 'white' : '#ccc' }} />} // Adjust icon color based on state
    >
      {actionType === 'checkin' ? 'Check in' : 'Check out'}
    </Button>
  );
};

export default CheckInOutButton;
