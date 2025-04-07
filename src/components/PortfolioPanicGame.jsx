import React, { useState, useEffect, useRef } from 'react';
import { ArrowUp, ArrowDown, AlertTriangle, TrendingUp, TrendingDown, DollarSign, Clock, BarChart2, Award, Info, Settings, HelpCircle, ArrowLeft } from 'lucide-react';

const PortfolioPanicGame = () => {
  // Game states
  const [gameScreen, setGameScreen] = useState('menu'); // menu, game, results, instructions, settings, assetInfo, achievements
  const [gameMode, setGameMode] = useState('standard'); // standard, crisis, challenge
  const [difficulty, setDifficulty] = useState('normal'); // easy, normal, hard
  const [portfolio, setPortfolio] = useState({
    cash: 10000,
    stocks: 0,
    gold: 0,
    crypto: 0,
    bonds: 0
  });
  
  const [assetPrices, setAssetPrices] = useState({
    stocks: 240,
    gold: 1850,
    crypto: 29200,
    bonds: 980
  });
  
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
  
  const [timer, setTimer] = useState(60);
  const [marketUpdateCountdown, setMarketUpdateCountdown] = useState(10);
  const [paused, setPaused] = useState(false);
  const [round, setRound] = useState(1);
  const [totalRounds, setTotalRounds] = useState(5);
  const [currentNews, setCurrentNews] = useState({
    message: "New smartphone model is a hit!",
    impact: { stocks: 1.05, gold: 0.98, crypto: 1.02, bonds: 0.99 }
  });
  
  const [settings, setSettings] = useState({
    sound: true,
    music: true,
    tutorialComplete: false
  });
  
  const [showNewsPopup, setShowNewsPopup] = useState(false);
  const [newsPopup, setNewsPopup] = useState({
    title: "COMPANY X REPORTS STRONG EARNINGS!",
    message: "The stock price of Company X jumps after they announce better-than-expected quarterly earnings.",
    tip: "Positive news will usually cause a stock to rise."
  });
  
  const [showMarketAlert, setShowMarketAlert] = useState(false);
  const [marketAlert, setMarketAlert] = useState({
    title: "MARKET VOLATILITY INCREASING",
    message: "Economic uncertainty is causing increased market volatility."
  });
  
  const [gameResult, setGameResult] = useState({
    finalValue: 0,
    returnPercentage: 0,
    bestAsset: "",
    worstAsset: ""
  });
  
  const [selectedTab, setSelectedTab] = useState('portfolio'); // portfolio, market, analysis
  
  const [achievements, setAchievements] = useState({
    firstProfit: { unlocked: false, title: "First Profit", description: "Make your first profitable trade" },
    riskTaker: { unlocked: false, title: "Risk Taker", description: "Invest over 50% in crypto" },
    diversified: { unlocked: false, title: "Diversified Portfolio", description: "Own all available assets" },
    goldHoarder: { unlocked: false, title: "Gold Hoarder", description: "Accumulate 5 units of gold" },
    marketCrash: { unlocked: false, title: "Crash Survivor", description: "End with profit despite a market crash" },
    tenPercent: { unlocked: false, title: "Double Digits", description: "Achieve a 10% return" },
    wealthyInvestor: { unlocked: false, title: "Wealthy Investor", description: "Reach a portfolio value of $15,000" }
  });
  
  const [notifications, setNotifications] = useState([]);
  const [gameStats, setGameStats] = useState({
    tradesExecuted: 0,
    profitableTrades: 0,
    biggestGain: 0,
    biggestLoss: 0,
    marketCrashesWeathered: 0
  });
  
  // Timer refs
  const gameTimerRef = useRef(null);
  const marketUpdateRef = useRef(null);
  
  // Format currency display
  const formatCurrency = (value) => {
    return '$' + value.toLocaleString();
  };
  
  // Difficulty settings
  const difficultySettings = {
    easy: { 
      startingCash: 12000, 
      updateInterval: 12, 
      volatilityMultiplier: 0.7, 
      marketCrashProbability: 0.05,
      rounds: 4
    },
    normal: { 
      startingCash: 10000, 
      updateInterval: 10, 
      volatilityMultiplier: 1.0, 
      marketCrashProbability: 0.1,
      rounds: 5
    },
    hard: { 
      startingCash: 8000, 
      updateInterval: 8, 
      volatilityMultiplier: 1.5, 
      marketCrashProbability: 0.15,
      rounds: 6
    }
  };
  
  // Game mode settings
  const gameModeSettings = {
    standard: {
      name: "Standard Mode",
      description: "React to market news and build your portfolio",
      marketCondition: "normal"
    },
    crisis: {
      name: "Financial Crisis",
      description: "Survive a financial meltdown and try to keep your investments safe",
      marketCondition: "bearish"
    },
    challenge: {
      name: "Bull Run Challenge",
      description: "Maximize returns during a strong bull market with extreme volatility",
      marketCondition: "bullish"
    }
  };
  
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
    const cash = difficultySettings[difficulty].startingCash;
    setPortfolio({ ...portfolio, cash });
    
    // Reset asset quantities
    setAssetQuantities({
      stocks: 0,
      gold: 0,
      crypto: 0,
      bonds: 0
    });
    
    // Set market conditions based on game mode
    const condition = gameModeSettings[gameMode].marketCondition;
    
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
    const volatilityMultiplier = difficultySettings[difficulty].volatilityMultiplier;
    setAssetVolatility({
      stocks: 0.08 * volatilityMultiplier,
      gold: 0.05 * volatilityMultiplier,
      crypto: 0.15 * volatilityMultiplier,
      bonds: 0.03 * volatilityMultiplier
    });
    
    // Set initial asset prices
    setAssetPrices({
      stocks: 240,
      gold: 1850,
      crypto: 29200,
      bonds: 980
    });
    
    // Reset price history
    setPriceHistory({
      stocks: [230, 235, 240],
      gold: [1830, 1840, 1850],
      crypto: [30000, 29500, 29200],
      bonds: [1000, 990, 980]
    });
    
    // Set rounds based on difficulty
    setTotalRounds(difficultySettings[difficulty].rounds);
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
  
  // Buy asset handler with improved quantity control
  const handleBuy = (asset) => {
    const price = assetPrices[asset];
    
    // For crypto, allow fractional purchases (0.01 units)
    let buyIncrement = 1;
    let buyPrice = price;
    
    if (asset === 'crypto') {
      buyIncrement = 0.01;
      buyPrice = price * buyIncrement;
    }
    
    if (portfolio.cash >= buyPrice) {
      // Update asset quantities
      setAssetQuantities(prev => ({
        ...prev,
        [asset]: prev[asset] + buyIncrement
      }));
      
      // Update cash
      setPortfolio(prev => ({
        ...prev,
        cash: prev.cash - buyPrice
      }));
      
      // Record trade in game stats
      setGameStats(prev => ({
        ...prev,
        tradesExecuted: prev.tradesExecuted + 1
      }));
      
      // Show notification
      addNotification(`Bought ${buyIncrement} ${asset} for ${formatCurrency(buyPrice)}`, 'success');
      
      // Check achievements
      checkAchievements();
    } else {
      addNotification(`Not enough cash to buy ${asset}`, 'error');
    }
  };
  
  // Sell asset handler with improved quantity control
  const handleSell = (asset) => {
    // For crypto, allow fractional sales (0.01 units)
    let sellIncrement = 1;
    let sellPrice = assetPrices[asset];
    
    if (asset === 'crypto') {
      sellIncrement = 0.01;
      sellPrice = assetPrices[asset] * sellIncrement;
    }
    
    if (assetQuantities[asset] >= sellIncrement) {
      const previousValue = calculatePortfolioValue();
      
      // Update asset quantities
      setAssetQuantities(prev => ({
        ...prev,
        [asset]: prev[asset] - sellIncrement
      }));
      
      // Update cash
      setPortfolio(prev => ({
        ...prev,
        cash: prev.cash + sellPrice
      }));
      
      // Calculate if trade was profitable
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
      addNotification(`Sold ${sellIncrement} ${asset} for ${formatCurrency(sellPrice)}`, 'success');
      
      // Check for first profit achievement
      if (isProfit && !achievements.firstProfit.unlocked) {
        unlockAchievement('firstProfit');
      }
    } else {
      addNotification(`Not enough ${asset} to sell`, 'error');
    }
  };
  
  // Start game
  const startGame = () => {
    setGameScreen('game');
    initializeGame();
    setTimer(60);
    setPaused(false);
    startGameTimer();
    startMarketUpdates();
    generateNews();
    
    // Intro notification
    setTimeout(() => {
      addNotification(`Welcome to ${gameModeSettings[gameMode].name}!`, 'info');
    }, 500);
    
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
    
    const updateInterval = difficultySettings[difficulty].updateInterval;
    setMarketUpdateCountdown(updateInterval);
    
    marketUpdateRef.current = setInterval(() => {
      setMarketUpdateCountdown(prev => {
        if (prev <= 1) {
          updateMarketPrices();
          return updateInterval;
        }
        return prev - 1;
      });
    }, 1000);
  };
  
  // Pause/resume game
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
  
  // Generate a news event
  const generateNews = () => {
    const newsEvents = [
      {
        title: "COMPANY X REPORTS STRONG EARNINGS!",
        message: "The stock price of Company X jumps after they announce better-than-expected quarterly earnings.",
        tip: "Positive news will usually cause a stock to rise.",
        impact: { stocks: 1.15, gold: 0.98, crypto: 1.05, bonds: 0.97 }
      },
      {
        title: "INTEREST RATES INCREASE!",
        message: "The central bank has increased interest rates by 0.5%.",
        tip: "Higher interest rates often hurt stocks but can help bonds.",
        impact: { stocks: 0.92, gold: 1.03, crypto: 0.88, bonds: 1.08 }
      },
      {
        title: "CRYPTOCURRENCY REGULATION ANNOUNCED",
        message: "Government announces new cryptocurrency regulations.",
        tip: "Regulations can cause short-term volatility in crypto markets.",
        impact: { stocks: 1.01, gold: 1.05, crypto: 0.78, bonds: 1.02 }
      },
      {
        title: "GOLD RESERVES DISCOVERED",
        message: "Large gold reserves discovered in remote region.",
        tip: "Increased supply can lower gold prices temporarily.",
        impact: { stocks: 1.03, gold: 0.85, crypto: 1.02, bonds: 0.99 }
      },
      {
        title: "NEW SMARTPHONE MODEL IS A HIT!",
        message: "The latest smartphone release has broken sales records.",
        tip: "Successful tech products often boost the stock market.",
        impact: { stocks: 1.12, gold: 0.97, crypto: 1.04, bonds: 0.98 }
      },
      {
        title: "GLOBAL ECONOMIC UNCERTAINTY RISES",
        message: "Geopolitical tensions are causing uncertainty in global markets.",
        tip: "Uncertainty often drives investors to safe-haven assets like gold.",
        impact: { stocks: 0.93, gold: 1.12, crypto: 0.95, bonds: 1.04 }
      },
      {
        title: "TECH COMPANY ANNOUNCES LAYOFFS",
        message: "Major tech company announces significant workforce reduction.",
        tip: "Cost-cutting can sometimes boost stock prices in the short term.",
        impact: { stocks: 1.06, gold: 1.01, crypto: 0.97, bonds: 1.01 }
      },
      {
        title: "HOUSING MARKET COOLING DOWN",
        message: "Real estate prices show signs of stabilizing after years of growth.",
        tip: "A cooling housing market can affect various asset classes differently.",
        impact: { stocks: 0.98, gold: 1.02, crypto: 0.99, bonds: 1.03 }
      }
    ];
    
    // Special events based on game mode
    if (gameMode === 'crisis' && Math.random() < 0.4) {
      newsEvents.push({
        title: "FINANCIAL CRISIS DEEPENS",
        message: "Markets in turmoil as banking sector faces liquidity challenges.",
        tip: "During financial crises, diversification can help protect your portfolio.",
        impact: { stocks: 0.82, gold: 1.18, crypto: 0.75, bonds: 0.92 }
      });
    }
    
    if (gameMode === 'challenge' && Math.random() < 0.4) {
      newsEvents.push({
        title: "BULL MARKET ACCELERATES",
        message: "Investor confidence soars as markets reach new all-time highs.",
        tip: "Bull markets can create opportunities, but be wary of overvaluation.",
        impact: { stocks: 1.20, gold: 0.95, crypto: 1.25, bonds: 0.92 }
      });
    }
    
    // Check for market crash (low probability random event)
    const crashProbability = difficultySettings[difficulty].marketCrashProbability;
    if (Math.random() < crashProbability) {
      const crash = {
        title: "MARKET CRASH ALERT!",
        message: "Markets are in freefall as panic selling takes hold!",
        tip: "Market crashes can present buying opportunities for the patient investor.",
        impact: { stocks: 0.70, gold: 1.15, crypto: 0.65, bonds: 0.85 }
      };
      
      setShowMarketAlert(true);
      setMarketAlert({
        title: "MARKET CRASH!",
        message: "Widespread selling pressure across markets. Brace for volatility!"
      });
      
      setGameStats(prev => ({
        ...prev,
        marketCrashesWeathered: prev.marketCrashesWeathered + 1
      }));
      
      const randomNews = crash;
      setNewsPopup(randomNews);
      setCurrentNews({
        message: randomNews.title,
        impact: randomNews.impact
      });
      
      updateMarketPrices(randomNews.impact);
      
      setTimeout(() => {
        setShowNewsPopup(true);
      }, 2000);
      
      return;
    }
    
    // Normal news event selection
    const randomNews = newsEvents[Math.floor(Math.random() * newsEvents.length)];
    
    setNewsPopup(randomNews);
    setCurrentNews({
      message: randomNews.title,
      impact: randomNews.impact
    });
    
    setShowNewsPopup(true);
    
    // Apply market effects with a delay to give player time to react
    setTimeout(() => {
      updateMarketPrices(randomNews.impact);
    }, 4000);
  };
  
  // Update market prices based on trends and news impact
  const updateMarketPrices = (newsImpact = null) => {
    // Create updated prices
    const updatedPrices = { ...assetPrices };
    const updatedPriceHistory = { ...priceHistory };
    const updatedTrends = { ...assetTrends };
    
    // Process each asset
    Object.keys(updatedPrices).forEach(asset => {
      let changePercent = 0;
      
      // Apply news impact if provided
      if (newsImpact) {
        changePercent = (newsImpact[asset] - 1) * 100;
        updatedPrices[asset] = Math.round(updatedPrices[asset] * newsImpact[asset]);
        
        // Update trend based on news impact
        if (newsImpact[asset] > 1.02) {
          updatedTrends[asset] = { direction: 'up', strength: Math.min(3, Math.ceil((newsImpact[asset] - 1) * 20)) };
        } else if (newsImpact[asset] < 0.98) {
          updatedTrends[asset] = { direction: 'down', strength: Math.min(3, Math.ceil((1 - newsImpact[asset]) * 20)) };
        } else {
          // Small change - maintain current trend but with lower strength
          updatedTrends[asset] = { 
            direction: updatedTrends[asset].direction, 
            strength: Math.max(1, updatedTrends[asset].strength - 1) 
          };
        }
      } else {
        // Regular market movement based on trends and volatility
        const trendDirection = updatedTrends[asset].direction === 'up' ? 1 : -1;
        const trendStrength = updatedTrends[asset].strength;
        const baseChange = trendDirection * trendStrength * assetVolatility[asset] * 100;
        
        // Add random noise to price movement
        const noise = (Math.random() - 0.5) * assetVolatility[asset] * 100;
        changePercent = baseChange + noise;
        
        // Calculate new price
        const newPrice = updatedPrices[asset] * (1 + changePercent/100);
        updatedPrices[asset] = Math.round(newPrice);
        
        // Small chance to reverse trend
        if (Math.random() < 0.15) {
          updatedTrends[asset] = { 
            direction: updatedTrends[asset].direction === 'up' ? 'down' : 'up',
            strength: Math.floor(Math.random() * 3) + 1
          };
        }
        
        // Small chance to increase/decrease trend strength
        if (Math.random() < 0.3) {
          const strengthChange = Math.random() < 0.5 ? 1 : -1;
          const newStrength = updatedTrends[asset].strength + strengthChange;
          if (newStrength >= 1 && newStrength <= 3) {
            updatedTrends[asset].strength = newStrength;
          }
        }
      }
      
      // Prevent prices from going too low
      updatedPrices[asset] = Math.max(1, updatedPrices[asset]);
      
      // Update price history
      updatedPriceHistory[asset] = [...updatedPriceHistory[asset], updatedPrices[asset]];
      if (updatedPriceHistory[asset].length > 10) {
        updatedPriceHistory[asset].shift();
      }
    });
    
    // Update state
    setAssetPrices(updatedPrices);
    setPriceHistory(updatedPriceHistory);
    setAssetTrends(updatedTrends);
  };
  
  // Handle end of round
  const handleEndOfRound = () => {
    // Increase round number
    setRound(prev => prev + 1);
    
    // Restart timers
    startGameTimer();
    startMarketUpdates();
    
    // Generate news for next round
    generateNews();
    
    // Check achievements at end of round
    checkAchievements();
    
    addNotification(`Round ${round} completed. Starting round ${round + 1}!`, 'info');
  };
  
  // Handle end of game
  const handleEndGame = () => {
    const finalValue = calculatePortfolioValue();
    const returnPercentage = ((finalValue - difficultySettings[difficulty].startingCash) / difficultySettings[difficulty].startingCash) * 100;
    
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
    
    if (finalValue >= 15000 && !achievements.wealthyInvestor.unlocked) {
      unlockAchievement('wealthyInvestor');
    }
    
    if (gameStats.marketCrashesWeathered > 0 && returnPercentage > 0 && !achievements.marketCrash.unlocked) {
      unlockAchievement('marketCrash');
    }
    
    // Clear timers
    clearInterval(gameTimerRef.current);
    clearInterval(marketUpdateRef.current);
    
    // Show game results screen
    setGameScreen('results');
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
  
  // Add notification
  const addNotification = (message, type = 'info') => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, message, type }]);
    
    // Auto remove notification after 5 seconds
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 5000);
  };
  
  // Format time display (mm:ss)
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  // Toggle settings
  const toggleSetting = (setting) => {
    setSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (gameTimerRef.current) clearInterval(gameTimerRef.current);
      if (marketUpdateRef.current) clearInterval(marketUpdateRef.current);
    };
  }, []);
  
  // Render trend indicators
  const renderTrendIndicator = (asset) => {
    const trend = assetTrends[asset];
    const direction = trend.direction;
    const strength = trend.strength;
    
    return (
      <div className="flex">
        {direction === 'up' ? (
          Array(strength).fill(0).map((_, i) => (
            <ArrowUp key={i} className="text-green-500" size={16} />
          ))
        ) : (
          Array(strength).fill(0).map((_, i) => (
            <ArrowDown key={i} className="text-red-500" size={16} />
          ))
        )}
      </div>
    );
  };
  
  // Render price history mini chart
  const renderMiniChart = (asset) => {
    const history = priceHistory[asset].slice(-5);
    const max = Math.max(...history);
    const min = Math.min(...history);
    const range = max - min || 1;
    
    return (
      <div className="flex items-end h-6 space-x-1">
        {history.map((price, i) => {
          const height = ((price - min) / range) * 100;
          const color = i === history.length - 1 
            ? (price >= history[i-1] ? 'bg-green-500' : 'bg-red-500')
            : (price >= (history[i-1] || price) ? 'bg-green-300' : 'bg-red-300');
          
          return (
            <div 
              key={i} 
              className={`w-1 ${color}`} 
              style={{ height: `${Math.max(10, height)}%` }}
            ></div>
          );
        })}
      </div>
    );
  };
  
  // Render portfolio composition chart
  const renderPortfolioComposition = () => {
    const total = calculatePortfolioValue();
    const composition = {
      cash: (portfolio.cash / total) * 100,
      stocks: (assetQuantities.stocks * assetPrices.stocks / total) * 100,
      gold: (assetQuantities.gold * assetPrices.gold / total) * 100,
      crypto: (assetQuantities.crypto * assetPrices.crypto / total) * 100,
      bonds: (assetQuantities.bonds * assetPrices.bonds / total) * 100
    };
    
    let currentPosition = 0;
    
    return (
      <div className="mt-2">
        <div className="text-sm font-bold mb-1">Portfolio Allocation</div>
        <div className="flex h-6 rounded-lg overflow-hidden">
          {Object.entries(composition).map(([asset, percentage]) => {
            if (percentage < 1) return null;
            
            const color = asset === 'cash' ? 'bg-gray-400' :
                         asset === 'stocks' ? 'bg-blue-500' :
                         asset === 'gold' ? 'bg-yellow-500' :
                         asset === 'crypto' ? 'bg-purple-500' :
                         'bg-green-500';
            
            const width = `${percentage}%`;
            const result = (
              <div 
                key={asset}
                className={`${color} h-full`}
                style={{ width }}
                title={`${asset}: ${percentage.toFixed(1)}%`}
              ></div>
            );
            
            currentPosition += percentage;
            return result;
          })}
        </div>
        <div className="flex justify-between text-xs mt-1">
          {Object.entries(composition).map(([asset, percentage]) => {
            if (percentage < 5) return null;
            return (
              <div key={asset} className="flex items-center">
                <div className={`w-2 h-2 rounded-full mr-1 ${
                  asset === 'cash' ? 'bg-gray-400' :
                  asset === 'stocks' ? 'bg-blue-500' :
                  asset === 'gold' ? 'bg-yellow-500' :
                  asset === 'crypto' ? 'bg-purple-500' :
                  'bg-green-500'
                }`}></div>
                <span>{asset}: {percentage.toFixed(1)}%</span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };
  
  // Render main menu screen
  const renderMainMenu = () => (
    <div className="h-screen flex flex-col items-center justify-center bg-teal-600 p-4">
      <h1 className="text-7xl font-bold text-white mb-4">PORTFOLIO</h1>
      <h1 className="text-7xl font-bold text-yellow-400 mb-16">PANIC!</h1>
      
      <div className="flex flex-col space-y-4 w-full max-w-md">
        <button 
          onClick={() => startGame()}
          className="bg-gray-800 text-white py-6 px-8 rounded-lg text-3xl font-bold"
        >
          START GAME
        </button>
        
        <button 
          onClick={() => setGameScreen('instructions')}
          className="bg-gray-800 text-white py-6 px-8 rounded-lg text-3xl font-bold"
        >
          INSTRUCTIONS
        </button>
        
        <button 
          onClick={() => setGameScreen('assetInfo')}
          className="bg-gray-800 text-white py-6 px-8 rounded-lg text-3xl font-bold"
        >
          ASSET INFO
        </button>
      </div>
      
      <div className="mt-8 w-full max-w-md">
        <div className="flex justify-between mb-4">
          <div className="w-1/2 pr-2">
            <p className="text-white mb-2 font-bold">Difficulty:</p>
            <select 
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="w-full p-2 bg-gray-800 text-white rounded-lg border border-gray-700"
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
              className="w-full p-2 bg-gray-800 text-white rounded-lg border border-gray-700"
            >
              <option value="standard">Standard</option>
              <option value="crisis">Financial Crisis</option>
              <option value="challenge">Bull Run Challenge</option>
            </select>
          </div>
        </div>
        <p className="text-white text-sm italic">{gameModeSettings[gameMode].description}</p>
      </div>
      
      <div className="mt-8 flex space-x-4">
        <button 
          onClick={() => setGameScreen('settings')}
          className="bg-gray-700 text-white p-3 rounded-lg"
          aria-label="Settings"
        >
          <Settings size={24} />
        </button>
        <button 
          onClick={() => setGameScreen('achievements')}
          className="bg-gray-700 text-white p-3 rounded-lg"
          aria-label="Achievements"
        >
          <Award size={24} />
        </button>
      </div>
    </div>
  );
  
  // Render game screen
  const renderGameScreen = () => (
    <div className="h-screen flex flex-col bg-teal-600 p-4">
      {/* Header */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-gray-800 text-white p-4 rounded-lg flex items-center justify-between">
          <span className="text-4xl font-bold">{formatCurrency(calculatePortfolioValue())}</span>
          <div className="flex items-center space-x-1 text-xs">
            <span className="text-gray-400">Round:</span>
            <span className="font-bold">{round}/{totalRounds}</span>
          </div>
        </div>
        
        <div className="bg-gray-800 text-white p-4 rounded-lg flex items-center justify-between">
          <div className="flex items-center">
            <span className="text-xl font-bold mr-2">TIME:</span>
            <span className="text-4xl font-bold">{formatTime(timer)}</span>
          </div>
          <div className="flex items-center space-x-1 text-xs">
            <span className="text-gray-400">Next update:</span>
            <span className="font-bold">{marketUpdateCountdown}s</span>
          </div>
        </div>
      </div>
      
      {/* Tabs */}
      <div className="bg-gray-800 text-white rounded-lg mb-4">
        <div className="flex">
          <button 
            className={`py-2 px-4 font-bold ${selectedTab === 'portfolio' ? 'border-b-2 border-yellow-400' : ''}`}
            onClick={() => setSelectedTab('portfolio')}
          >
            Portfolio
          </button>
          <button 
            className={`py-2 px-4 font-bold ${selectedTab === 'market' ? 'border-b-2 border-yellow-400' : ''}`}
            onClick={() => setSelectedTab('market')}
          >
            Market
          </button>
          <button 
            className={`py-2 px-4 font-bold ${selectedTab === 'analysis' ? 'border-b-2 border-yellow-400' : ''}`}
            onClick={() => setSelectedTab('analysis')}
          >
            Analysis
          </button>
        </div>
      </div>
      
      {/* Tab Content */}
      {selectedTab === 'portfolio' && (
        <div className="grid grid-cols-2 gap-4 mb-auto">
          {/* Cash Display */}
          <div className="bg-gray-800 text-white p-4 rounded-lg">
            <h3 className="text-2xl font-bold mb-2">CASH</h3>
            <p className="text-4xl font-bold mb-4">{formatCurrency(portfolio.cash)}</p>
            <p className="text-sm text-gray-400">Available for purchases</p>
          </div>
          
          {/* Holdings Summary */}
          <div className="bg-gray-800 text-white p-4 rounded-lg">
            <h3 className="text-2xl font-bold mb-2">HOLDINGS</h3>
            <div className="space-y-1">
              {Object.entries(assetQuantities).map(([asset, quantity]) => (
                quantity > 0 && (
                  <div key={asset} className="flex justify-between items-center">
                    <span className="capitalize">{asset}:</span>
                    <span className="font-bold">{asset === 'crypto' ? quantity.toFixed(2) : quantity}</span>
                  </div>
                )
              ))}
              {Object.values(assetQuantities).every(q => q === 0) && (
                <p className="text-gray-400">No assets in portfolio</p>
              )}
            </div>
            {renderPortfolioComposition()}
          </div>
          
          {/* Stocks */}
          <div className="bg-gray-800 text-white p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-2xl font-bold">STOCKS</h3>
              {renderTrendIndicator('stocks')}
            </div>
            <div className="flex justify-between items-center mb-2">
              <p className="text-4xl font-bold">${assetPrices.stocks}</p>
              <div className="text-xs">
                <div>Owned: {assetQuantities.stocks}</div>
                <div>Value: {formatCurrency(assetQuantities.stocks * assetPrices.stocks)}</div>
              </div>
            </div>
            {renderMiniChart('stocks')}
            <div className="grid grid-cols-2 gap-2 mt-4">
              <button 
                onClick={() => handleBuy('stocks')}
                className="bg-blue-600 text-white py-2 px-4 rounded-lg font-bold"
              >
                BUY
              </button>
              <button 
                onClick={() => handleSell('stocks')}
                className="bg-blue-600 text-white py-2 px-4 rounded-lg font-bold"
                disabled={assetQuantities.stocks <= 0}
              >
                SELL
              </button>
            </div>
          </div>
          
          {/* Gold */}
          <div className="bg-gray-800 text-white p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-2xl font-bold">GOLD</h3>
              {renderTrendIndicator('gold')}
            </div>
            <div className="flex justify-between items-center mb-2">
              <p className="text-4xl font-bold">{assetPrices.gold}</p>
              <div className="text-xs">
                <div>Owned: {assetQuantities.gold}</div>
                <div>Value: {formatCurrency(assetQuantities.gold * assetPrices.gold)}</div>
              </div>
            </div>
            {renderMiniChart('gold')}
            <div className="grid grid-cols-2 gap-2 mt-4">
              <button 
                onClick={() => handleBuy('gold')}
                className="bg-blue-600 text-white py-2 px-4 rounded-lg font-bold"
              >
                BUY
              </button>
              <button 
                onClick={() => handleSell('gold')}
                className="bg-blue-600 text-white py-2 px-4 rounded-lg font-bold"
                disabled={assetQuantities.gold <= 0}
              >
                SELL
              </button>
            </div>
          </div>
          
          {/* Crypto */}
          <div className="bg-gray-800 text-white p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-2xl font-bold">CRYPTO</h3>
              {renderTrendIndicator('crypto')}
            </div>
            <div className="flex justify-between items-center mb-2">
              <p className="text-4xl font-bold">${assetPrices.crypto}</p>
              <div className="text-xs">
                <div>Owned: {assetQuantities.crypto.toFixed(2)}</div>
                <div>Value: {formatCurrency(assetQuantities.crypto * assetPrices.crypto)}</div>
              </div>
            </div>
            {renderMiniChart('crypto')}
            <div className="grid grid-cols-2 gap-2 mt-4">
              <button 
                onClick={() => handleBuy('crypto')}
                className="bg-blue-600 text-white py-2 px-4 rounded-lg font-bold"
              >
                BUY
              </button>
              <button 
                onClick={() => handleSell('crypto')}
                className="bg-blue-600 text-white py-2 px-4 rounded-lg font-bold"
                disabled={assetQuantities.crypto <= 0}
              >
                SELL
              </button>
            </div>
          </div>
          
          {/* Bonds */}
          <div className="bg-gray-800 text-white p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-2xl font-bold">BONDS</h3>
              {renderTrendIndicator('bonds')}
            </div>
            <div className="flex justify-between items-center mb-2">
              <p className="text-4xl font-bold">${assetPrices.bonds}</p>
              <div className="text-xs">
                <div>Owned: {assetQuantities.bonds}</div>
                <div>Value: {formatCurrency(assetQuantities.bonds * assetPrices.bonds)}</div>
              </div>
            </div>
            {renderMiniChart('bonds')}
            <div className="grid grid-cols-2 gap-2 mt-4">
              <button 
                onClick={() => handleBuy('bonds')}
                className="bg-blue-600 text-white py-2 px-4 rounded-lg font-bold"
              >
                BUY
              </button>
              <button 
                onClick={() => handleSell('bonds')}
                className="bg-blue-600 text-white py-2 px-4 rounded-lg font-bold"
                disabled={assetQuantities.bonds <= 0}
              >
                SELL
              </button>
            </div>
          </div>
        </div>
      )}
      
      {selectedTab === 'market' && (
        <div className="bg-gray-800 text-white p-4 rounded-lg mb-auto">
          <h3 className="text-2xl font-bold mb-4">Market Overview</h3>
          
          <div className="grid grid-cols-4 gap-4 mb-4">
            {Object.entries(assetPrices).map(([asset, price]) => (
              <div key={asset} className="border border-gray-700 p-3 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="capitalize font-bold">{asset}</span>
                  {renderTrendIndicator(asset)}
                </div>
                <div className="text-2xl font-bold">
                  ${asset === 'gold' ? '' : '$'}{price}
                </div>
                {renderMiniChart(asset)}
              </div>
            ))}
          </div>
          
          <h3 className="text-xl font-bold mb-3">Recent News</h3>
          <div className="border border-gray-700 p-3 rounded-lg">
            <div className="text-lg font-bold mb-1">{currentNews.message}</div>
            <div className="text-sm text-gray-400 mb-3">Impact Analysis:</div>
            
            <div className="grid grid-cols-4 gap-2">
              {Object.entries(currentNews.impact || {}).map(([asset, impact]) => (
                <div key={asset} className="flex flex-col items-center">
                  <div className="capitalize mb-1">{asset}</div>
                  <div className={`rounded-full px-2 py-1 text-xs font-bold ${
                    impact > 1 ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'
                  }`}>
                    {impact > 1 ? '+' : ''}{((impact - 1) * 100).toFixed(1)}%
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      
      {selectedTab === 'analysis' && (
        <div className="bg-gray-800 text-white p-4 rounded-lg mb-auto">
          <h3 className="text-2xl font-bold mb-4">Portfolio Analysis</h3>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="border border-gray-700 p-3 rounded-lg">
              <h4 className="text-lg font-bold mb-2">Current Value</h4>
              <div className="text-3xl font-bold">{formatCurrency(calculatePortfolioValue())}</div>
              <div className="text-sm text-gray-400 mt-1">
                Starting: {formatCurrency(difficultySettings[difficulty].startingCash)}
              </div>
              <div className="mt-2">
                <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${calculatePortfolioValue() >= difficultySettings[difficulty].startingCash ? 'bg-green-500' : 'bg-red-500'}`}
                    style={{ width: `${Math.min(100, Math.max(0, (calculatePortfolioValue() / difficultySettings[difficulty].startingCash) * 100))}%` }}
                  ></div>
                </div>
                <div className="text-sm mt-1">
                  {calculatePortfolioValue() >= difficultySettings[difficulty].startingCash ? (
                    <span className="text-green-500">
                      +{(((calculatePortfolioValue() - difficultySettings[difficulty].startingCash) / difficultySettings[difficulty].startingCash) * 100).toFixed(1)}%
                    </span>
                  ) : (
                    <span className="text-red-500">
                      {(((calculatePortfolioValue() - difficultySettings[difficulty].startingCash) / difficultySettings[difficulty].startingCash) * 100).toFixed(1)}%
                    </span>
                  )}
                </div>
              </div>
            </div>
            
            <div className="border border-gray-700 p-3 rounded-lg">
              <h4 className="text-lg font-bold mb-2">Trading Stats</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Trades:</span>
                  <span className="font-bold">{gameStats.tradesExecuted}</span>
                </div>
                <div className="flex justify-between">
                  <span>Profitable Trades:</span>
                  <span className="font-bold">{gameStats.profitableTrades}</span>
                </div>
                <div className="flex justify-between">
                  <span>Win Rate:</span>
                  <span className="font-bold">
                    {gameStats.tradesExecuted > 0 
                      ? `${((gameStats.profitableTrades / gameStats.tradesExecuted) * 100).toFixed(1)}%` 
                      : '0%'
                    }
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Market Crashes:</span>
                  <span className="font-bold">{gameStats.marketCrashesWeathered}</span>
                </div>
              </div>
            </div>
          </div>
          
          {renderPortfolioComposition()}
          
          <h4 className="text-lg font-bold mt-4 mb-2">Risk Analysis</h4>
          <div className="grid grid-cols-4 gap-2">
            {Object.entries(assetVolatility).map(([asset, volatility]) => (
              <div key={asset} className="border border-gray-700 p-2 rounded-lg">
                <div className="capitalize text-sm mb-1">{asset}</div>
                <div className="flex items-center space-x-1">
                  <div className="w-full bg-gray-700 h-2 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${
                        volatility < 0.06 ? 'bg-green-500' :
                        volatility < 0.10 ? 'bg-yellow-500' :
                        'bg-red-500'
                      }`}
                      style={{ width: `${Math.min(100, volatility * 500)}%` }}
                    ></div>
                  </div>
                  <span className="text-xs">{(volatility * 100).toFixed(0)}%</span>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-4">
            {Object.entries(achievements).filter(([_, ach]) => ach.unlocked).length > 0 ? (
              <div>
                <h4 className="text-lg font-bold mb-2">Unlocked Achievements</h4>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(achievements).map(([id, ach]) => (
                    ach.unlocked && (
                      <div key={id} className="bg-yellow-800 text-yellow-200 px-2 py-1 rounded-lg text-xs font-bold">
                        {ach.title}
                      </div>
                    )
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-sm text-gray-400">
                No achievements unlocked yet. Keep playing to earn achievements!
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* News Ticker */}
      <div className="bg-gray-800 text-white p-4 rounded-lg mb-4">
        <p className="text-lg font-bold">{currentNews.message}</p>
      </div>
      
      {/* Game Controls */}
      <div className="flex justify-between bg-gray-800 text-white p-4 rounded-lg">
        <button 
          onClick={() => setGameScreen('menu')}
          className="bg-red-600 text-white py-2 px-4 rounded-lg font-bold"
        >
          END GAME
        </button>
        
        <h2 className="text-2xl font-bold text-center hidden md:block">
          <span className="text-white">PORTFOLIO</span> <span className="text-yellow-400">PANIC</span>
        </h2>
        
        <button 
          onClick={togglePause}
          className={`${paused ? 'bg-green-600' : 'bg-yellow-600'} text-white py-2 px-4 rounded-lg font-bold`}
        >
          {paused ? 'RESUME' : 'PAUSE'}
        </button>
      </div>
      
      {/* Notifications */}
      <div className="fixed bottom-4 right-4 space-y-2 max-w-xs z-20">
        {notifications.map(notification => (
          <div 
            key={notification.id}
            className={`p-3 rounded-lg shadow-lg text-white animate-fade-in ${
              notification.type === 'success' ? 'bg-green-600' :
              notification.type === 'error' ? 'bg-red-600' :
              notification.type === 'achievement' ? 'bg-yellow-600' :
              'bg-blue-600'
            }`}
          >
            {notification.message}
          </div>
        ))}
      </div>
      
      {/* News Popup */}
      {showNewsPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-30">
          <div className="bg-gray-800 text-white p-6 rounded-lg max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4">{newsPopup.title}</h2>
            <p className="mb-4">{newsPopup.message}</p>
            <p className="text-yellow-400 mb-6">TIP: {newsPopup.tip}</p>
            <button 
              onClick={() => {
                setShowNewsPopup(false);
                // Mark tutorial as complete if it was shown
                if (!settings.tutorialComplete && newsPopup.title === "WELCOME TO PORTFOLIO PANIC!") {
                  setSettings(prev => ({ ...prev, tutorialComplete: true }));
                }
              }}
              className="bg-gray-300 text-gray-800 py-2 px-8 rounded-lg font-bold"
            >
              OK
            </button>
          </div>
        </div>
      )}
      
      {/* Market Alert Popup */}
      {showMarketAlert && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-40">
          <div className="bg-red-900 text-white p-6 rounded-lg max-w-md w-full border-2 border-red-700">
            <div className="flex items-center mb-4">
              <AlertTriangle className="text-red-500 mr-2" size={28} />
              <h2 className="text-2xl font-bold">{marketAlert.title}</h2>
            </div>
            <p className="mb-6">{marketAlert.message}</p>
            <button 
              onClick={() => setShowMarketAlert(false)}
              className="bg-red-700 text-white py-2 px-8 rounded-lg font-bold w-full"
            >
              BRACE FOR IMPACT
            </button>
          </div>
        </div>
      )}
    </div>
  );
  
  // Render results screen
  const renderResultsScreen = () => (
    <div className="h-screen flex flex-col items-center justify-center bg-teal-600 p-4">
      <div className="bg-gray-800 text-white p-8 rounded-lg w-full max-w-md mb-8">
        <h2 className="text-4xl font-bold mb-8 text-center">RESULTS</h2>
        
        <div className="mb-6">
          <h3 className="text-2xl font-bold mb-2">FINAL VALUE</h3>
          <p className="text-5xl font-bold">{formatCurrency(gameResult.finalValue)}</p>
        </div>
        
        <div className="mb-6">
          <h3 className="text-2xl font-bold mb-2">RETURN:</h3>
          <p className={`text-5xl font-bold ${gameResult.returnPercentage >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            {gameResult.returnPercentage >= 0 ? '+' : ''}{gameResult.returnPercentage.toFixed(1)}%
          </p>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <h4 className="text-lg font-bold mb-1">Best Asset</h4>
            <p className="capitalize">{gameResult.bestAsset}</p>
            {gameResult.bestReturn && (
              <p className="text-green-500">+{gameResult.bestReturn.toFixed(1)}%</p>
            )}
          </div>
          
          <div>
            <h4 className="text-lg font-bold mb-1">Worst Asset</h4>
            <p className="capitalize">{gameResult.worstAsset}</p>
            {gameResult.worstReturn && (
              <p className="text-red-500">{gameResult.worstReturn.toFixed(1)}%</p>
            )}
          </div>
        </div>
        
        <div className="mb-8">
          <h4 className="text-lg font-bold mb-2">Trading Stats</h4>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>Trades Executed:</div>
            <div className="font-bold text-right">{gameStats.tradesExecuted}</div>
            
            <div>Profitable Trades:</div>
            <div className="font-bold text-right">{gameStats.profitableTrades}</div>
            
            <div>Win Rate:</div>
            <div className="font-bold text-right">
              {gameStats.tradesExecuted > 0 
                ? `${((gameStats.profitableTrades / gameStats.tradesExecuted) * 100).toFixed(1)}%` 
                : '0%'
              }
            </div>
            
            <div>Market Crashes:</div>
            <div className="font-bold text-right">{gameStats.marketCrashesWeathered}</div>
          </div>
        </div>
        
        <p className="text-xl mb-8">
          {gameResult.returnPercentage >= 15 
            ? "Outstanding! You've mastered the market and achieved excellent returns." 
            : gameResult.returnPercentage >= 5
            ? "Great job! You navigated the market volatility and grew your investment portfolio."
            : gameResult.returnPercentage >= 0
            ? "Well done! You managed to achieve a positive return in challenging conditions."
            : "Markets can be challenging. Keep learning and try different strategies next time."}
        </p>
        
        <div className="grid grid-cols-2 gap-4">
          <button 
            onClick={() => setGameScreen('menu')}
            className="bg-blue-600 text-white py-3 px-8 rounded-lg font-bold"
          >
            MAIN MENU
          </button>
          <button 
            onClick={() => {
              setGameScreen('game');
              startGame();
            }}
            className="bg-green-600 text-white py-3 px-8 rounded-lg font-bold"
          >
            PLAY AGAIN
          </button>
        </div>
      </div>
      
      <div className="bg-gray-800 text-white p-4 rounded-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center">
          <span className="text-white">PORTFOLIO</span> <span className="text-yellow-400">PANIC</span>
        </h2>
      </div>
    </div>
  );
  
  // Render instructions screen
  const renderInstructionsScreen = () => (
    <div className="h-screen flex flex-col items-center justify-center bg-teal-600 p-4">
      <div className="bg-gray-800 text-white p-8 rounded-lg w-full max-w-md mb-8">
        <div className="flex items-center mb-6">
          <button 
            onClick={() => setGameScreen('menu')}
            className="bg-gray-700 text-white p-2 rounded-lg mr-3"
          >
            <ArrowLeft size={20} />
          </button>
          <h2 className="text-4xl font-bold text-center flex-1">INSTRUCTIONS</h2>
        </div>
        
        <p className="text-2xl font-bold mb-6 text-center">
          INVEST IN STOCKS, BONDS, AND REAL ESTATE
        </p>
        
        <p className="text-2xl font-bold mb-6 text-center">
          WATCH OUT FOR MARKET EVENTS THAT IMPACT PRICES
        </p>
        
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-gray-700 p-4 rounded-lg flex items-center justify-center">
            <div className="bg-yellow-400 h-16 w-4"></div>
            <div className="bg-yellow-400 h-12 w-4 ml-2"></div>
            <div className="bg-yellow-400 h-8 w-4 ml-2"></div>
            <div className="bg-yellow-400 h-20 w-4 ml-2"></div>
          </div>
          
          <div className="bg-gray-700 p-4 rounded-lg flex items-center justify-center">
            <div className="bg-green-500 p-4 rounded-sm flex items-center justify-center">
              <span className="text-3xl">$</span>
            </div>
          </div>
          
          <div className="bg-gray-700 p-4 rounded-lg flex items-center justify-center">
            <div className="w-16 h-16">
              <div className="bg-yellow-800 w-16 h-8"></div>
              <div className="bg-yellow-600 w-16 h-8 relative">
                <div className="absolute top-1 left-3 w-3 h-3 bg-gray-700 rounded-full"></div>
                <div className="absolute top-1 right-3 w-3 h-3 bg-gray-700 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="space-y-4 mb-8">
          <div className="bg-gray-700 p-4 rounded-lg">
            <h3 className="text-xl font-bold mb-2">Game Objective</h3>
            <p className="text-sm">
              Maximize your portfolio value by buying assets when they're low and selling when they're high. 
              React to market news and events that impact asset prices.
            </p>
          </div>
          
          <div className="bg-gray-700 p-4 rounded-lg">
            <h3 className="text-xl font-bold mb-2">Market Indicators</h3>
            <p className="text-sm mb-2">
              Look for trend indicators (up or down arrows) to understand current market direction.
              The number of arrows indicates the strength of the trend.
            </p>
            <div className="flex items-center">
              <div className="flex mr-3">
                <ArrowUp className="text-green-500" size={16} />
                <ArrowUp className="text-green-500" size={16} />
              </div>
              <span className="text-sm">= Strong upward trend</span>
            </div>
            <div className="flex items-center">
              <div className="flex mr-3">
                <ArrowDown className="text-red-500" size={16} />
              </div>
              <span className="text-sm">= Weak downward trend</span>
            </div>
          </div>
          
          <div className="bg-gray-700 p-4 rounded-lg">
            <h3 className="text-xl font-bold mb-2">Market Events</h3>
            <p className="text-sm">
              News events will periodically impact the market. Pay attention to these events
              and adjust your portfolio accordingly. Some events may cause market-wide changes,
              while others affect specific assets.
            </p>
          </div>
          
          <div className="bg-gray-700 p-4 rounded-lg">
            <h3 className="text-xl font-bold mb-2">Achievements</h3>
            <p className="text-sm">
              Unlock achievements by reaching certain milestones,
