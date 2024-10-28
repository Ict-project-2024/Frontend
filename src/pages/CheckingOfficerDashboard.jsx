import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Modal, message } from 'antd';
import { SwapRightOutlined, InfoCircleOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import BarcodeScanner from '../components/BarcodeScanner'; // Adjust the path as needed
import '../assets/css/CheckingOfficerDashboard.css'; // Ensure you have the correct path
import newApiRequest from '../utils/apiRequests';

const CheckingOfficerDashboard = ({ role }) => {
  const [scanning, setScanning] = useState(false);
  const [actionType, setActionType] = useState(null);
  const [doctorAvailable, setDoctorAvailable] = useState(true);
  const [isConfirmVisible, setIsConfirmVisible] = useState(false);
  const [pendingAvailability, setPendingAvailability] = useState(null);
  const [checkedUser, setCheckedUser] = useState({})

  const handleCheckIn = () => {
    setScanning(true);
    setActionType('checkin');
  };

  const handleCheckOut = () => {
    setScanning(true);
    setActionType('checkout');
  };

  const handleScan = data => {

    const teRegex = /^TE\d{6}$/i;

    if (data && teRegex.test(data)) {
      newApiRequest(`/api/user/`, 'POST', {
        teNumber: data,
      }).then(response => {
        if (response) {
          setCheckedUser({
            teNumber: data,
            phoneNumber: response.mobileNumber,
          });
        } else {
          setCheckedUser({
            teNumber: data,
          });
          message.error("User could not be found");
          // Hence, user not found in the database, his phone number should be obtained: nivindulakshitha
          // UI/UX development is needed to be done: nivindulakshitha
        }
      });
      setScanning(false);
    } else {
      setScanning(false);
      message.error('Invalid QR code');
    }
  };

  useEffect(() => {
    if (!checkedUser || !Object.hasOwn(checkedUser, 'phoneNumber')) return;
    
    let url;
    if (role === 'CheckingOfficer-medicalCenter') {
      url = `/api/medical-center/enter`;
    } else if (role === 'CheckingOfficer-library') {
      url = `/api/library/enter`;
    } else {
      console.error('Unknown role, cannot determine URL');
      return; // Exit the function if the role is not recognized
    }

    newApiRequest(url, 'POST', checkedUser).then(response => {
      if (response && response.success) {
        message.success('Check-in logging successful');
      } else {
        message.error('Check-in logging failed');
      }
    }).catch(error => {
      console.error('Error fetching data:', error.message);
      message.error('Check-in logging failed');
    })

  }, [checkedUser]);

  const handleCancel = () => {
    setScanning(false);
    setActionType(null);
  };

  const showConfirmModal = (status) => {
    setPendingAvailability(status);
    setIsConfirmVisible(true);
  };

  const handleConfirm = () => {
    setDoctorAvailable(pendingAvailability);
    setIsConfirmVisible(false);
  };

  const handleCancelConfirm = () => {
    setPendingAvailability(null);
    setIsConfirmVisible(false);
  };

  return (
    <div className="checking-officer-dashboard">
      {role === 'CheckingOfficer-medicalCenter' && !scanning && (
        <div className="doctor-availability-container">
          <span className="doctor-availability-label">Doctor availability:</span>
          <div className="doctor-availability">
            <Button
              className={`ant-btn ${doctorAvailable ? 'ant-btn-available' : 'ant-btn-unavailable'}`}
              onClick={() => showConfirmModal(true)}
              icon={<InfoCircleOutlined />}
              style={{ backgroundColor: doctorAvailable ? '#72c140' : 'white', color: doctorAvailable ? 'white' : 'black' }}
            >
              Available
            </Button>
            <Button
              className={`ant-btn ${!doctorAvailable ? 'ant-btn-unavailable' : 'ant-btn-available'}`}
              onClick={() => showConfirmModal(false)}
              icon={<InfoCircleOutlined />}
              style={{ backgroundColor: !doctorAvailable ? '#F5222D' : 'white', color: !doctorAvailable ? 'white' : 'black' }}
            >
              Unavailable
            </Button>
          </div>
        </div>
      )}

      <Modal
        title={null}
        visible={isConfirmVisible}
        onOk={handleConfirm}
        onCancel={handleCancelConfirm}
        centered // This ensures the modal opens in the center of the screen
        footer={
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Button key="back" onClick={handleCancelConfirm} style={{ marginLeft: '10px', marginTop: '5px' }}>
              Cancel
            </Button>
            <Button key="submit" type="primary" onClick={/* handleConfirm */ () => { handleScan("TE104818") }} style={{ marginLeft: '10px', marginTop: '5px' }}>
              Confirm
            </Button>
          </div>
        }
      >
        <div style={{ textAlign: 'center' }}>
          <ExclamationCircleOutlined style={{ fontSize: '48px', color: '#faad14' }} />
          <h2>Please confirm again</h2>
          <p>Your action will update the entire system. Be responsible and reconfirm.</p>
        </div>
      </Modal>


      {!scanning ? (
        <div className="options">
          <Button
            className="check-button"
            type="primary"
            icon={<SwapRightOutlined />}
            onClick={handleCheckIn}
            style={{ backgroundColor: '#52C41A', borderColor: 'green' }}
            size="large"
          >
            Check in
          </Button>
          <Button
            className="check-button"
            type="primary"
            icon={<SwapRightOutlined />}
            onClick={handleCheckOut}
            style={{ backgroundColor: '#F5222D', borderColor: '#F5222D' }}
            size="large"
          >
            Check out
          </Button>
        </div>
      ) : (
        <BarcodeScanner onScan={handleScan} onCancel={handleCancel} actionType={actionType} />
      )}
    </div>
  );
};

CheckingOfficerDashboard.propTypes = {
  role: PropTypes.string.isRequired,
};

export default CheckingOfficerDashboard;
