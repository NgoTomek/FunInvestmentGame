import React from 'react';
import { ArrowLeft, Volume2, Music, MoonStar, Sun, Save, Trash2 } from 'lucide-react';
import { clearGameState } from '../../utils/localStorage';

const SettingsScreen = ({ settings, toggleSetting, setGameScreen }) => {
  // Handle reset game data
  const handleResetData = () => {
    if (window.confirm('Are you sure you want to reset all game data? This will clear your achievements and high scores.')) {
      clearGameState();
      window.location.reload(); // Reload to apply changes
    }
  };
  
  // Toggle switch component
  const ToggleSwitch = ({ isOn, onToggle, label, icon }) => (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center">
        {icon}
        <span className="ml-3 text-lg">{label}</span>
      </div>
      <button 
        onClick={onToggle}
        className={`relative w-14 h-7 rounded-full transition-all duration-300 focus:outline-none ${
          isOn ? 'bg-green-500' : 'bg-gray-600'
        }`}
      >
        <div className={`absolute w-5 h-5 bg-white rounded-full transition-transform duration-300 transform ${
          isOn ? 'translate-x-8' : 'translate-x-1'
        } top-1`}></div>
      </button>
    </div>
  );

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-teal-600 p-4">
      <div className="bg-gray-800 text-white p-8 rounded-lg w-full max-w-md mb-8">
        <div className="flex items-center mb-8">
          <button 
            onClick={() => setGameScreen('menu')}
            className="bg-gray-700 text-white p-2 rounded-lg mr-3 hover:bg-gray-600"
          >
            <ArrowLeft size={20} />
          </button>
          <h2 className="text-4xl font-bold text-center flex-1">SETTINGS</h2>
        </div>
        
        {/* Sound Effect Toggle */}
        <ToggleSwitch
          isOn={settings.sound}
          onToggle={() => toggleSetting('sound')}
          label="Sound Effects"
          icon={<Volume2 size={24} className="text-gray-400" />}
        />
        
        {/* Music Toggle */}
        <ToggleSwitch
          isOn={settings.music}
          onToggle={() => toggleSetting('music')}
          label="Background Music"
          icon={<Music size={24} className="text-gray-400" />}
        />
        
        {/* Dark Mode Toggle */}
        <ToggleSwitch
          isOn={settings.darkMode}
          onToggle={() => toggleSetting('darkMode')}
          label="Dark Mode"
          icon={settings.darkMode ? 
            <MoonStar size={24} className="text-gray-400" /> : 
            <Sun size={24} className="text-gray-400" />
          }
        />
        
        {/* Save Progress Toggle */}
        <ToggleSwitch
          isOn={settings.saveProgress}
          onToggle={() => toggleSetting('saveProgress')}
          label="Save Progress"
          icon={<Save size={24} className="text-gray-400" />}
        />
        
        {/* Reset Data */}
        <div className="mt-8 pt-6 border-t border-gray-700">
          <button
            onClick={handleResetData}
            className="w-full flex items-center justify-center py-3 px-4 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold transition"
          >
            <Trash2 size={20} className="mr-2" />
            Reset Game Data
          </button>
          <p className="text-xs text-gray-400 mt-2 text-center">
            This will clear all achievements, settings, and game progress.
          </p>
        </div>
      </div>
      
      <button 
        onClick={() => setGameScreen('menu')}
        className="bg-gray-800 text-white py-3 px-8 rounded-lg text-xl font-bold hover:bg-gray-700 transition transform hover:-translate-y-1"
      >
        SAVE SETTINGS
      </button>
    </div>
  );
};

export default SettingsScreen;