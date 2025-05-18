import React, { createContext, useState, useContext } from 'react';
import PropTypes from 'prop-types';
import CustomNotification from './CustomNotification';

const NotificationContext = createContext();

export const useNotification = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const showNotification = (message, type = 'info', duration = 3000) => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, message, type, duration }]);
    return id;
  };

  const closeNotification = (id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  // Helper functions for different notification types
  const notifySuccess = (message, duration) => showNotification(message, 'success', duration);
  const notifyError = (message, duration) => showNotification(message, 'error', duration);
  const notifyInfo = (message, duration) => showNotification(message, 'info', duration);
  const notifyWarning = (message, duration) => showNotification(message, 'warning', duration);

  return (
    <NotificationContext.Provider 
      value={{ 
        showNotification, 
        closeNotification,
        notifySuccess,
        notifyError,
        notifyInfo,
        notifyWarning
      }}
    >
      {children}
      <div className="notifications-container">
        {notifications.map(notification => (
          <CustomNotification
            key={notification.id}
            message={notification.message}
            type={notification.type}
            duration={notification.duration}
            onClose={() => closeNotification(notification.id)}
          />
        ))}
      </div>
    </NotificationContext.Provider>
  );
};
NotificationProvider.propTypes = {
  children: PropTypes.node.isRequired
};

export default NotificationContext;
