import React from 'react';
import { Link } from 'react-router-dom';
import { Play, Book, Settings, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';

const MainMenu = () => {
  return (
    <div className="bg-[#0A1629] min-h-screen flex flex-col items-center justify-center text-white p-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-5xl font-bold mb-2 tracking-tight">PORTFOLIO PANIC</h1>
          <p className="text-[#A3B1C6] mb-8">Master the markets before time runs out!</p>
        </div>
        
        <div className="space-y-4">
          <Link to="/dashboard" className="w-full block">
            <Button 
              className="w-full py-6 text-lg bg-[#FF6B00] hover:bg-[#FF8A33]"
            >
              <Play className="mr-2" size={24} />
              Play Now
            </Button>
          </Link>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
            <Link to="/instructions" className="block">
              <Button 
                variant="outline" 
                className="w-full bg-[#132237] border-[#1A2B45] text-white hover:bg-[#1A2B45]"
              >
                <Book className="mr-2" size={16} />
                How to Play
              </Button>
            </Link>
            
            <Link to="/settings" className="block">
              <Button 
                variant="outline" 
                className="w-full bg-[#132237] border-[#1A2B45] text-white hover:bg-[#1A2B45]"
              >
                <Settings className="mr-2" size={16} />
                Settings
              </Button>
            </Link>
            
            <Link to="/achievements" className="block">
              <Button 
                variant="outline" 
                className="w-full bg-[#132237] border-[#1A2B45] text-white hover:bg-[#1A2B45]"
              >
                <Trophy className="mr-2" size={16} />
                Achievements
              </Button>
            </Link>
          </div>
        </div>
        
        <div className="pt-8 text-center text-[#A3B1C6] text-sm">
          <p>Version 1.0.0</p>
        </div>
      </div>
    </div>
  );
};

export default MainMenu;