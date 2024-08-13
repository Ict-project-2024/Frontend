import React, { useState } from 'react';
import { Button } from 'antd';
import { SwapRightOutlined } from '@ant-design/icons';
import BarcodeScanner from '../components/BarcodeScanner'; // Adjust the path as needed
import '../assets/css/CheckingOfficerDashboard.css'; // Ensure you have the correct path

const CheckingOfficerDashboard = () => {
  const [scanning, setScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [actionType, setActionType] = useState(null);

  const handleCheckIn = () => {
    setScanning(true);
    setActionType('checkin');
  };

  const handleCheckOut = () => {
    setScanning(true);
    setActionType('checkout');
  };

  const handleScan = data => {
    setScanResult(data);
    setScanning(false);
    // Handle the scanned data (e.g., send to server or display to user)
    console.log('Scanned data:', data);
  };

  const handleCancel = () => {
    setScanning(false);
    setActionType(null); // Reset action type on cancel
  };

  return (
    <div className="checking-officer-dashboard">
      {!scanning ? (
        <div className="options">
          <Button
            className="check-button"
            type="primary"
            icon={<SwapRightOutlined />}
            onClick={handleCheckIn}
            style={{ backgroundColor: 'green', borderColor: 'green' }}
            size="large"
          >
            Check in
          </Button>
          <Button
            className="check-button"
            type="primary"
            icon={<SwapRightOutlined />}
            onClick={handleCheckOut}
            style={{ backgroundColor: 'red', borderColor: 'red' }}
            size="large"
          >
            Check out
          </Button>
        </div>
      ) : (
        <BarcodeScanner onScan={handleScan} onCancel={handleCancel} actionType={actionType} />
      )}
      {scanResult && <p>Scan Result: {scanResult}</p>}
    </div>
  );
};

export default CheckingOfficerDashboard;
