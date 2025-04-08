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

const PortfolioPanicGame = () => {
  // Game state management
  const [gameScreen, setGameScreen] = useState('menu'); // menu, game, results, instructions, settings, assetInfo, achievements
  const [gameMode, setGameMode] = useState('standard'); // standard, crisis, challenge
  const [difficulty, setDifficulty] = useState('normal'); // easy, normal, hard
  
  // Portfolio state
  const [portfolio, setPortfolio] = useState({
    cash: 10000,
    stocks: 0,
    gold: 0,
    crypto: 0,
    bonds: 0
  });
  
  // Market state
  const [assetPrices, setAssetPrices] = useState(INITIAL_ASSET_PRICES);
  const [assetQuantities, setAssetQuantities] = useState({
    stocks: 0,
    gold: 0,
    crypto: 0,
    bonds: 0
  });
  const [assetTrends, setAssetTrends] = useState({
    stocks: { direction: 'up', strength: 2 },
    gold: { direction: 'up', strength: 1 },
    crypto: { direction: 'down', strength: 2 },
    bonds: { direction: 'down', strength: 1 }
  });
  const [assetVolatility, setAssetVolatility] = useState({
    stocks: 0.08,
    gold: 0.05,
    crypto: 0.15,
    bonds: 0.03
  });
  const [priceHistory, setPriceHistory] = useState({
    stocks: [230, 235, 240],
    gold: [1830, 1840, 1850],
    crypto: [30000, 29500, 29200],
    bonds: [1000, 990, 980]
  });
  
  // Game progression
  const [timer, setTimer] = useState(60);
  const [marketUpdateCountdown, setMarketUpdateCountdown] = useState(10);
  const [paused, setPaused] = useState(false);
  const [round, setRound] = useState(1);
  const [totalRounds, setTotalRounds] = useState(5);
  
  // News system
  const [currentNews, setCurrentNews] = useState({
    message: "New smartphone model is a hit!",
    impact: { stocks: 1.05, gold: 0.98, crypto: 1.02, bonds: 0.99 }
  });
  const [showNewsPopup, setShowNewsPopup] = useState(false);
  const [newsPopup, setNewsPopup] = useState({
    title: "COMPANY X REPORTS STRONG EARNINGS!",
    message: "The stock price of Company X jumps after they announce better-than-expected quarterly earnings.",
    tip: "Positive news will usually cause a stock to rise."
  });
  
  // User settings
  const [settings, setSettings] = useState({
    sound: true,
    music: true,
    tutorialComplete: false,
    darkMode: true,
    saveProgress: true
  });
  
  // Market alert system
  const [showMarketAlert, setShowMarketAlert] = useState(false);
  const [marketAlert, setMarketAlert] = useState({
    title: "MARKET VOLATILITY INCREASING",
    message: "Economic uncertainty is causing increased market volatility."
  });
  
  // Game results
  const [gameResult, setGameResult] = useState({
    finalValue: 0,
    returnPercentage: 0,
    bestAsset: "",
    worstAsset: ""
  });
  
  // UI state
  const [selectedTab, setSelectedTab] = useState('portfolio'); // portfolio, market, analysis
  
  // Achievements
  const [achievements, setAchievements] = useState({
    firstProfit: { unlocked: false, title: "First Profit", description: "Make your first profitable trade" },
    riskTaker: { unlocked: false, title: "Risk Taker", description: "Invest over 50% in crypto" },
    diversified: { unlocked: false, title: "Diversified Portfolio", description: "Own all available assets" },
    goldHoarder: { unlocked: false, title: "Gold Hoarder", description: "Accumulate 5 units of gold" },
    marketCrash: { unlocked: false, title: "Crash Survivor", description: "End with profit despite a market crash" },
    tenPercent: { unlocked: false, title: "Double Digits", description: "Achieve a 10% return" },
    wealthyInvestor: { unlocked: false, title: "Wealthy Investor", description: "Reach a portfolio value of $15,000" }
  });
  
  // Notifications
  const [notifications, setNotifications] = useState([]);
  
  // Game statistics
  const [gameStats, setGameStats] = useState({
    tradesExecuted: 0,
    profitableTrades: 0,
    biggestGain: 0,
    biggestLoss: 0,
    marketCrashesWeathered: 0
  });
  
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
  
  // Calculate total portfolio value
  const calculatePortfolioValue = () => {
    return portfolio.cash + 
      (assetQuantities.stocks * assetPrices.stocks) +
      (assetQuantities.gold * assetPrices.gold) +
      (assetQuantities.crypto * assetPrices.crypto) +
      (assetQuantities.bonds * assetPrices.bonds);
  };
  
  // Initialize game based on difficulty and mode
  const initializeGame = () => {
    // Set starting cash based on difficulty
    const cash = DIFFICULTY_SETTINGS[difficulty].startingCash;
    setPortfolio({ ...portfolio, cash });
    
    // Reset asset quantities
    setAssetQuantities({
      stocks: 0,
      gold: 0,
      crypto: 0,
      bonds: 0
    });
    
    // Set market conditions based on game mode
    const condition = GAME_MODE_SETTINGS[gameMode].marketCondition;
    
    // Initialize asset trends based on market condition
    let initialTrends = {
      stocks: { direction: 'up', strength: 1 },
      gold: { direction: 'up', strength: 1 },
      crypto: { direction: 'up', strength: 1 },
      bonds: { direction: 'up', strength: 1 }
    };
    
    if (condition === 'bearish') {
      initialTrends = {
        stocks: { direction: 'down', strength: 2 },
        gold: { direction: 'up', strength: 1 },
        crypto: { direction: 'down', strength: 3 },
        bonds: { direction: 'down', strength: 1 }
      };
    } else if (condition === 'bullish') {
      initialTrends = {
        stocks: { direction: 'up', strength: 2 },
        gold: { direction: 'down', strength: 1 },
        crypto: { direction: 'up', strength: 3 },
        bonds: { direction: 'up', strength: 1 }
      };
    }
    
    setAssetTrends(initialTrends);
    
    // Set volatility based on difficulty
    const volatilityMultiplier = DIFFICULTY_SETTINGS[difficulty].volatilityMultiplier;
    setAssetVolatility({
      stocks: 0.08 * volatilityMultiplier,
      gold: 0.05 * volatilityMultiplier,
      crypto: 0.15 * volatilityMultiplier,
      bonds: 0.03 * volatilityMultiplier
    });
    
    // Set initial asset prices
    setAssetPrices(INITIAL_ASSET_PRICES);
    
    // Reset price history
    setPriceHistory({
      stocks: [230, 235, 240],
      gold: [1830, 1840, 1850],
      crypto: [30000, 29500, 29200],
      bonds: [1000, 990, 980]
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
  
  // Trading system - enhanced with quantity control
  const handleTrade = (asset, action, quantity) => {
    if (action === 'buy') {
      handleBuy(asset, quantity);
    } else if (action === 'sell') {
      handleSell(asset, quantity);
    }
    // 'hold' action doesn't need explicit handling (it's just not buying/selling)
  };
  
  // Buy asset handler with quantity control
  const handleBuy = (asset, quantity) => {
    // Ensure quantity is a valid number
    quantity = parseFloat(quantity) || 1;
    
    // Calculate total cost
    const totalCost = assetPrices[asset] * quantity;
    
    if (portfolio.cash >= totalCost) {
      // Update asset quantities
      setAssetQuantities(prev => ({
        ...prev,
        [asset]: prev[asset] + quantity
      }));
      
      // Update cash
      setPortfolio(prev => ({
        ...prev,
        cash: prev.cash - totalCost
      }));
      
      // Record trade in game stats
      setGameStats(prev => ({
        ...prev,
        tradesExecuted: prev.tradesExecuted + 1
      }));
      
      // Show notification
      addNotification(`Bought ${quantity} ${asset} for ${formatCurrency(totalCost)}`, 'success');
      
      // Check achievements
      checkAchievements();
    } else {
      addNotification(`Not enough cash to buy ${quantity} ${asset}`, 'error');
    }
  };
  
  // Sell asset handler with quantity control
  const handleSell = (asset, quantity) => {
    // Ensure quantity is a valid number
    quantity = parseFloat(quantity) || 1;
    
    if (assetQuantities[asset] >= quantity) {
      const previousValue = calculatePortfolioValue();
      const saleValue = assetPrices[asset] * quantity;
      
      // Update asset quantities
      setAssetQuantities(prev => ({
        ...prev,
        [asset]: prev[asset] - quantity
      }));
      
      // Update cash
      setPortfolio(prev => ({
        ...prev,
        cash: prev.cash + saleValue
      }));
      
      // Calculate if trade was profitable based on original purchase cost
      // This is simplified, but we'd ideally track cost basis for each asset
      const newValue = calculatePortfolioValue();
      const isProfit = newValue > previousValue;
      
      // Update game stats
      setGameStats(prev => {
        const profit = newValue - previousValue;
        return {
          ...prev,
          tradesExecuted: prev.tradesExecuted + 1,
          profitableTrades: isProfit ? prev.profitableTrades + 1 : prev.profitableTrades,
          biggestGain: profit > prev.biggestGain ? profit : prev.biggestGain,
          biggestLoss: profit < 0 && Math.abs(profit) > Math.abs(prev.biggestLoss) ? profit : prev.biggestLoss
        };
      });
      
      // Show notification
      addNotification(`Sold ${quantity} ${asset} for ${formatCurrency(saleValue)}`, 'success');
      
      // Check for first profit achievement
      if (isProfit && !achievements.firstProfit.unlocked) {
        unlockAchievement('firstProfit');
      }
    } else {
      addNotification(`Not enough ${asset} to sell. You have ${assetQuantities[asset]}`, 'error');
    }
  };
  
  // Check for achievements
  const checkAchievements = () => {
    // Check for diversified portfolio
    const hasAllAssets = Object.values(assetQuantities).every(qty => qty > 0);
    if (hasAllAssets && !achievements.diversified.unlocked) {
      unlockAchievement('diversified');
    }
    
    // Check for gold hoarder
    if (assetQuantities.gold >= 5 && !achievements.goldHoarder.unlocked) {
      unlockAchievement('goldHoarder');
    }
    
    // Check for risk taker (>50% in crypto)
    const portfolioValue = calculatePortfolioValue();
    const cryptoValue = assetQuantities.crypto * assetPrices.crypto;
    if (cryptoValue > portfolioValue * 0.5 && !achievements.riskTaker.unlocked) {
      unlockAchievement('riskTaker');
    }
    
    // Check for wealthy investor
    if (portfolioValue >= 15000 && !achievements.wealthyInvestor.unlocked) {
      unlockAchievement('wealthyInvestor');
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
    
    // Show tutorial if it's the first time
    if (!settings.tutorialComplete) {
      setTimeout(() => {
        setShowNewsPopup(true);
        setNewsPopup({
          title: "WELCOME TO PORTFOLIO PANIC!",
          message: "Buy assets when you expect their price to rise, and sell when you expect them to fall. React to market news to maximize your returns.",
          tip: "Watch the arrow indicators to see current market trends."
        });
      }, 1000);
    }
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
    const finalValue = calculatePortfolioValue();
    const startingCash = DIFFICULTY_SETTINGS[difficulty].startingCash;
    const returnPercentage = ((finalValue - startingCash) / startingCash) * 100;
    
    // Calculate best and worst performing assets
    let bestAsset = "";
    let worstAsset = "";
    let bestReturn = -100;
    let worstReturn = 100;
    
    Object.keys(assetPrices).forEach(asset => {
      if (assetQuantities[asset] > 0) {
        const initialPrice = priceHistory[asset][0];
        const finalPrice = assetPrices[asset];
        const assetReturn = ((finalPrice - initialPrice) / initialPrice) * 100;
        
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
    <div className={`app-container ${settings.darkMode ? 'dark-theme' : 'light-theme'}`}>
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
          assetPrices={assetPrices}
          setAssetPrices={setAssetPrices}
          assetQuantities={assetQuantities}
          setAssetQuantities={setAssetQuantities}
          assetTrends={assetTrends}
          setAssetTrends={setAssetTrends}
          priceHistory={priceHistory}
          setPriceHistory={setPriceHistory}
          timer={timer}
          setTimer={setTimer}
          marketUpdateCountdown={marketUpdateCountdown}
          setMarketUpdateCountdown={setMarketUpdateCountdown}
          round={round}
          setRound={setRound}
          totalRounds={totalRounds}
          paused={paused}
          setPaused={setPaused}
          currentNews={currentNews}
          setCurrentNews={setCurrentNews}
          showNewsPopup={showNewsPopup}
          setShowNewsPopup={setShowNewsPopup}
          newsPopup={newsPopup}
          setNewsPopup={setNewsPopup}
          showMarketAlert={showMarketAlert}
          setShowMarketAlert={setShowMarketAlert}
          marketAlert={marketAlert}
          setMarketAlert={setMarketAlert}
          selectedTab={selectedTab}
          setSelectedTab={setSelectedTab}
          notifications={notifications}
          addNotification={addNotification}
          handleTrade={handleTrade}
          calculatePortfolioValue={calculatePortfolioValue}
          formatCurrency={formatCurrency}
          gameStats={gameStats}
          setGameStats={setGameStats}
          difficulty={difficulty}
          difficultySettings={DIFFICULTY_SETTINGS}
          gameMode={gameMode}
          handleEndGame={handleEndGame}
          setGameScreen={setGameScreen}
          achievements={achievements}
          checkAchievements={checkAchievements}
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