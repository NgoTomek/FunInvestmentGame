import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-[#0A1629] text-white flex flex-col items-center justify-center p-4">
      <div className="max-w-md text-center">
        <div className="mb-6 flex justify-center">
          <AlertTriangle size={64} className="text-[#FF6B00]" />
        </div>
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <p className="text-xl text-[#A3B1C6] mb-8">
          Oops! The page you're looking for has been lost in the market crash.
        </p>
        <Link to="/">
          <Button 
            className="bg-[#FF6B00] hover:bg-[#FF8A33] px-8"
          >
            Return to Main Menu
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;