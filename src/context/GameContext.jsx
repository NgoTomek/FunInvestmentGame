import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { saveGameState, loadGameState, clearGameState } from '../utils/localStorage';
import { DIFFICULTY_SETTINGS, GAME_MODE_SETTINGS, INITIAL_ASSET_PRICES } from '../utils/gameData';
import { generateNewsEvent, updateMarketPrices, generateMarketOpportunity } from '../utils/marketLogic';
import { calculatePortfolioValue } from '../utils/portfoliomanager';

// Create the context
const GameContext = createContext();

// Custom hook for using the context
export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};

// Provider component
export const GameProvider = ({ children }) => {
  // Game navigation state
  const [gameScreen, setGameScreen] = useState('menu');
  
  // Game configuration
  const [gameMode, setGameMode] = useState('standard');
  const [difficulty, setDifficulty] = useState('normal');
  
  // Portfolio state
  const [portfolio, setPortfolio] = useState({
    cash: 10000,
  });
  
  // Assets state
  const [assetPrices, setAssetPrices] = useState({
    stocks: INITIAL_ASSET_PRICES.stocks,
    oil: INITIAL_ASSET_PRICES.oil || 65,
    gold: INITIAL_ASSET_PRICES.gold,
    crypto: INITIAL_ASSET_PRICES.crypto
  });
  
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
  
  // Market data
  const [assetTrends, setAssetTrends] = useState({
    stocks: { direction: 'up', strength: 1 },
    oil: { direction: 'up', strength: 1 },
    gold: { direction: 'up', strength: 1 },
    crypto: { direction: 'up', strength: 2 }
  });
  
  const [priceHistory, setPriceHistory] = useState({
    stocks: [assetPrices.stocks],
    oil: [assetPrices.oil],
    gold: [assetPrices.gold],
    crypto: [assetPrices.crypto]
  });
  
  // Game progression
  const [timer, setTimer] = useState(60);
  const [paused, setPaused] = useState(false);
  const [round, setRound] = useState(1);
  const [totalRounds, setTotalRounds] = useState(DIFFICULTY_SETTINGS.normal.rounds);
  const [marketUpdateCountdown, setMarketUpdateCountdown] = useState(10);
  
  // News system
  const [currentNews, setCurrentNews] = useState({
    message: "Market news will appear here...",
    impact: { stocks: 1.0, oil: 1.0, gold: 1.0, crypto: 1.0 }
  });
  
  const [showNewsPopup, setShowNewsPopup] = useState(false);
  const [newsPopup, setNewsPopup] = useState({ title: '', message: '', tip: '' });
  
  // Market alerts
  const [showMarketAlert, setShowMarketAlert] = useState(false);
  const [marketAlert, setMarketAlert] = useState({ title: '', message: '' });
  
  // Special opportunities
  const [marketOpportunity, setMarketOpportunity] = useState(null);
  
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
    marketCrashesWeathered: 0,
    tradesPerRound: 0
  });
  
  // Game results
  const [gameResult, setGameResult] = useState({
    finalValue: 0,
    returnPercentage: 0,
    bestAsset: "",
    worstAsset: "",
    bestReturn: 0,
    worstReturn: 0
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
    perfectTiming: { unlocked: false, title: "Perfect Timing", description: "Buy right before a price spike" }
  });
  
  // Notifications
  const [notifications, setNotifications] = useState([]);
  
  // Timer references
  const gameTimerRef = useRef(null);
  const marketUpdateRef = useRef(null);
  
  // Load saved game state on initial render
  useEffect(() => {
    const savedState = loadGameState();
    if (savedState && settings.saveProgress) {
      // Restore relevant parts of the game state
      setSettings(savedState.settings || settings);
      setAchievements(savedState.achievements || achievements);
      
      // If we were in the middle of a game, optionally restore that too
      if (savedState.gameInProgress) {
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
      stocks: INITIAL_ASSET_PRICES.stocks,
      oil: INITIAL_ASSET_PRICES.oil || 65,
      gold: INITIAL_ASSET_PRICES.gold,
      crypto: INITIAL_ASSET_PRICES.crypto
    });
    
    // Initialize price history with initial values
    setPriceHistory({
      stocks: [INITIAL_ASSET_PRICES.stocks],
      oil: [INITIAL_ASSET_PRICES.oil || 65],
      gold: [INITIAL_ASSET_PRICES.gold],
      crypto: [INITIAL_ASSET_PRICES.crypto]
    });
    
    // Set initial trends based on game mode
    setAssetTrends(GAME_MODE_SETTINGS[gameMode].startingTrends || {
      stocks: { direction: 'up', strength: 1 },
      oil: { direction: 'up', strength: 1 },
      gold: { direction: 'up', strength: 1 },
      crypto: { direction: 'up', strength: 2 }
    });
    
    // Set rounds based on difficulty
    setTotalRounds(DIFFICULTY_SETTINGS[difficulty].rounds);
    setRound(1);
    
    // Reset timer
    setTimer(60);
    setPaused(false);
    
    // Reset game stats
    setGameStats({
      tradesExecuted: 0,
      profitableTrades: 0,
      biggestGain: 0,
      biggestLoss: 0,
      marketCrashesWeathered: 0,
      tradesPerRound: 0
    });
    
    // Clear notifications
    setNotifications([]);
    
    // Clear market opportunity
    setMarketOpportunity(null);
  };
  
  // Start game
  const startGame = () => {
    setGameScreen('game');
    initializeGame();
    startGameTimer();
    startMarketUpdates();
    generateNews();
  };
  
  // Toggle pause state
  const togglePause = () => {
    setPaused(prev => {
      const newPaused = !prev;
      
      if (newPaused) {
        // Pause timers
        clearInterval(gameTimerRef.current);
        clearInterval(marketUpdateRef.current);
      } else {
        // Resume timers
        startGameTimer();
        startMarketUpdates();
      }
      
      return newPaused;
    });
  };
  
  // Toggle a setting
  const toggleSetting = (setting) => {
    setSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };
  
  // Start game timer
  const startGameTimer = () => {
    if (gameTimerRef.current) clearInterval(gameTimerRef.current);
    
    gameTimerRef.current = setInterval(() => {
      setTimer(prev => {
        if (prev <= 1) {
          // End of round
          clearInterval(gameTimerRef.current);
          
          if (round < totalRounds) {
            handleEndOfRound();
            return 60; // Reset timer for next round
          } else {
            // End game
            handleEndGame();
            return 0;
          }
        }
        return prev - 1;
      });
    }, 1000);
  };
  
  // Start market updates
  const startMarketUpdates = () => {
    if (marketUpdateRef.current) clearInterval(marketUpdateRef.current);
    
    const updateInterval = DIFFICULTY_SETTINGS[difficulty].updateInterval;
    setMarketUpdateCountdown(updateInterval);
    
    marketUpdateRef.current = setInterval(() => {
      setMarketUpdateCountdown(prev => {
        if (prev <= 1) {
          updateMarket();
          return updateInterval;
        }
        return prev - 1;
      });
    }, 1000);
  };
  
  // Update market prices
  const updateMarket = (newsImpact = null) => {
    const result = updateMarketPrices(
      assetPrices,
      priceHistory,
      assetTrends,
      {
        stocks: 0.08,
        oil: 0.10,
        gold: 0.05,
        crypto: 0.15
      },
      newsImpact,
      difficulty,
      gameMode
    );
    
    setAssetPrices(result.updatedPrices);
    setPriceHistory(result.updatedPriceHistory);
    setAssetTrends(result.updatedTrends);
    
    // Random chance to generate market opportunity (5%)
    if (Math.random() < 0.05 && !marketOpportunity) {
      setMarketOpportunity(generateMarketOpportunity());
    }
    
    // Check achievements after market update
    checkAchievements();
  };
  
  // Generate news event
  const generateNews = () => {
    const newsEvent = generateNewsEvent(gameMode, difficulty, DIFFICULTY_SETTINGS);
    
    if (newsEvent.isCrash) {
      setShowMarketAlert(true);
      setMarketAlert({
        title: "MARKET CRASH!",
        message: "Widespread selling pressure across markets. Brace for volatility!"
      });
      
      setGameStats(prev => ({
        ...prev,
        marketCrashesWeathered: prev.marketCrashesWeathered + 1
      }));
    }
    
    setNewsPopup(newsEvent);
    setCurrentNews({
      message: newsEvent.title,
      impact: newsEvent.impact
    });
    
    setShowNewsPopup(true);
    
    // Apply market effects with a delay to give player time to react
    setTimeout(() => {
      updateMarket(newsEvent.impact);
    }, 4000);
  };
  
  // Handle end of round
  const handleEndOfRound = () => {
    // Increase round number
    setRound(prev => prev + 1);
    
    // Reset trades per round counter
    setGameStats(prev => ({
      ...prev,
      tradesPerRound: 0
    }));
    
    // Generate news for next round
    generateNews();
    
    // Clear market opportunity
    setMarketOpportunity(null);
    
    // Add notification
    addNotification(`Round ${round} completed. Starting round ${round + 1}!`, 'info');
    
    // Restart timers
    startGameTimer();
    startMarketUpdates();
  };
  
  // Handle end of game
  const handleEndGame = () => {
    // Clear timers
    clearInterval(gameTimerRef.current);
    clearInterval(marketUpdateRef.current);
    
    const finalValue = calculatePortfolioValue(portfolio, assetData, assetPrices);
    const startingCash = DIFFICULTY_SETTINGS[difficulty].startingCash;
    const returnPercentage = ((finalValue - startingCash) / startingCash) * 100;
    
    // Calculate best and worst performing assets
    let bestAsset = "";
    let worstAsset = "";
    let bestReturn = -100;
    let worstReturn = 100;
    
    Object.entries(assetData.quantities).forEach(([asset, quantity]) => {
      if (quantity > 0) {
        const currentValue = quantity * assetPrices[asset];
        const originalValue = assetData.dollarValues[asset];
        
        if (originalValue > 0) {
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
    
    // Navigate to results screen
    setGameScreen('results');
  };
  
  // Handle trade execution
  const handleTrade = (asset, action, quantity) => {
    let updatedPortfolio = { ...portfolio };
    let updatedAssetData = { ...assetData };
    let wasProfitable = false;
    
    const price = assetPrices[asset];
    const currentQuantity = assetData.quantities[asset] || 0;
    
    // Execute trade based on action
    if (action === 'buy') {
      // Calculate cost
      let cost;
      if (typeof quantity === 'number' && quantity <= 1) {
        // Percentage of cash
        cost = updatedPortfolio.cash * quantity;
        quantity = cost / price;
      } else if (quantity === 'double') {
        // Double down - double current position or 50% if none
        const currentPosition = currentQuantity * price;
        cost = currentPosition > 0 ? currentPosition : updatedPortfolio.cash * 0.5;
        quantity = cost / price;
      } else {
        // Specific quantity
        cost = quantity * price;
      }
      
      // Check if enough cash
      if (cost > updatedPortfolio.cash) {
        addNotification('Not enough cash for this purchase!', 'error');
        return;
      }
      
      // Update portfolio
      updatedPortfolio.cash -= cost;
      updatedAssetData.quantities[asset] = (currentQuantity || 0) + quantity;
      updatedAssetData.dollarValues[asset] = (updatedAssetData.dollarValues[asset] || 0) + cost;
      
      addNotification(`Bought ${quantity.toFixed(asset === 'crypto' ? 2 : 0)} ${asset}`, 'success');
    } 
    else if (action === 'sell') {
      // Calculate quantity to sell
      let quantityToSell;
      if (quantity <= 1) {
        // Percentage of holdings
        quantityToSell = currentQuantity * quantity;
      } else {
        // Specific quantity
        quantityToSell = Math.min(quantity, currentQuantity);
      }
      
      // Check if enough assets to sell
      if (quantityToSell > currentQuantity) {
        addNotification('Not enough assets to sell!', 'error');
        return;
      }
      
      // Calculate return
      const saleReturn = quantityToSell * price;
      
      // Calculate profit/loss
      const costBasis = updatedAssetData.dollarValues[asset] * (quantityToSell / currentQuantity);
      const profitLoss = saleReturn - costBasis;
      wasProfitable = profitLoss > 0;
      
      // Update stats for profit/loss
      if (wasProfitable) {
        setGameStats(prev => ({
          ...prev,
          profitableTrades: prev.profitableTrades + 1,
          biggestGain: Math.max(prev.biggestGain, profitLoss)
        }));
      } else {
        setGameStats(prev => ({
          ...prev,
          biggestLoss: Math.min(prev.biggestLoss, profitLoss)
        }));
      }
      
      // Update portfolio
      updatedPortfolio.cash += saleReturn;
      updatedAssetData.quantities[asset] = currentQuantity - quantityToSell;
      updatedAssetData.dollarValues[asset] = updatedAssetData.dollarValues[asset] * (1 - (quantityToSell / currentQuantity));
      
      addNotification(`Sold ${quantityToSell.toFixed(asset === 'crypto' ? 2 : 0)} ${asset} for ${formatCurrency(saleReturn)}`, wasProfitable ? 'success' : 'info');
    }
    else if (action === 'short') {
      // Calculate amount to short
      const cashAmount = updatedPortfolio.cash * quantity;
      
      // Update portfolio
      updatedPortfolio.cash -= cashAmount;
      updatedAssetData.shorts[asset] = {
        value: cashAmount,
        price: price,
        active: true
      };
      
      addNotification(`Opened short position on ${asset}`, 'info');
    }
    else if (action === 'closeShort') {
      // Check if short exists
      if (!updatedAssetData.shorts[asset]?.active) {
        addNotification('No active short position to close!', 'error');
        return;
      }
      
      const shortPosition = updatedAssetData.shorts[asset];
      const entryPrice = shortPosition.price;
      const value = shortPosition.value;
      
      // Calculate profit/loss
      const priceChange = (entryPrice - price) / entryPrice;
      const profitLoss = value * priceChange * 2; // 2x leverage on shorts
      wasProfitable = profitLoss > 0;
      
      // Update stats for profit/loss
      if (wasProfitable) {
        setGameStats(prev => ({
          ...prev,
          profitableTrades: prev.profitableTrades + 1,
          biggestGain: Math.max(prev.biggestGain, profitLoss)
        }));
      } else {
        setGameStats(prev => ({
          ...prev,
          biggestLoss: Math.min(prev.biggestLoss, profitLoss)
        }));
      }
      
      // Update portfolio
      updatedPortfolio.cash += value + profitLoss;
      updatedAssetData.shorts[asset] = {
        value: 0,
        price: 0,
        active: false
      };
      
      addNotification(`Closed short position on ${asset}`, wasProfitable ? 'success' : 'info');
    }
    
    // Update stats
    setGameStats(prev => ({
      ...prev,
      tradesExecuted: prev.tradesExecuted + 1,
      tradesPerRound: prev.tradesPerRound + 1
    }));
    
    // Update state
    setPortfolio(updatedPortfolio);
    setAssetData(updatedAssetData);
    
    // Check achievements after trade
    checkAchievements();
  };
  
  // Handle market opportunity
  const handleOpportunity = (opportunity) => {
    if (opportunity.type === 'double') {
      // Double or nothing - 50% chance to double investment, 50% chance to lose it
      const asset = opportunity.asset;
      const outcome = Math.random() > 0.5;
      
      if (outcome) {
        // Double - buy with 50% of cash and get bonus 50%
        const cashToSpend = portfolio.cash * 0.5;
        const quantity = cashToSpend / assetPrices[asset];
        const bonusQuantity = quantity;
        
        // Update portfolio
        setPortfolio(prev => ({ ...prev, cash: prev.cash - cashToSpend }));
        setAssetData(prev => ({
          ...prev,
          quantities: {
            ...prev.quantities,
            [asset]: (prev.quantities[asset] || 0) + quantity + bonusQuantity
          },
          dollarValues: {
            ...prev.dollarValues,
            [asset]: (prev.dollarValues[asset] || 0) + cashToSpend * 2
          }
        }));
        
        addNotification(`Double Success! Doubled your ${asset} investment!`, 'success');
      } else {
        // Nothing - lose 50% of cash
        const cashLost = portfolio.cash * 0.5;
        
        setPortfolio(prev => ({ ...prev, cash: prev.cash - cashLost }));
        addNotification(`Double Fail! Lost ${formatCurrency(cashLost)}`, 'error');
      }
    } else if (opportunity.type === 'insider') {
      // Insider tip - buy the asset with 30% of cash and apply a guaranteed increase
      const asset = opportunity.asset;
      const cashToSpend = portfolio.cash * 0.3;
      const quantity = cashToSpend / assetPrices[asset];
      
      // Update portfolio
      setPortfolio(prev => ({ ...prev, cash: prev.cash - cashToSpend }));
      setAssetData(prev => ({
        ...prev,
        quantities: {
          ...prev.quantities,
          [asset]: (prev.quantities[asset] || 0) + quantity
        },
        dollarValues: {
          ...prev.dollarValues,
          [asset]: (prev.dollarValues[asset] || 0) + cashToSpend
        }
      }));
      
      // Apply a price increase shortly after
      setTimeout(() => {
        const newsImpact = { [asset]: 1.2 }; // 20% increase
        updateMarket(newsImpact);
        addNotification(`Insider tip paid off! ${asset} prices rising!`, 'success');
      }, 3000);
      
      addNotification(`Acting on insider information for ${asset}...`, 'info');
    } else {
      // Default - buy the asset with 25% of cash
      handleTrade(opportunity.asset, 'buy', 0.25);
    }
    
    // Clear the opportunity
    setMarketOpportunity(null);
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
  
  // Format currency display
  const formatCurrency = (value) => {
    return '$' + Math.round(value).toLocaleString();
  };
  
  // Format time display (mm:ss)
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
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
    if (achievements[id] && !achievements[id].unlocked) {
      setAchievements(prev => ({
        ...prev,
        [id]: { ...prev[id], unlocked: true }
      }));
      
      const achTitle = achievements[id].title;
      addNotification(`Achievement Unlocked: ${achTitle}!`, 'achievement');
    }
  };
  
  // Clean up timers when component unmounts
  useEffect(() => {
    return () => {
      if (gameTimerRef.current) clearInterval(gameTimerRef.current);
      if (marketUpdateRef.current) clearInterval(marketUpdateRef.current);
    };
  }, []);
  
  // Context value
  const value = {
    // Game state
    gameScreen,
    setGameScreen,
    gameMode,
    setGameMode,
    difficulty,
    setDifficulty,
    round,
    totalRounds,
    timer,
    paused,
    
    // Portfolio
    portfolio,
    setPortfolio,
    assetPrices,
    assetData,
    
    // Market
    assetTrends,
    priceHistory,
    marketUpdateCountdown,
    currentNews,
    showNewsPopup,
    setShowNewsPopup,
    newsPopup,
    showMarketAlert,
    setShowMarketAlert,
    marketAlert,
    marketOpportunity,
    
    // Settings and UI
    settings,
    toggleSetting,
    notifications,
    gameStats,
    gameResult,
    achievements,
    
    // Functions
    startGame,
    togglePause,
    handleTrade,
    handleOpportunity,
    addNotification,
    formatCurrency,
    formatTime,
    calculatePortfolioValue: () => calculatePortfolioValue(portfolio, assetData, assetPrices),
    handleEndGame
  };
  
  return (
    <GameContext.Provider value={value}>
      {children}
    </GameContext.Provider>
  );
};
