import React, { useState, useEffect, useRef } from 'react';
import { Card, Spin, Button } from 'antd';
import Quagga from 'quagga';
import CheckInSuccess from './CheckInSuccess'; // Import the new success screen component
import CheckInOutButton from './CheckInOutButton'; // Import the customized button component
import '../assets/css/BarcodeScanner.css';

const BarcodeScanner = ({ onCancel, actionType }) => {
  const [scanning, setScanning] = useState(true); // Start scanning by default
  const [scanComplete, setScanComplete] = useState(false); // Track if scanning is complete
  const [scanResult, setScanResult] = useState(null); // Store the scanned result
  const [scanTime, setScanTime] = useState(null); // Store the scan time
  const [showSuccessScreen, setShowSuccessScreen] = useState(false); // New state to manage success screen
  const scannerRef = useRef(null);
  const quaggaInitialized = useRef(false);

  useEffect(() => {
    startScanner();

    return () => {
      stopScanner();
    };
  }, []);

  const startScanner = () => {
    if (quaggaInitialized.current) {
      Quagga.start();
      return;
    }

    Quagga.init(
      {
        inputStream: {
          type: 'LiveStream',
          constraints: {
            facingMode: 'environment', // Ensure rear camera is used on mobile
            width: { ideal: 1280 }, // Higher resolution for better accuracy
            height: { ideal: 720 }, // Higher resolution for better accuracy
          },
          target: scannerRef.current,
        },
        locator: {
          patchSize: 'large', // Larger patch size for better accuracy
          halfSample: false, // Full sampling for better accuracy
        },
        numOfWorkers: navigator.hardwareConcurrency || 4,
        frequency: 10,
        decoder: {
          readers: [
            'ean_reader',
            'ean_8_reader',
            'code_128_reader',
            'code_39_reader',
            'upc_reader',
            'upc_e_reader',
            'codabar_reader',
            'i2of5_reader',
          ],
        },
        locate: true,
      },
      (err) => {
        if (err) {
          console.error('Failed to initialize Quagga:', err);
          setScanning(false);
          return;
        }
        quaggaInitialized.current = true;
        Quagga.start();
      }
    );

    Quagga.onDetected(handleDetected);
  };

  const stopScanner = () => {
    if (quaggaInitialized.current) {
      Quagga.stop();
    }
  };

  const handleDetected = (result) => {
    const currentDateTime = new Date();
    setScanning(false);
    setScanComplete(true);
    setScanResult(result.codeResult.code); // Store the result
    setScanTime(currentDateTime); // Store the current date and time
    stopScanner(); // Pause the camera immediately
  };

  const handleCheckInOut = () => {
    if (scanResult) {
      // Display the success screen when check-in/check-out is completed
      setShowSuccessScreen(true);
    }
  };

  const handleCancelScan = () => {
    // Logic to handle the cancellation of scanning
    setScanning(false);
    setScanComplete(false);
    setScanResult(null);
    setScanTime(null);
    onCancel(); // Call the onCancel prop to handle navigation back to home
  };

  const handleBackToHome = () => {
    // Logic to go back to the home screen or reset the scanner
    setShowSuccessScreen(false);
    onCancel(); // Optional: Call the onCancel prop to handle navigation back to home
  };

  if (showSuccessScreen) {
    return <CheckInSuccess onBackToHome={handleBackToHome} actionType={actionType} />;
  }

  return (
    <div className="barcode-scanner-container">
      <Card className="scanning-card" bordered={false}>
        <div className="card-content">
          <div className="camera-container" ref={scannerRef} />
          <div className="scanning-status">
            {scanning ? (
              <>
                <Spin size="large" />
                <span>Scanning...</span>
              </>
            ) : (
              <span>Scan complete</span>
            )}
          </div>
        </div>
        <div className="scan-result">
          {scanResult && scanTime && (
            <div className="result-display">
              <div className="avatar">
                <img src="/images/avatar.png" alt="Avatar" />
              </div>
              <div className="scan-details">
                <p><strong>Reg. No:</strong> {`TE${scanResult}`}</p>
                <p><strong>Name:</strong> Monday</p> {/* Example name */}
                <p><strong>Time:</strong> {scanTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
              </div>
            </div>
          )}
        </div>
        <CheckInOutButton
          handleCheckInOut={handleCheckInOut}
          scanComplete={scanComplete}
          actionType={actionType}
        />
        <Button 
          className="cancel-button" 
          onClick={handleCancelScan} 
          type="default"
          style={{ marginTop: '10px' }}
        >
          Cancel
        </Button>
      </Card>
    </div>
  );
};

export default BarcodeScanner;
