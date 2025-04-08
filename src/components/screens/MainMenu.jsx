import React from 'react';
import { Settings, Award, HelpCircle, Info } from 'lucide-react';
import Button from '../ui/Button';

const MainMenu = ({ 
  startGame, 
  setGameScreen, 
  gameMode, 
  setGameMode, 
  difficulty, 
  setDifficulty,
  gameModeSettings
}) => {
  return (
    <div className="h-screen flex flex-col items-center justify-center bg-teal-600 p-4">
      {/* Game Logo/Title */}
      <div className="mb-12 text-center">
        <h1 className="text-7xl font-bold text-white mb-2">PORTFOLIO</h1>
        <h1 className="text-7xl font-bold text-yellow-400 mb-4">PANIC!</h1>
        <p className="text-white text-lg">Master the markets, beat the chaos!</p>
      </div>
      
      {/* Main Action Buttons */}
      <div className="flex flex-col space-y-4 w-full max-w-md mb-8">
        <button 
          onClick={startGame}
          className="bg-gray-800 text-white py-6 px-8 rounded-lg text-3xl font-bold hover:bg-gray-700 transform transition hover:-translate-y-1"
        >
          START GAME
        </button>
        
        <button 
          onClick={() => setGameScreen('instructions')}
          className="bg-gray-800 text-white py-4 px-8 rounded-lg text-xl font-bold hover:bg-gray-700 transform transition hover:-translate-y-1"
        >
          INSTRUCTIONS
        </button>
        
        <button 
          onClick={() => setGameScreen('assetInfo')}
          className="bg-gray-800 text-white py-4 px-8 rounded-lg text-xl font-bold hover:bg-gray-700 transform transition hover:-translate-y-1"
        >
          ASSET INFO
        </button>
      </div>
      
      {/* Game Settings */}
      <div className="w-full max-w-md bg-gray-800 rounded-lg p-6 mb-8">
        <h2 className="text-white text-xl font-bold mb-4">Game Settings</h2>
        
        <div className="flex justify-between mb-4">
          <div className="w-1/2 pr-2">
            <p className="text-white mb-2 font-bold">Difficulty:</p>
            <select 
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="w-full p-3 bg-gray-700 text-white rounded-lg border border-gray-600"
            >
              <option value="easy">Easy</option>
              <option value="normal">Normal</option>
              <option value="hard">Hard</option>
            </select>
          </div>
          <div className="w-1/2 pl-2">
            <p className="text-white mb-2 font-bold">Game Mode:</p>
            <select 
              value={gameMode}
              onChange={(e) => setGameMode(e.target.value)}
              className="w-full p-3 bg-gray-700 text-white rounded-lg border border-gray-600"
            >
              <option value="standard">Standard</option>
              <option value="crisis">Financial Crisis</option>
              <option value="challenge">Bull Run Challenge</option>
            </select>
          </div>
        </div>
        
        {/* Game Mode Description */}
        <div className="bg-gray-700 p-3 rounded-lg">
          <h3 className="text-yellow-400 font-bold mb-1">{gameModeSettings[gameMode].name}</h3>
          <p className="text-white text-sm">{gameModeSettings[gameMode].description}</p>
        </div>
      </div>
      
      {/* Bottom Menu Icons */}
      <div className="flex space-x-4">
        <button 
          onClick={() => setGameScreen('settings')}
          className="bg-gray-700 text-white p-3 rounded-lg hover:bg-gray-600 transition"
          aria-label="Settings"
        >
          <Settings size={24} />
        </button>
        <button 
          onClick={() => setGameScreen('achievements')}
          className="bg-gray-700 text-white p-3 rounded-lg hover:bg-gray-600 transition"
          aria-label="Achievements"
        >
          <Award size={24} />
        </button>
        <a 
          href="https://github.com/your-username/portfolio-panic"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-gray-700 text-white p-3 rounded-lg hover:bg-gray-600 transition"
          aria-label="About"
        >
          <Info size={24} />
        </a>
      </div>
    </div>
  );
};

export default MainMenu;