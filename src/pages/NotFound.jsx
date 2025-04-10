import React from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-600 to-teal-800 text-white flex flex-col items-center justify-center p-4">
      <div className="max-w-md text-center">
        <div className="mb-6 flex justify-center">
          <AlertTriangle size={64} className="text-yellow-400" />
        </div>
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <p className="text-xl text-gray-300 mb-8">
          Oops! The page you're looking for has been lost in the market crash.
        </p>
        <Link to="/">
          <button 
            className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-8 rounded-lg text-xl font-bold transition transform hover:-translate-y-1"
          >
            Return to Main Menu
          </button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
