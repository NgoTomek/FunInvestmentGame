import React from 'react';
import { AlertCircle, Check, Info, Award, X } from 'lucide-react';

const NotificationSystem = ({ notifications }) => {
  // Get icon for notification type
  const getNotificationIcon = (type) => {
    switch(type) {
      case 'success':
        return <Check className="mr-2" size={18} />;
      case 'error':
        return <AlertCircle className="mr-2" size={18} />;
      case 'achievement':
        return <Award className="mr-2" size={18} />;
      case 'info':
      default:
        return <Info className="mr-2" size={18} />;
    }
  };
  
  // Get background styles based on notification type
  const getNotificationStyles = (type) => {
    switch(type) {
      case 'success':
        return {
          bg: 'bg-gradient-to-r from-green-600 to-green-700',
          border: 'border-l-4 border-green-400',
          shadow: 'shadow-lg shadow-green-900/20'
        };
      case 'error':
        return {
          bg: 'bg-gradient-to-r from-red-600 to-red-700',
          border: 'border-l-4 border-red-400',
          shadow: 'shadow-lg shadow-red-900/20'
        };
      case 'achievement':
        return {
          bg: 'bg-gradient-to-r from-yellow-600 to-yellow-700',
          border: 'border-l-4 border-yellow-400',
          shadow: 'shadow-lg shadow-yellow-900/20'
        };
      case 'info':
      default:
        return {
          bg: 'bg-gradient-to-r from-blue-600 to-blue-700',
          border: 'border-l-4 border-blue-400',
          shadow: 'shadow-lg shadow-blue-900/20'
        };
    }
  };
  
  // Render an empty fragment if no notifications
  if (!notifications || notifications.length === 0) {
    return null;
  }
  
  return (
    <div className="fixed bottom-4 right-4 space-y-2 max-w-xs z-20">
      {notifications.map(notification => {
        const styles = getNotificationStyles(notification.type);
        
        return (
          <div 
            key={notification.id}
            className={`${styles.bg} ${styles.border} ${styles.shadow} p-3 rounded-lg text-white animate-slide-in flex items-center justify-between`}
          >
            <div className="flex items-center pr-2">
              {getNotificationIcon(notification.type)}
              <div className="text-sm">{notification.message}</div>
            </div>
            <button className="opacity-70 hover:opacity-100 ml-2">
              <X size={14} />
            </button>
          </div>
        );
      })}
    </div>
  );
};

// Add CSS for animations in your index.css:
// @keyframes slide-in {
//   0% { transform: translateX(100%); opacity: 0; }
//   100% { transform: translateX(0); opacity: 1; }
// }
// .animate-slide-in {
//   animation: slide-in 0.3s ease forwards;
// }

export default NotificationSystem;
