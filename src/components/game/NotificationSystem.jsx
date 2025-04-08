import React from 'react';
import { AlertCircle, Check, Info, Award } from 'lucide-react';

const NotificationSystem = ({ notifications }) => {
  // Get icon for notification type
  const getNotificationIcon = (type) => {
    switch(type) {
      case 'success':
        return <Check className="mr-2" size={16} />;
      case 'error':
        return <AlertCircle className="mr-2" size={16} />;
      case 'achievement':
        return <Award className="mr-2" size={16} />;
      case 'info':
      default:
        return <Info className="mr-2" size={16} />;
    }
  };
  
  // Get background color based on notification type
  const getNotificationColor = (type) => {
    switch(type) {
      case 'success':
        return 'bg-green-600';
      case 'error':
        return 'bg-red-600';
      case 'achievement':
        return 'bg-yellow-600';
      case 'info':
      default:
        return 'bg-blue-600';
    }
  };
  
  return (
    <div className="fixed bottom-4 right-4 space-y-2 max-w-xs z-20">
      {notifications.map(notification => (
        <div 
          key={notification.id}
          className={`${getNotificationColor(notification.type)} p-3 rounded-lg shadow-lg text-white animate-fade-in flex items-center`}
        >
          {getNotificationIcon(notification.type)}
          <div>{notification.message}</div>
        </div>
      ))}
    </div>
  );
};

export default NotificationSystem;