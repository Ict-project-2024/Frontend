import React from 'react';
import { Modal, Button, Typography } from 'antd';
import { CheckCircleOutlined } from '@ant-design/icons';
import '../assets/css/RegistrationSuccessPopup.css';

const { Title, Text } = Typography;

const RegistrationSuccessPopup = ({ isVisible, onClose }) => {
  return (
    <Modal
      visible={isVisible}
      onCancel={onClose}
      footer={[
        <Button key="ok" type="primary" onClick={onClose} className="noted-button">
          Noted
        </Button>
      ]}
      className="registration-success-modal"
    >
      <div className="modal-content">
        <div className="icon-text-container">
          <CheckCircleOutlined className="success-icon" />
          <Title level={3} className="modal-title">You're registered!</Title>
        </div>
        <Text className="modal-text">
          Your verification link has been sent to your inbox. Please check your inbox and click that link to get verified and proceed.
        </Text>
      </div>
    </Modal>
  );
};

export default RegistrationSuccessPopup;
