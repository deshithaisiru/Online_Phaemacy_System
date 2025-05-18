import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import './CustomNotification.css';

const CustomNotification = ({ message, type, duration = 3000, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      if (onClose) onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return isVisible ? (
    <div className={`custom-notification ${type}`}>
      <div className="notification-content">
        {type === 'success' && <span className="notification-icon">✓</span>}
        {type === 'error' && <span className="notification-icon">✕</span>}
        {type === 'info' && <span className="notification-icon">ℹ</span>}
        {type === 'warning' && <span className="notification-icon">⚠</span>}
        <span className="notification-message">{message}</span>
      </div>
      <button className="notification-close" onClick={() => {
        setIsVisible(false);
        if (onClose) onClose();
      }}>×</button>
    </div>
  ) : null;
};
CustomNotification.propTypes = {
  message: PropTypes.string.isRequired,
  type: PropTypes.oneOf(['success', 'error', 'info', 'warning']).isRequired,
  duration: PropTypes.number,
  onClose: PropTypes.func
};

export default CustomNotification;

