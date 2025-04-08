import React from 'react';
import { ArrowLeft, Award, Lock, Check } from 'lucide-react';

const AchievementsScreen = ({ achievements, setGameScreen }) => {
  return (
    <div className="h-screen flex flex-col items-center justify-center bg-teal-600 p-4">
      <div className="bg-gray-800 text-white p-8 rounded-lg w-full max-w-2xl mb-8 overflow-y-auto max-h-[80vh]">
        <div className="flex items-center mb-6">
          <button 
            onClick={() => setGameScreen('menu')}
            className="bg-gray-700 text-white p-2 rounded-lg mr-3 hover:bg-gray-600"
          >
            <ArrowLeft size={20} />
          </button>
          <h2 className="text-4xl font-bold text-center flex-1">ACHIEVEMENTS</h2>
        </div>
        
        {/* Achievements count */}
        <div className="mb-6 text-center">
          <p className="text-xl">
            <span className="text-yellow-400 font-bold">
              {Object.values(achievements).filter(a => a.unlocked).length}
            </span> / <span className="text-gray-400">
              {Object.values(achievements).length}
            </span> Unlocked
          </p>
        </div>
        
        {/* Achievements grid */}
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
          {Object.entries(achievements).map(([id, achievement]) => (
            <div 
              key={id} 
              className={`p-4 rounded-lg ${achievement.unlocked ? 'bg-yellow-800 bg-opacity-30' : 'bg-gray-700'}`}
            >
              <div className="flex items-center mb-2">
                <div className={`p-2 rounded-full mr-3 ${achievement.unlocked ? 'bg-yellow-500' : 'bg-gray-600'}`}>
                  {achievement.unlocked ? (
                    <Award size={24} className="text-yellow-900" />
                  ) : (
                    <Lock size={24} className="text-gray-400" />
                  )}
                </div>
                <div>
                  <h3 className={`font-bold text-lg ${achievement.unlocked ? 'text-yellow-400' : 'text-gray-400'}`}>
                    {achievement.title}
                  </h3>
                  <p className="text-sm text-gray-400">{achievement.description}</p>
                </div>
                {achievement.unlocked && (
                  <div className="ml-auto">
                    <div className="bg-green-600 p-1 rounded-full">
                      <Check size={16} className="text-white" />
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <button 
        onClick={() => setGameScreen('menu')}
        className="bg-gray-800 text-white py-3 px-8 rounded-lg text-xl font-bold hover:bg-gray-700 transition transform hover:-translate-y-1"
      >
        BACK TO MENU
      </button>
    </div>
  );
};

export default AchievementsScreen;