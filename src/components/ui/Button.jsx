import React from 'react';

const Button = ({ onClick, color, label, disabled, tooltip }) => {
  // Define color classes
  const colorClasses = {
    blue: 'bg-blue-600 hover:bg-blue-700',
    green: 'bg-green-600 hover:bg-green-700',
    red: 'bg-red-600 hover:bg-red-700',
    yellow: 'bg-yellow-600 hover:bg-yellow-700',
    gray: 'bg-gray-600 hover:bg-gray-700'
  };
  
  const className = `${colorClasses[color] || colorClasses.blue} text-white py-2 px-4 rounded-lg font-bold transition duration-200 ${disabled ? 'opacity-50 cursor-not-allowed' : 'transform hover:-translate-y-1'}`
  
  if (tooltip) {
    return (
      <div className="relative group">
        <button 
          onClick={disabled ? null : onClick}
          className={className}
          disabled={disabled}
        >
          {label}
        </button>
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
          {tooltip}
        </div>
      </div>
    );
  }
  
  return (
    <button 
      onClick={disabled ? null : onClick}
      className={className}
      disabled={disabled}
    >
      {label}
    </button>
  );
};

export default Button;