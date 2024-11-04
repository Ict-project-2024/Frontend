/* eslint-disable react/prop-types */
import React, { useState, useEffect, useRef } from 'react';
import { Card, Spin, Button, message, Avatar } from 'antd';
import Quagga from 'quagga';
import CheckInSuccess from './CheckInSuccess'; // Import the new success screen component
import CheckInOutButton from './CheckInOutButton'; // Import the customized button component
import '../assets/css/BarcodeScanner.css';
import newApiRequest from '../utils/apiRequests';
import { useAuth } from '../context/AuthContext';

const BarcodeScanner = ({ onCancel, actionType }) => {
	const [scanning, setScanning] = useState(true); // Start scanning by default
	const [scanComplete, setScanComplete] = useState(false); // Track if scanning is complete
	const [scanResult, setScanResult] = useState(null); // Store the scanned result
	const [scanTime, setScanTime] = useState(null); // Store the scan time
	const [showSuccessScreen, setShowSuccessScreen] = useState(false); // New state to manage success screen
	const [checkInOutUser, setcheckInOutUser] = useState(null);
	const scannerRef = useRef(null);
	const quaggaInitialized = useRef(false);
	const [checkedUser, setCheckedUser] = useState({})
	const { user } = useAuth();


	useEffect(() => {
    if (scannerRef.current) {
        startScanner();
    }
    return () => stopScanner();
}, [scannerRef]);

	useEffect(() => {
		const teRegex = /^\d{6}$/;

		if (scanResult && teRegex.test(scanResult)) {
			newApiRequest(`/api/user/`, 'POST', {
				teNumber: `TE${scanResult}`,
			}).then(response => {
				if (response) {
					setcheckInOutUser(response);
				} else {
					message.error(`TE${scanResult} could not be found`);
				}
			});
		}
	}, [scanResult]);

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
						width: { ideal: 640 }, // Higher resolution for better accuracy
						height: { ideal: 640 }, // Higher resolution for better accuracy
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
				console.log("Quagga initialized successfully");
			}
		);

		Quagga.onDetected(handleDetected);
	};

	const stopScanner = () => {
		try {
			Quagga.stop();
		} catch (error) {
			console.log(error)
		}
	};

	const handleDetected = (result) => {
		const currentDateTime = new Date();
		setScanning(false);
		setScanComplete(true);
		setScanResult(result.codeResult.code); // Store the result
		//setScanResult(107802); // Hard code for testing
		setScanTime(currentDateTime); // Store the current date and time
		stopScanner(); // Pause the camera immediately
	};

	const handleCheckInOut = () => {
		if (scanResult) {
			const teRegex = /^\d{6}$/;

			if (scanResult && teRegex.test(scanResult)) {
				newApiRequest(`/api/user/`, 'POST', {
					teNumber: `TE${scanResult}`,
				}).then(response => {
					if (response) {
						setCheckedUser({
							teNumber: `TE${scanResult}`,
							phoneNumber: response.mobileNumber,
						});
					} else {
						setCheckedUser({
							teNumber: `TE${scanResult}`,
						});
						message.error(`TE${scanResult} could not be found`);
					}
				});
				setScanning(false);
			} else {
				setScanning(false);
				message.error('Invalid TE number. Rescan the barcode');
			}
		}
	};

	useEffect(() => {
		if (!checkedUser || !Object.hasOwn(checkedUser, 'phoneNumber')) return;

		let url;
		if (user.roles[0].role === 'CheckingOfficer-medicalCenter') {
			if (actionType === 'checkin') {
				url = `/api/medical-center/enter`; 
			} else {
				url = `/api/medical-center/exit`;
			}
		} else if (user.roles[0].role === 'CheckingOfficer-library') {
			if (actionType === 'checkin') {
				url = `/api/library/enter`;
			} else {
				url = `/api/library/exit`;
			}
		} else {
			console.error('Unknown role, cannot determine URL');
			message.error('Unknown role, cannot determine URL');
			return; // Exit the function if the role is not recognized
		}

		console.log('URL:', url);

		newApiRequest(url, 'POST', checkedUser).then(response => {
			if (response && response.success) {
				message.success(`Student ${actionType === 'checkin' ? 'checked in' : 'checked out'} successfully`);
				setShowSuccessScreen(true);
			} else {
				message.error('Check-in logging failed');
			}
		}).catch(error => {
			console.error('Error fetching data:', error.message);
			message.error('Check-in logging failed');
		})

	}, [checkedUser]);

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
		return <CheckInSuccess onBackToHome={handleBackToHome} actionType={actionType} TeNumber={scanResult ? "TE" + scanResult : ""} />;
	}

	return (
		<div className="barcode-scanner-container">
			<Card className="scanning-card" bordered={false}>
				<div className={`card-content ${scanning ? '' : 'detach'}`}>
					<div className={`camera-container`} ref={scannerRef} />
					<div className="scanning-status">
						{scanning ? (
							<>
								<Spin size="small" style={{ marginRight: '8px' }} />
								<span>Scanning...</span>
							</>
						) : (<></>)}
					</div>
				</div>
				<div className="scan-result">
					{scanResult && scanTime && (
						<div className="result-display">
							<div className="checkinout-avatar">
								<Avatar src={checkInOutUser ? checkInOutUser.profileImage : '...'} style={{ width: 60, height: 60, border: `${actionType === 'checkin' ? '3px solid #52c41a' : '3px solid #f5222d'}` }} className="checkinout-avatar" />
							</div>
							<div className="scan-details">
								<p><strong>Reg. No:</strong> {`TE${scanResult}`}</p>
								<p><strong>Name:</strong> { checkInOutUser ? `${checkInOutUser.firstName} ${checkInOutUser.lastName}` : '...' }</p>
								<p><strong>Mobile:</strong> {checkInOutUser ? checkInOutUser.mobileNumber : '...'} </p>
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
