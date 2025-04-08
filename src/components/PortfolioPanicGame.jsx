import React, { useState, useEffect } from 'react';
import MainMenu from './screens/MainMenu';
import GameScreen from './screens/GameScreen';
import ResultsScreen from './screens/ResultsScreen';
import InstructionsScreen from './screens/InstructionsScreen';
import SettingsScreen from './screens/SettingsScreen';
import AchievementsScreen from './screens/AchievementsScreen';
import AssetInfoScreen from './screens/AssetInfoScreen';
import { loadGameState, saveGameState } from '../utils/localStorage';
import { DIFFICULTY_SETTINGS, GAME_MODE_SETTINGS, INITIAL_ASSET_PRICES } from '../utils/gameData';
import { calculatePortfolioValue } from '../utils/portfoliomanager';

const PortfolioPanicGame = () => {
  // Game state management
  const [gameScreen, setGameScreen] = useState('menu'); // menu, game, results, instructions, settings, assetInfo, achievements
  const [gameMode, setGameMode] = useState('standard'); // standard, crisis, challenge
  const [difficulty, setDifficulty] = useState('normal'); // easy, normal, hard
  
  // Portfolio state
  const [portfolio, setPortfolio] = useState({
    cash: 10000,
  });
  
  // Market state
  const [assetPrices, setAssetPrices] = useState({
    stocks: 120,
    oil: 65,
    gold: 1950,
    crypto: 29000
  });
  
  // New asset data structure for fractional investments and shorts
  const [assetData, setAssetData] = useState({
    quantities: {
      stocks: 0,
      oil: 0,
      gold: 0,
      crypto: 0
    },
    dollarValues: {
      stocks: 0,
      oil: 0,
      gold: 0,
      crypto: 0
    },
    shorts: {
      stocks: { value: 0, price: 0, active: false },
      oil: { value: 0, price: 0, active: false },
      gold: { value: 0, price: 0, active: false },
      crypto: { value: 0, price: 0, active: false }
    }
  });
  
  // Game progression
  const [timer, setTimer] = useState(60);
  const [paused, setPaused] = useState(false);
  const [round, setRound] = useState(1);
  const [totalRounds, setTotalRounds] = useState(5);
  
  // News system
  const [currentNews, setCurrentNews] = useState({
    message: "Market news will appear here...",
    impact: { stocks: 1.0, oil: 1.0, gold: 1.0, crypto: 1.0 }
  });
  
  // User settings
  const [settings, setSettings] = useState({
    sound: true,
    music: true,
    tutorialComplete: false,
    darkMode: true,
    saveProgress: true
  });
  
  // Game statistics
  const [gameStats, setGameStats] = useState({
    tradesExecuted: 0,
    profitableTrades: 0,
    biggestGain: 0,
    biggestLoss: 0,
    marketCrashesWeathered: 0
  });
  
  // Game results
  const [gameResult, setGameResult] = useState({
    finalValue: 0,
    returnPercentage: 0,
    bestAsset: "",
    worstAsset: ""
  });
  
  // Achievements
  const [achievements, setAchievements] = useState({
    firstProfit: { unlocked: false, title: "First Profit", description: "Make your first profitable trade" },
    riskTaker: { unlocked: false, title: "Risk Taker", description: "Invest over 50% in crypto" },
    diversified: { unlocked: false, title: "Diversified Portfolio", description: "Own all available assets" },
    goldHoarder: { unlocked: false, title: "Gold Hoarder", description: "Accumulate 5 units of gold" },
    marketCrash: { unlocked: false, title: "Crash Survivor", description: "End with profit despite a market crash" },
    tenPercent: { unlocked: false, title: "Double Digits", description: "Achieve a 10% return" },
    wealthyInvestor: { unlocked: false, title: "Wealthy Investor", description: "Reach a portfolio value of $15,000" },
    shortMaster: { unlocked: false, title: "Short Master", description: "Make profit from a short position" },
    doubleDown: { unlocked: false, title: "Double or Nothing", description: "Win a double or nothing bet" },
    perfectTiming: { unlocked: false, title: "Perfect Timing", description: "Buy right before a price spike" }
  });
  
  // Notifications array to pass to GameScreen
  const [notifications, setNotifications] = useState([]);
  
  // Load saved game state on initial render
  useEffect(() => {
    const savedState = loadGameState();
    if (savedState && settings.saveProgress) {
      // Restore relevant parts of the game state
      setSettings(savedState.settings || settings);
      setAchievements(savedState.achievements || achievements);
      
      // If we were in the middle of a game, optionally restore that too
      if (savedState.gameInProgress && savedState.gameScreen === 'game') {
        setGameScreen('menu'); // Just go to menu for now, could prompt to continue game
      }
    }
  }, []);
  
  // Save game state when relevant parts change
  useEffect(() => {
    if (settings.saveProgress) {
      saveGameState({
        settings,
        achievements,
        gameInProgress: gameScreen === 'game',
        gameScreen
      });
    }
  }, [settings, achievements, gameScreen]);
  
  // Initialize game based on difficulty and mode
  const initializeGame = () => {
    // Set starting cash based on difficulty
    const cash = DIFFICULTY_SETTINGS[difficulty].startingCash;
    setPortfolio({ cash });
    
    // Reset asset quantities
    setAssetData({
      quantities: {
        stocks: 0,
        oil: 0,
        gold: 0,
        crypto: 0
      },
      dollarValues: {
        stocks: 0,
        oil: 0,
        gold: 0,
        crypto: 0
      },
      shorts: {
        stocks: { value: 0, price: 0, active: false },
        oil: { value: 0, price: 0, active: false },
        gold: { value: 0, price: 0, active: false },
        crypto: { value: 0, price: 0, active: false }
      }
    });
    
    // Initialize asset prices
    setAssetPrices({
      stocks: 120,
      oil: 65,
      gold: 1950,
      crypto: 29000
    });
    
    // Set rounds based on difficulty
    setTotalRounds(DIFFICULTY_SETTINGS[difficulty].rounds);
    setRound(1);
    
    // Reset game stats
    setGameStats({
      tradesExecuted: 0,
      profitableTrades: 0,
      biggestGain: 0,
      biggestLoss: 0,
      marketCrashesWeathered: 0
    });
    
    // Clear notifications
    setNotifications([]);
  };
  
  // Add notification
  const addNotification = (message, type = 'info') => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, message, type }]);
    
    // Auto remove notification after 5 seconds
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 5000);
  };
  
  // Check for achievements
  const checkAchievements = () => {
    const portfolioValue = calculatePortfolioValue(portfolio, assetData, assetPrices);
    
    // Check for first profitable trade
    if (gameStats.profitableTrades > 0 && !achievements.firstProfit.unlocked) {
      unlockAchievement('firstProfit');
    }
    
    // Check for diversified portfolio
    const hasAllAssets = Object.values(assetData.quantities).every(qty => qty > 0);
    if (hasAllAssets && !achievements.diversified.unlocked) {
      unlockAchievement('diversified');
    }
    
    // Check for gold hoarder (fractional implementation)
    if (assetData.quantities.gold >= 5 && !achievements.goldHoarder.unlocked) {
      unlockAchievement('goldHoarder');
    }
    
    // Check for risk taker (>50% in crypto)
    const cryptoValue = assetData.quantities.crypto * assetPrices.crypto;
    if (cryptoValue > portfolioValue * 0.5 && !achievements.riskTaker.unlocked) {
      unlockAchievement('riskTaker');
    }
    
    // Check for wealthy investor
    if (portfolioValue >= 15000 && !achievements.wealthyInvestor.unlocked) {
      unlockAchievement('wealthyInvestor');
    }
    
    // Check for short master
    const hasActiveProfitableShort = Object.entries(assetData.shorts).some(([asset, position]) => {
      if (position.active) {
        const entryPrice = position.price;
        const currentPrice = assetPrices[asset];
        return entryPrice > currentPrice; // Profitable if price decreased
      }
      return false;
    });
    
    if (hasActiveProfitableShort && !achievements.shortMaster.unlocked) {
      unlockAchievement('shortMaster');
    }
  };
  
  // Unlock achievement
  const unlockAchievement = (id) => {
    if (!achievements[id].unlocked) {
      setAchievements(prev => ({
        ...prev,
        [id]: { ...prev[id], unlocked: true }
      }));
      
      const achTitle = achievements[id].title;
      addNotification(`Achievement Unlocked: ${achTitle}!`, 'achievement');
    }
  };
  
  // Format currency display
  const formatCurrency = (value) => {
    return '$' + Math.round(value).toLocaleString();
  };
  
  // Start game
  const startGame = () => {
    setGameScreen('game');
    initializeGame();
    setTimer(60);
    setPaused(false);
  };
  
  // Toggle a setting
  const toggleSetting = (setting) => {
    setSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };
  
  // Handle end of game
  const handleEndGame = () => {
    const finalValue = calculatePortfolioValue(portfolio, assetData, assetPrices);
    const startingCash = DIFFICULTY_SETTINGS[difficulty].startingCash;
    const returnPercentage = ((finalValue - startingCash) / startingCash) * 100;
    
    // Calculate best and worst performing assets
    let bestAsset = "";
    let worstAsset = "";
    let bestReturn = -100;
    let worstReturn = 100;
    
    Object.entries(assetData.quantities).forEach(([asset, quantity]) => {
      if (assetData.dollarValues[asset] > 0) {
        const currentValue = quantity * assetPrices[asset];
        const originalValue = assetData.dollarValues[asset];
        const assetReturn = ((currentValue - originalValue) / originalValue) * 100;
        
        if (assetReturn > bestReturn) {
          bestReturn = assetReturn;
          bestAsset = asset;
        }
        
        if (assetReturn < worstReturn) {
          worstReturn = assetReturn;
          worstAsset = asset;
        }
      }
    });
    
    setGameResult({
      finalValue,
      returnPercentage,
      bestAsset: bestAsset || "None",
      worstAsset: worstAsset || "None",
      bestReturn,
      worstReturn
    });
    
    // Final achievements check
    if (returnPercentage >= 10 && !achievements.tenPercent.unlocked) {
      unlockAchievement('tenPercent');
    }
    
    if (gameStats.marketCrashesWeathered > 0 && returnPercentage > 0 && !achievements.marketCrash.unlocked) {
      unlockAchievement('marketCrash');
    }
    
    // Show game results screen
    setGameScreen('results');
  };
  
  // Render the appropriate screen based on gameScreen state
  return (
    <div className={`app-container min-h-screen ${settings.darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
      {gameScreen === 'menu' && (
        <MainMenu 
          startGame={startGame}
          setGameScreen={setGameScreen}
          gameMode={gameMode}
          setGameMode={setGameMode}
          difficulty={difficulty}
          setDifficulty={setDifficulty}
          gameModeSettings={GAME_MODE_SETTINGS}
        />
      )}
      
      {gameScreen === 'game' && (
        <GameScreen 
          portfolio={portfolio}
          setPortfolio={setPortfolio}
          assetPrices={assetPrices}
          setAssetPrices={setAssetPrices}
          assetData={assetData}
          setAssetData={setAssetData}
          timer={timer}
          setTimer={setTimer}
          round={round}
          setRound={setRound}
          totalRounds={totalRounds}
          paused={paused}
          setPaused={setPaused}
          currentNews={currentNews}
          setCurrentNews={setCurrentNews}
          gameStats={gameStats}
          setGameStats={setGameStats}
          difficulty={difficulty}
          difficultySettings={DIFFICULTY_SETTINGS}
          gameMode={gameMode}
          handleEndGame={handleEndGame}
          setGameScreen={setGameScreen}
          achievements={achievements}
          checkAchievements={checkAchievements}
          addNotification={addNotification}
        />
      )}
      
      {gameScreen === 'results' && (
        <ResultsScreen 
          gameResult={gameResult}
          gameStats={gameStats}
          setGameScreen={setGameScreen}
          startGame={startGame}
        />
      )}
      
      {gameScreen === 'instructions' && (
        <InstructionsScreen 
          setGameScreen={setGameScreen}
        />
      )}
      
      {gameScreen === 'settings' && (
        <SettingsScreen 
          settings={settings}
          toggleSetting={toggleSetting}
          setGameScreen={setGameScreen}
        />
      )}
      
      {gameScreen === 'achievements' && (
        <AchievementsScreen 
          achievements={achievements}
          setGameScreen={setGameScreen}
        />
      )}
      
      {gameScreen === 'assetInfo' && (
        <AssetInfoScreen 
          setGameScreen={setGameScreen}
        />
      )}
    </div>
  );
};

export default PortfolioPanicGame;
