import React from 'react';
import { Settings, Award, HelpCircle, Info, Play, Cpu, BookOpen, AlertTriangle } from 'lucide-react';

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
    <div className="h-screen flex flex-col items-center justify-center bg-gradient-to-b from-teal-600 to-teal-800 p-4">
      {/* Game Logo/Title */}
      <div className="mb-12 text-center">
        <div className="relative inline-block mb-4">
          <h1 className="text-6xl sm:text-7xl md:text-8xl font-black text-white mb-2 drop-shadow-lg">PORTFOLIO</h1>
          <h1 className="text-6xl sm:text-7xl md:text-8xl font-black text-yellow-400 drop-shadow-lg">PANIC!</h1>
          <div className="absolute -top-4 -right-4 animate-pulse">
            <AlertTriangle size={40} className="text-yellow-400" />
          </div>
        </div>
        <p className="text-white text-lg">Master the markets, beat the chaos!</p>
      </div>
      
      {/* Main Action Buttons */}
      <div className="flex flex-col space-y-4 w-full max-w-md mb-8">
        <button 
          onClick={startGame}
          className="bg-gradient-to-r from-green-600 to-green-800 text-white py-6 px-8 rounded-lg text-3xl font-bold hover:from-green-500 hover:to-green-700 transform transition hover:-translate-y-1 shadow-lg flex items-center justify-center"
        >
          <Play size={28} className="mr-3" />
          START GAME
        </button>
        
        <div className="grid grid-cols-2 gap-3">
          <button 
            onClick={() => setGameScreen('instructions')}
            className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-4 px-8 rounded-lg text-xl font-bold hover:from-blue-500 hover:to-blue-700 transform transition hover:-translate-y-1 shadow-lg flex items-center justify-center"
          >
            <BookOpen size={20} className="mr-2" />
            INSTRUCTIONS
          </button>
          
          <button 
            onClick={() => setGameScreen('assetInfo')}
            className="bg-gradient-to-r from-purple-600 to-purple-800 text-white py-4 px-8 rounded-lg text-xl font-bold hover:from-purple-500 hover:to-purple-700 transform transition hover:-translate-y-1 shadow-lg flex items-center justify-center"
          >
            <Info size={20} className="mr-2" />
            ASSET INFO
          </button>
        </div>
      </div>
      
      {/* Game Settings Card */}
      <div className="w-full max-w-md bg-gray-800 rounded-lg p-6 mb-8 shadow-lg border border-gray-700">
        <h2 className="text-white text-xl font-bold mb-4 flex items-center">
          <Cpu size={20} className="mr-2 text-blue-400" />
          Game Settings
        </h2>
        
        <div className="flex justify-between mb-4">
          <div className="w-1/2 pr-2">
            <p className="text-white mb-2 font-bold">Difficulty:</p>
            <select 
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="w-full p-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
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
              className="w-full p-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
            >
              <option value="standard">Standard</option>
              <option value="crisis">Financial Crisis</option>
              <option value="challenge">Bull Run Challenge</option>
            </select>
          </div>
        </div>
        
        {/* Game Mode Description */}
        <div className="bg-gray-700 p-4 rounded-lg border-l-4 border-blue-500">
          <h3 className="text-yellow-400 font-bold mb-1">{gameModeSettings[gameMode].name}</h3>
          <p className="text-white text-sm">{gameModeSettings[gameMode].description}</p>
        </div>
      </div>
      
      {/* Bottom Menu Icons */}
      <div className="flex space-x-4">
        <button 
          onClick={() => setGameScreen('settings')}
          className="bg-gray-700 text-white p-3 rounded-lg hover:bg-gray-600 transition shadow hover:shadow-lg"
          aria-label="Settings"
        >
          <Settings size={24} />
        </button>
        <button 
          onClick={() => setGameScreen('achievements')}
          className="bg-gray-700 text-white p-3 rounded-lg hover:bg-gray-600 transition shadow hover:shadow-lg"
          aria-label="Achievements"
        >
          <Award size={24} />
        </button>
        <a 
          href="https://github.com/your-username/portfolio-panic"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-gray-700 text-white p-3 rounded-lg hover:bg-gray-600 transition shadow hover:shadow-lg"
          aria-label="About"
        >
          <Info size={24} />
        </a>
      </div>
      
      {/* Version */}
      <div className="mt-8 text-gray-300 text-xs">
        v0.1.0 - Ready for investment
      </div>
    </div>
  );
};

export default MainMenu;
