import React, { useState, useEffect, useRef } from 'react';
import { Coins, ArrowUp, ArrowDown, AlertCircle, Clock, DollarSign, Award, RefreshCcw, Play, Pause, TrendingUp, TrendingDown, BarChart2, Briefcase, Zap, Activity, Gift, Check, X, MessageCircle, ChevronRight, ChevronLeft, Sun, Moon, FileText, Settings, ChevronDown, Bell, HelpCircle, Target } from 'lucide-react';

const PortfolioPanicGame = () => {
  // Game states
  const [gameActive, setGameActive] = useState(false);
  const [paused, setPaused] = useState(false);
  const [score, setScore] = useState(10000); // Starting with $10,000
  const [round, setRound] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [difficulty, setDifficulty] = useState('normal'); // easy, normal, hard
  const [currentNews, setCurrentNews] = useState(null);
  const [reaction, setReaction] = useState(null);
  const [message, setMessage] = useState('Welcome to Portfolio Panic!');
  const [showResults, setShowResults] = useState(false);
  const [history, setHistory] = useState([]);
  const [gameMode, setGameMode] = useState('classic'); // classic, career, crisis
  const [showTutorial, setShowTutorial] = useState(false);
  const [tutorialStep, setTutorialStep] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  const [theme, setTheme] = useState('light');
  const [sfxEnabled, setSfxEnabled] = useState(true);
  const [musicEnabled, setMusicEnabled] = useState(true);
  const [level, setLevel] = useState(1);
  const [xp, setXp] = useState(0);
  const [showAchievements, setShowAchievements] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showMarketInsights, setShowMarketInsights] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [priceHistory, setPriceHistory] = useState({
    stocks: [100],
    bonds: [100],
    gold: [100],
    crypto: [100],
    realestate: [100],
  });
  
  // Portfolio assets
  const [portfolio, setPortfolio] = useState({
    stocks: 20,
    bonds: 20,
    gold: 20,
    crypto: 20,
    realestate: 20,
  });
  
  // Achievements
  const [achievements, setAchievements] = useState({
    firstMillion: false,
    marketGuru: false,
    steadyHand: false,
    riskTaker: false,
    survivedCrash: false,
    perfectRound: false,
    diversityMaster: false,
    comeback: false,
  });
  
  // Timer refs
  const timerRef = useRef(null);
  const roundTimerRef = useRef(null);
  const notificationTimerRef = useRef(null);
  const animationFrameRef = useRef(null);
  
  // Animation states
  const [particles, setParticles] = useState([]);
  const [showConfetti, setShowConfetti] = useState(false);
  const [charactersState, setCharactersState] = useState({
    trader: 'neutral',
    banker: 'neutral',
    investor: 'neutral',
  });
  
  // Market news database with their effects on assets
  const newsDatabase = [
    {
      news: "Interest rates increased by central bank!",
      effects: { stocks: -10, bonds: -5, gold: 5, crypto: -15, realestate: -10, cash: 10 },
      explanation: "Higher interest rates typically hurt stocks and real estate as borrowing becomes more expensive, while cash becomes more attractive."
    },
    {
      news: "Tech sector reports record profits!",
      effects: { stocks: 15, bonds: 0, gold: -5, crypto: 10, realestate: 0, cash: -5 },
      explanation: "Tech company success boosts stock markets, especially tech-heavy indices. Investors move away from safe havens like gold."
    },
    {
      news: "Global pandemic concerns resurface!",
      effects: { stocks: -20, bonds: 10, gold: 15, crypto: -5, realestate: -10, cash: 5 },
      explanation: "Health crises create economic uncertainty, driving investors to safe assets like bonds and gold."
    },
    {
      news: "Major country announces crypto regulations!",
      effects: { stocks: 0, bonds: 0, gold: 5, crypto: -25, realestate: 0, cash: 0 },
      explanation: "Regulatory announcements typically cause short-term volatility in cryptocurrency markets."
    },
    {
      news: "Housing market shows signs of cooling!",
      effects: { stocks: 0, bonds: 5, gold: 0, crypto: 0, realestate: -15, cash: 5 },
      explanation: "A cooling housing market reduces real estate values but can make bonds more attractive."
    },
    {
      news: "Inflation reaches 5-year high!",
      effects: { stocks: -5, bonds: -10, gold: 20, crypto: 5, realestate: 10, cash: -15 },
      explanation: "Inflation erodes cash value while boosting hard assets like gold and real estate."
    },
    {
      news: "Major tech company announces breakthrough AI!",
      effects: { stocks: 20, bonds: -5, gold: -10, crypto: 15, realestate: 0, cash: -5 },
      explanation: "Tech innovations drive stock market rallies and can boost related assets like crypto."
    },
    {
      news: "Global supply chain disruptions worsen!",
      effects: { stocks: -10, bonds: 5, gold: 10, crypto: 0, realestate: -5, cash: 0 },
      explanation: "Supply chain issues hurt corporate profits, pushing investors toward safer assets."
    },
    {
      news: "Government announces massive infrastructure bill!",
      effects: { stocks: 10, bonds: -5, gold: -5, crypto: 0, realestate: 15, cash: -5 },
      explanation: "Infrastructure spending boosts economic activity, helping stocks and real estate."
    },
    {
      news: "Central bank announces quantitative easing!",
      effects: { stocks: 15, bonds: 10, gold: 5, crypto: 10, realestate: 10, cash: -15 },
      explanation: "Money printing devalues cash while lifting asset prices across the board."
    },
    {
      news: "Major cryptocurrency exchange hacked!",
      effects: { stocks: -2, bonds: 5, gold: 10, crypto: -30, realestate: 0, cash: 5 },
      explanation: "Security breaches severely damage crypto markets and drive investors to traditional safe havens."
    },
    {
      news: "Housing construction permits hit record high!",
      effects: { stocks: 5, bonds: 0, gold: -5, crypto: 0, realestate: -10, cash: 0 },
      explanation: "Increased housing supply can reduce real estate values while indicating economic strength."
    },
    {
      news: "Major country bans cryptocurrency trading!",
      effects: { stocks: 0, bonds: 5, gold: 10, crypto: -40, realestate: 0, cash: 5 },
      explanation: "Regulatory crackdowns create severe pressure on crypto markets."
    },
    {
      news: "Oil prices surge 15% overnight!",
      effects: { stocks: -5, bonds: 0, gold: 10, crypto: -5, realestate: -5, cash: 0 },
      explanation: "Energy price spikes create inflation concerns, benefiting gold but hurting energy-dependent sectors."
    },
    {
      news: "Major bank collapse shocks financial markets!",
      effects: { stocks: -25, bonds: -10, gold: 20, crypto: -15, realestate: -10, cash: -5 },
      explanation: "Banking crises create systemic concerns, driving a flight to safety like gold."
    },
    {
      news: "Unemployment drops to historic low!",
      effects: { stocks: 10, bonds: -5, gold: -10, crypto: 5, realestate: 5, cash: -5 },
      explanation: "Strong employment signals economic health, boosting stocks and risk assets."
    },
    {
      news: "Corporate tax cuts passed by government!",
      effects: { stocks: 20, bonds: -5, gold: -10, crypto: 5, realestate: 5, cash: -5 },
      explanation: "Lower corporate taxes boost company profits and stock valuations."
    },
    {
      news: "Trade war escalates between major economies!",
      effects: { stocks: -15, bonds: 10, gold: 15, crypto: -5, realestate: -5, cash: 0 },
      explanation: "Trade conflicts hurt economic growth forecasts, driving investors to safer assets."
    },
    {
      news: "Major e-commerce company splits stock!",
      effects: { stocks: 15, bonds: -5, gold: -5, crypto: 5, realestate: 0, cash: -5 },
      explanation: "Stock splits often generate investor enthusiasm and market momentum."
    },
    {
      news: "Sustainable energy breakthrough announced!",
      effects: { stocks: 10, bonds: 0, gold: -5, crypto: 0, realestate: 5, cash: -5 },
      explanation: "Green energy innovations can drive sectoral stock rallies and sustainable investments."
    }
  ];
  
  // Handle theme toggle
  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };
  
  // Difficulty settings
  const difficultySettings = {
    easy: { timePerRound: 20, rounds: 5, penaltyMultiplier: 0.5, bonusMultiplier: 1.5 },
    normal: { timePerRound: 15, rounds: 8, penaltyMultiplier: 1.0, bonusMultiplier: 1.0 },
    hard: { timePerRound: 10, rounds: 12, penaltyMultiplier: 1.5, bonusMultiplier: 0.75 }
  };
  
  // Generate random news
  const generateNews = () => {
    const randomIndex = Math.floor(Math.random() * newsDatabase.length);
    setCurrentNews(newsDatabase[randomIndex]);
    setTimeLeft(difficultySettings[difficulty].timePerRound);
    setReaction(null);
    setShowResults(false);
  };
  
  // Start game
  const startGame = () => {
    setGameActive(true);
    setPaused(false);
    setRound(1);
    setScore(10000);
    setHistory([]);
    setPortfolio({
      stocks: 20,
      bonds: 20,
      gold: 20,
      crypto: 20,
      realestate: 20,
    });
    setPriceHistory({
      stocks: [100],
      bonds: [100],
      gold: [100],
      crypto: [100],
      realestate: [100],
    });
    generateNews();
    startRoundTimer();
    addNotification("Game started! React to market news quickly!", "info");
    
    // Reset particles
    setParticles([]);
    
    // Reset character states
    setCharactersState({
      trader: 'neutral',
      banker: 'neutral',
      investor: 'neutral',
    });
  };
  
  // Start round timer
  const startRoundTimer = () => {
    if (roundTimerRef.current) clearInterval(roundTimerRef.current);
    
    roundTimerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          // Time's up
          clearInterval(roundTimerRef.current);
          evaluateRound();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };
  
  // Pause/resume game
  const togglePause = () => {
    if (paused) {
      // Resume
      setPaused(false);
      startRoundTimer();
    } else {
      // Pause
      setPaused(true);
      clearInterval(roundTimerRef.current);
    }
  };
  
  // Reset game
  const resetGame = () => {
    setGameActive(false);
    setPaused(false);
    setRound(0);
    setScore(10000);
    setMessage('Welcome to Portfolio Panic!');
    clearInterval(roundTimerRef.current);
    setShowResults(false);
  };
  
  // Next round
  const nextRound = () => {
    if (round >= difficultySettings[difficulty].rounds) {
      // Game over
      endGame();
    } else {
      setRound(prev => prev + 1);
      generateNews();
      startRoundTimer();
    }
  };
  
  // End game
  const endGame = () => {
    setGameActive(false);
    setMessage(`Game Over! Final score: $${score.toLocaleString()}`);
    clearInterval(roundTimerRef.current);
    
    // Trigger confetti for good performance
    if (score > 15000) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 5000);
    }
    
    // Check achievements
    if (score >= 1000000 && !achievements.firstMillion) {
      unlockAchievement('firstMillion', 'First Million!', 'Reach a portfolio value of $1,000,000');
    }
  };
  
  // Adjust portfolio
  const adjustPortfolio = (asset, change) => {
    if (paused || timeLeft === 0 || !gameActive) return;
    
    setPortfolio(prev => {
      const newPortfolio = { ...prev };
      
      // Calculate total allocation
      const total = Object.values(newPortfolio).reduce((sum, value) => sum + value, 0);
      
      // Don't allow less than 0% allocation
      if (newPortfolio[asset] + change < 0) return prev;
      
      // Don't allow more than 100% total allocation
      if (total + change > 100) return prev;
      
      // Adjust the asset
      newPortfolio[asset] += change;
      
      // Add visual feedback
      addParticle(asset, change > 0 ? 'positive' : 'negative');
      
      // Update character moods based on portfolio changes
      updateCharacterMoods(asset, change);
      
      return newPortfolio;
    });
  };
  
  // Update character moods based on portfolio changes
  const updateCharacterMoods = (asset, change) => {
    setCharactersState(prev => {
      const newState = { ...prev };
      
      // Different characters react to different assets
      if (asset === 'stocks' || asset === 'crypto') {
        newState.trader = change > 0 ? 'happy' : 'worried';
      } else if (asset === 'bonds' || asset === 'cash') {
        newState.banker = change > 0 ? 'happy' : 'worried';
      } else if (asset === 'gold' || asset === 'realestate') {
        newState.investor = change > 0 ? 'happy' : 'worried';
      }
      
      return newState;
    });
    
    // Reset moods after a delay
    setTimeout(() => {
      setCharactersState(prev => {
        const newState = { ...prev };
        Object.keys(newState).forEach(character => {
          if (newState[character] !== 'neutral') {
            newState[character] = 'neutral';
          }
        });
        return newState;
      });
    }, 2000);
  };
  
  // Add visual particle effect
  const addParticle = (asset, type) => {
    const newParticle = {
      id: Date.now() + Math.random(),
      asset,
      type,
      x: Math.random() * 80 + 10, // Random position
      y: Math.random() * 30 + 50,
      size: Math.random() * 20 + 20,
      velocity: { x: (Math.random() - 0.5) * 4, y: -3 - Math.random() * 2 },
      rotation: Math.random() * 360,
      rotationSpeed: Math.random() * 10 - 5,
      opacity: 1,
    };
    
    setParticles(prev => [...prev, newParticle]);
    
    // Remove particle after animation
    setTimeout(() => {
      setParticles(prev => prev.filter(p => p.id !== newParticle.id));
    }, 2000);
  };
  
  // Evaluate round results
  const evaluateRound = () => {
    if (!currentNews) return;
    
    // Calculate score changes
    let roundScore = 0;
    const assetChanges = {};
    const newPriceHistory = { ...priceHistory };
    
    Object.entries(portfolio).forEach(([asset, allocation]) => {
      const effect = currentNews.effects[asset] || 0;
      const impact = (effect * allocation) / 100;
      roundScore += impact;
      assetChanges[asset] = impact;
      
      // Update price history
      const lastPrice = newPriceHistory[asset][newPriceHistory[asset].length - 1];
      const newPrice = lastPrice * (1 + (effect / 100));
      newPriceHistory[asset] = [...newPriceHistory[asset], newPrice];
    });
    
    // Apply difficulty multipliers
    roundScore *= difficultySettings[difficulty].bonusMultiplier;
    
    // Calculate new score (percentage change)
    const scoreChange = score * (roundScore / 100);
    const newScore = Math.max(0, score + scoreChange);
    
    // Add round to history
    const roundResult = {
      round,
      news: currentNews.news,
      scoreChange,
      portfolioState: { ...portfolio },
      assetChanges,
    };
    
    // Update game state
    setScore(newScore);
    setHistory(prev => [...prev, roundResult]);
    setShowResults(true);
    setPriceHistory(newPriceHistory);
    
    // Set reaction message
    if (scoreChange > 0) {
      setReaction({ type: 'positive', message: `Great job! You earned $${Math.abs(scoreChange).toLocaleString()}` });
      
      // Check for perfect round achievement
      if (scoreChange > score * 0.1 && !achievements.perfectRound) {
        unlockAchievement('perfectRound', 'Perfect Round!', 'Earn more than 10% in a single round');
      }
    } else if (scoreChange < 0) {
      setReaction({ type: 'negative', message: `Ouch! You lost $${Math.abs(scoreChange).toLocaleString()}` });
    } else {
      setReaction({ type: 'neutral', message: 'Your portfolio value remained stable.' });
    }
    
    // Wait before proceeding to next round
    setTimeout(() => {
      nextRound();
    }, 5000);
  };
  
  // Unlock achievement
  const unlockAchievement = (id, title, description) => {
    setAchievements(prev => ({ ...prev, [id]: true }));
    addNotification(`🏆 Achievement Unlocked: ${title}`, 'achievement');
    
    // Add XP
    setXp(prev => prev + 100);
    
    // Check for level up
    const newXp = xp + 100;
    const newLevel = Math.floor(newXp / 500) + 1;
    
    if (newLevel > level) {
      setLevel(newLevel);
      addNotification(`🌟 Level Up! You reached level ${newLevel}`, 'levelup');
    }
  };
  
  // Add notification
  const addNotification = (text, type = 'info') => {
    const newNotification = {
      id: Date.now(),
      text,
      type,
    };
    
    setNotifications(prev => [...prev, newNotification]);
    
    // Auto-remove notification after 5 seconds
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== newNotification.id));
    }, 5000);
  };
  
  // Tutorial navigation
  const tutorialSteps = [
    {
      title: "Welcome to Portfolio Panic!",
      content: "In this game, you'll react to financial news and adjust your portfolio to maximize returns.",
    },
    {
      title: "Understanding the News",
      content: "Each round, a news headline will appear. You need to quickly understand how it affects different asset classes.",
    },
    {
      title: "Adjusting Your Portfolio",
      content: "Use the + and - buttons to increase or decrease allocation to each asset class. Total allocation must equal 100%.",
    },
    {
      title: "Time Management",
      content: "You have limited time to react to each news item. The timer shows how much time is left.",
    },
    {
      title: "Scoring",
      content: "Your score is your portfolio value. Good decisions increase it, bad ones decrease it.",
    },
    {
      title: "Game Modes",
      content: "Classic Mode: Play through rounds with random news. Career Mode: Progress through levels with increasing difficulty. Crisis Mode: Survive a market crash!",
    },
    {
      title: "Ready to Play?",
      content: "Let's put your investment skills to the test! Good luck!",
    }
  ];
  
  const nextTutorialStep = () => {
    if (tutorialStep < tutorialSteps.length - 1) {
      setTutorialStep(prev => prev + 1);
    } else {
      setShowTutorial(false);
      setTutorialStep(0);
    }
  };
  
  const prevTutorialStep = () => {
    if (tutorialStep > 0) {
      setTutorialStep(prev => prev - 1);
    }
  };
  
  // Animated cartoonish characters
  const renderCharacter = (type, mood) => {
    const baseStyle = {
      width: '70px',
      height: '70px',
      borderRadius: '50%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      margin: '0 5px',
      position: 'relative',
      transition: 'all 0.3s ease',
    };
    
    const moods = {
      neutral: { bg: 'bg-gray-200', eyes: '😐', animation: '' },
      happy: { bg: 'bg-green-200', eyes: '😄', animation: 'animate-bounce' },
      worried: { bg: 'bg-red-200', eyes: '😟', animation: 'animate-pulse' },
    };
    
    const characters = {
      trader: { bg: 'bg-blue-100', icon: '👨‍💼' },
      banker: { bg: 'bg-purple-100', icon: '👩‍💼' },
      investor: { bg: 'bg-yellow-100', icon: '🧑‍💼' },
    };
    
    return (
      <div 
        className={`${characters[type].bg} ${moods[mood].bg} ${moods[mood].animation}`} 
        style={baseStyle}
      >
        <div className="text-3xl">{characters[type].icon}</div>
        <div className="absolute bottom-0 right-0 text-xl">{moods[mood].eyes}</div>
      </div>
    );
  };
  
  // Handle confetti animation
  useEffect(() => {
    if (showConfetti) {
      const interval = setInterval(() => {
        for (let i = 0; i < 5; i++) {
          addParticle('confetti', Math.random() > 0.5 ? 'positive' : 'negative');
        }
      }, 300);
      
      return () => clearInterval(interval);
    }
  }, [showConfetti]);

  // Clean up all timers on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (roundTimerRef.current) clearInterval(roundTimerRef.current);
      if (notificationTimerRef.current) clearTimeout(notificationTimerRef.current);
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, []);

  // Render game UI
  return (
    <div className={`portfolio-panic-game ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'} min-h-screen p-4 relative overflow-hidden`}>
      {/* Animated particles */}
      {particles.map(particle => (
        <div
          key={particle.id}
          className={`absolute rounded-full ${
            particle.type === 'positive' ? 'bg-green-500' : 
            particle.type === 'negative' ? 'bg-red-500' : 
            `bg-${particle.asset === 'stocks' ? 'blue' : 
              particle.asset === 'bonds' ? 'purple' : 
              particle.asset === 'gold' ? 'yellow' : 
              particle.asset === 'crypto' ? 'indigo' : 
              particle.asset === 'realestate' ? 'green' : 
              particle.asset === 'confetti' ? ['red', 'blue', 'green', 'yellow', 'purple'][Math.floor(Math.random() * 5)] : 
              'gray'}-${Math.floor(Math.random() * 3) * 100 + 300}`
          } text-white flex items-center justify-center font-bold`}
          style={{
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            opacity: particle.opacity,
            transform: `rotate(${particle.rotation}deg)`,
            zIndex: 50,
          }}
        >
          {particle.asset === 'stocks' ? <TrendingUp size={16} /> : 
           particle.asset === 'bonds' ? <FileText size={16} /> : 
           particle.asset === 'gold' ? <Coins size={16} /> :
           particle.asset === 'crypto' ? <Activity size={16} /> :
           particle.asset === 'realestate' ? <Briefcase size={16} /> :
           particle.asset === 'confetti' ? '🎉' : '💰'}
        </div>
      ))}

      {/* Header section */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <Coins className="mr-2 text-yellow-500" size={32} />
          <h1 className="text-3xl font-bold">Portfolio Panic!</h1>
        </div>
        
        <div className="flex space-x-4">
          <button 
            onClick={toggleTheme} 
            className={`p-2 rounded-full ${theme === 'dark' ? 'bg-yellow-500' : 'bg-gray-700 text-white'}`}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          
          <button 
            onClick={() => setShowSettings(!showSettings)} 
            className={`p-2 rounded-full ${showSettings ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            aria-label="Settings"
          >
            <Settings size={20} />
          </button>
          
          <button 
            onClick={() => setShowTutorial(true)} 
            className="p-2 rounded-full bg-purple-500 text-white"
            aria-label="Tutorial"
          >
            <HelpCircle size={20} />
          </button>
        </div>
      </div>
      
      {/* Game stats bar */}
      <div className={`stats-bar flex justify-between p-3 rounded-lg mb-6 ${theme === 'dark' ? 'bg-gray-700' : 'bg-blue-100'}`}>
        <div className="stat flex items-center">
          <DollarSign className="mr-1 text-green-500" />
          <div>
            <div className="text-xs uppercase">Portfolio</div>
            <div className="font-bold">${score.toLocaleString()}</div>
          </div>
        </div>
        
        <div className="stat flex items-center">
          <Clock className="mr-1 text-blue-500" />
          <div>
            <div className="text-xs uppercase">Time</div>
            <div className="font-bold">{timeLeft}s</div>
          </div>
        </div>
        
        <div className="stat flex items-center">
          <BarChart2 className="mr-1 text-purple-500" />
          <div>
            <div className="text-xs uppercase">Round</div>
            <div className="font-bold">{round}/{difficultySettings[difficulty].rounds}</div>
          </div>
        </div>
        
        <div className="stat flex items-center">
          <Award className="mr-1 text-yellow-500" />
          <div>
            <div className="text-xs uppercase">Level</div>
            <div className="font-bold">{level}</div>
          </div>
        </div>
      </div>
      
      {/* News ticker */}
      {gameActive && currentNews && (
        <div className={`news-ticker overflow-hidden p-4 mb-6 rounded-lg relative ${theme === 'dark' ? 'bg-gray-700' : 'bg-yellow-100'}`}>
          <div className="flex items-center">
            <AlertCircle className="mr-2 text-red-500 animate-pulse" />
            <div className="text-lg font-bold news-text">{currentNews.news}</div>
          </div>
          
          {/* Progress bar for timer */}
          <div className="w-full bg-gray-300 h-2 mt-2 rounded-full overflow-hidden">
            <div 
              className="h-full bg-red-500 transition-all duration-1000 ease-linear" 
              style={{ width: `${(timeLeft / difficultySettings[difficulty].timePerRound) * 100}%` }}
            />
          </div>
        </div>
      )}
      
      {/* Cartoon characters display */}
      {gameActive && (
        <div className="flex justify-center mb-6">
          {renderCharacter('trader', charactersState.trader)}
          {renderCharacter('banker', charactersState.banker)}
          {renderCharacter('investor', charactersState.investor)}
        </div>
      )}
      
      {/* Portfolio adjustment section */}
      {gameActive && !showResults && (
        <div className={`portfolio-grid grid grid-cols-1 md:grid-cols-5 gap-4 mb-8 ${timeLeft === 0 ? 'opacity-50 pointer-events-none' : ''}`}>
          {Object.entries(portfolio).map(([asset, allocation]) => (
            <div 
              key={asset} 
              className={`asset-card p-4 rounded-lg shadow-md ${theme === 'dark' ? 'bg-gray-700' : 'bg-white'}`}
            >
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-bold capitalize">{asset}</h3>
                <div className={`text-xs px-2 py-1 rounded-full ${allocation >= 30 ? 'bg-green-100 text-green-800' : allocation >= 10 ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800'}`}>
                  {allocation}%
                </div>
              </div>
              
              <div className="flex justify-center items-center mb-3">
                {asset === 'stocks' && <TrendingUp size={32} className="text-blue-500" />}
                {asset === 'bonds' && <FileText size={32} className="text-purple-500" />}
                {asset === 'gold' && <Coins size={32} className="text-yellow-500" />}
                {asset === 'crypto' && <Activity size={32} className="text-indigo-500" />}
                {asset === 'realestate' && <Briefcase size={32} className="text-green-500" />}
              </div>
              
              <div className="price-trend text-xs text-center mb-3">
                {priceHistory[asset] && priceHistory[asset].length > 1 ? (
                  <div className="flex items-center justify-center">
                    <span className={`mr-1 ${priceHistory[asset][priceHistory[asset].length - 1] > priceHistory[asset][priceHistory[asset].length - 2] ? 'text-green-500' : 'text-red-500'}`}>
                      {priceHistory[asset][priceHistory[asset].length - 1].toFixed(2)}
                    </span>
                    {priceHistory[asset][priceHistory[asset].length - 1] > priceHistory[asset][priceHistory[asset].length - 2] ? 
                      <ArrowUp size={12} className="text-green-500" /> : 
                      <ArrowDown size={12} className="text-red-500" />
                    }
                  </div>
                ) : (
                  <span>100.00</span>
                )}
              </div>
              
              <div className="controls flex justify-between">
                <button 
                  onClick={() => adjustPortfolio(asset, -5)}
                  className="btn-adjust bg-red-500 text-white w-12 h-8 rounded-lg flex items-center justify-center hover:bg-red-600 transition-colors"
                  disabled={timeLeft === 0}
                  aria-label={`Decrease ${asset} allocation`}
                >
                  <ChevronDown size={16} />
                </button>
                
                <div className="progress-bar h-8 flex-1 mx-2 bg-gray-200 rounded-lg overflow-hidden">
                  <div 
                    className={`h-full ${
                      asset === 'stocks' ? 'bg-blue-500' : 
                      asset === 'bonds' ? 'bg-purple-500' : 
                      asset === 'gold' ? 'bg-yellow-500' : 
                      asset === 'crypto' ? 'bg-indigo-500' : 
                      'bg-green-500'
                    }`}
                    style={{ width: `${allocation}%` }}
                  />
                </div>
                
                <button 
                  onClick={() => adjustPortfolio(asset, 5)}
                  className="btn-adjust bg-green-500 text-white w-12 h-8 rounded-lg flex items-center justify-center hover:bg-green-600 transition-colors"
                  disabled={timeLeft === 0}
                  aria-label={`Increase ${asset} allocation`}
                >
                  <ChevronUp size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Achievements modal */}
      {showAchievements && (
        <div className="achievements-modal fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className={`achievements-content p-6 rounded-lg max-w-2xl w-full ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Achievements</h2>
              <button 
                onClick={() => setShowAchievements(false)} 
                className="text-gray-500 hover:text-gray-700"
                aria-label="Close achievements"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="achievements-grid grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className={`achievement p-4 rounded-lg ${achievements.firstMillion ? 'bg-yellow-100' : 'bg-gray-100'}`}>
                <div className="flex items-center">
                  <div className={`achievement-icon p-2 rounded-full mr-3 ${achievements.firstMillion ? 'bg-yellow-500' : 'bg-gray-300'}`}>
                    <DollarSign size={20} className="text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold">First Million!</h3>
                    <p className="text-sm">Reach a portfolio value of $1,000,000</p>
                  </div>
                </div>
              </div>
              
              <div className={`achievement p-4 rounded-lg ${achievements.marketGuru ? 'bg-blue-100' : 'bg-gray-100'}`}>
                <div className="flex items-center">
                  <div className={`achievement-icon p-2 rounded-full mr-3 ${achievements.marketGuru ? 'bg-blue-500' : 'bg-gray-300'}`}>
                    <Award size={20} className="text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold">Market Guru</h3>
                    <p className="text-sm">Make 5 correct investment decisions in a row</p>
                  </div>
                </div>
              </div>
              
              <div className={`achievement p-4 rounded-lg ${achievements.steadyHand ? 'bg-green-100' : 'bg-gray-100'}`}>
                <div className="flex items-center">
                  <div className={`achievement-icon p-2 rounded-full mr-3 ${achievements.steadyHand ? 'bg-green-500' : 'bg-gray-300'}`}>
                    <Clock size={20} className="text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold">Steady Hand</h3>
                    <p className="text-sm">Complete a game without losing money in any round</p>
                  </div>
                </div>
              </div>
              
              <div className={`achievement p-4 rounded-lg ${achievements.riskTaker ? 'bg-purple-100' : 'bg-gray-100'}`}>
                <div className="flex items-center">
                  <div className={`achievement-icon p-2 rounded-full mr-3 ${achievements.riskTaker ? 'bg-purple-500' : 'bg-gray-300'}`}>
                    <Zap size={20} className="text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold">Risk Taker</h3>
                    <p className="text-sm">Allocate 80% or more to a single asset</p>
                  </div>
                </div>
              </div>
              
              <div className={`achievement p-4 rounded-lg ${achievements.survivedCrash ? 'bg-red-100' : 'bg-gray-100'}`}>
                <div className="flex items-center">
                  <div className={`achievement-icon p-2 rounded-full mr-3 ${achievements.survivedCrash ? 'bg-red-500' : 'bg-gray-300'}`}>
                    <AlertCircle size={20} className="text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold">Crash Survivor</h3>
                    <p className="text-sm">Complete Crisis Mode with a positive return</p>
                  </div>
                </div>
              </div>
              
              <div className={`achievement p-4 rounded-lg ${achievements.perfectRound ? 'bg-indigo-100' : 'bg-gray-100'}`}>
                <div className="flex items-center">
                  <div className={`achievement-icon p-2 rounded-full mr-3 ${achievements.perfectRound ? 'bg-indigo-500' : 'bg-gray-300'}`}>
                    <Target size={20} className="text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold">Perfect Round</h3>
                    <p className="text-sm">Earn more than 10% in a single round</p>
                  </div>
                </div>
              </div>
              
              <div className={`achievement p-4 rounded-lg ${achievements.diversityMaster ? 'bg-yellow-100' : 'bg-gray-100'}`}>
                <div className="flex items-center">
                  <div className={`achievement-icon p-2 rounded-full mr-3 ${achievements.diversityMaster ? 'bg-yellow-500' : 'bg-gray-300'}`}>
                    <BarChart2 size={20} className="text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold">Diversity Master</h3>
                    <p className="text-sm">Complete a game with a perfectly balanced portfolio</p>
                  </div>
                </div>
              </div>
              
              <div className={`achievement p-4 rounded-lg ${achievements.comeback ? 'bg-green-100' : 'bg-gray-100'}`}>
                <div className="flex items-center">
                  <div className={`achievement-icon p-2 rounded-full mr-3 ${achievements.comeback ? 'bg-green-500' : 'bg-gray-300'}`}>
                    <TrendingUp size={20} className="text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold">The Comeback</h3>
                    <p className="text-sm">Recover from a 30% loss and finish with profit</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Leaderboard modal */}
      {showLeaderboard && (
        <div className="leaderboard-modal fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className={`leaderboard-content p-6 rounded-lg max-w-2xl w-full ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Leaderboard</h2>
              <button 
                onClick={() => setShowLeaderboard(false)} 
                className="text-gray-500 hover:text-gray-700"
                aria-label="Close leaderboard"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="leaderboard-table">
              <div className={`leaderboard-header grid grid-cols-4 gap-4 p-2 font-bold mb-2 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'} rounded-lg`}>
                <div>Rank</div>
                <div>Player</div>
                <div>Score</div>
                <div>Date</div>
              </div>
              
              <div className={`leaderboard-entries max-h-64 overflow-y-auto ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'} rounded-lg`}>
                {/* Dummy data - would be replaced with actual leaderboard data */}
                <div className="grid grid-cols-4 gap-4 p-3 border-b">
                  <div className="flex items-center">
                    <Award className="text-yellow-500 mr-2" size={16} /> 1
                  </div>
                  <div>Market Master</div>
                  <div className="text-green-500">$2,481,327</div>
                  <div className="text-sm">04/07/2025</div>
                </div>
                
                <div className="grid grid-cols-4 gap-4 p-3 border-b">
                  <div className="flex items-center">
                    <Award className="text-gray-400 mr-2" size={16} /> 2
                  </div>
                  <div>Stock Guru</div>
                  <div className="text-green-500">$1,687,945</div>
                  <div className="text-sm">04/05/2025</div>
                </div>
                
                <div className="grid grid-cols-4 gap-4 p-3 border-b">
                  <div className="flex items-center">
                    <Award className="text-yellow-700 mr-2" size={16} /> 3
                  </div>
                  <div>Crypto King</div>
                  <div className="text-green-500">$1,325,782</div>
                  <div className="text-sm">04/06/2025</div>
                </div>
                
                <div className="grid grid-cols-4 gap-4 p-3 border-b">
                  <div>4</div>
                  <div>Real Estate Pro</div>
                  <div className="text-green-500">$987,542</div>
                  <div className="text-sm">04/04/2025</div>
                </div>
                
                <div className="grid grid-cols-4 gap-4 p-3 border-b">
                  <div>5</div>
                  <div>Gold Hoarder</div>
                  <div className="text-green-500">$765,210</div>
                  <div className="text-sm">04/03/2025</div>
                </div>
              </div>
            </div>
            
            <div className="your-rank p-4 mt-4 rounded-lg bg-blue-100">
              <h3 className="font-bold mb-2">Your Performance</h3>
              <div className="grid grid-cols-4 gap-4">
                <div className="flex items-center">
                  <div className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center mr-2">?</div>
                </div>
                <div>You</div>
                <div>${score.toLocaleString()}</div>
                <div className="text-sm">Just now</div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Notifications system */}
      <div className="notifications-container fixed bottom-4 right-4 space-y-2 z-40">
        {notifications.map(notification => (
          <div 
            key={notification.id} 
            className={`notification p-3 rounded-lg shadow-lg max-w-xs animate-fadeIn ${
              notification.type === 'info' ? 'bg-blue-500 text-white' : 
              notification.type === 'achievement' ? 'bg-yellow-500 text-white' : 
              notification.type === 'levelup' ? 'bg-purple-500 text-white' : 
              'bg-green-500 text-white'
            }`}
            role="alert"
          >
            <div className="flex items-center">
              {notification.type === 'info' && <MessageCircle className="mr-2" size={16} />}
              {notification.type === 'achievement' && <Award className="mr-2" size={16} />}
              {notification.type === 'levelup' && <Zap className="mr-2" size={16} />}
              <div>{notification.text}</div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Round results */}
      {gameActive && showResults && (
        <div className={`results p-6 rounded-lg shadow-lg mb-8 ${theme === 'dark' ? 'bg-gray-700' : 'bg-white'}`}>
          <h2 className="text-2xl font-bold mb-4 text-center">Round Results</h2>
          
          {reaction && (
            <div className={`reaction mb-6 p-4 rounded-lg text-center ${
              reaction.type === 'positive' ? 'bg-green-100 text-green-800' : 
              reaction.type === 'negative' ? 'bg-red-100 text-red-800' : 
              'bg-blue-100 text-blue-800'
            }`}>
              <p className="text-xl font-bold">{reaction.message}</p>
            </div>
          )}
          
          <div className="news-impact mb-6">
            <h3 className="text-lg font-bold mb-2">News Impact</h3>
            <p className="mb-4">{currentNews.news}</p>
            <p className="text-sm mb-2 italic">{currentNews.explanation}</p>
            
            <div className="grid grid-cols-5 gap-2 mt-4">
              {Object.entries(currentNews.effects).map(([asset, effect]) => (
                effect !== 0 && (
                  <div key={asset} className="asset-effect flex flex-col items-center">
                    <div className="capitalize text-sm mb-1">{asset}</div>
                    <div className={`effect-badge px-2 py-1 rounded-full text-xs font-bold ${
                      effect > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {effect > 0 ? '+' : ''}{effect}%
                    </div>
                  </div>
                )
              ))}
            </div>
          </div>
          
          <div className="portfolio-performance">
            <h3 className="text-lg font-bold mb-2">Your Portfolio Performance</h3>
            
            <div className="grid grid-cols-5 gap-2">
              {Object.entries(portfolio).map(([asset, allocation]) => {
                const impact = currentNews.effects[asset] || 0;
                const assetContribution = (impact * allocation) / 100;
                
                return (
                  <div key={asset} className="asset-performance">
                    <div className="flex justify-between items-center">
                      <div className="capitalize text-sm">{asset}</div>
                      <div className="text-sm">{allocation}%</div>
                    </div>
                    <div className={`contribution p-1 rounded text-xs text-center font-bold ${
                      assetContribution > 0 ? 'bg-green-100 text-green-800' : 
                      assetContribution < 0 ? 'bg-red-100 text-red-800' : 
                      'bg-gray-100'
                    }`}>
                      {assetContribution > 0 ? '+' : ''}{assetContribution.toFixed(2)}%
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          
          <div className="next-round-info text-center mt-6">
            <p className="text-sm mb-2">Preparing for next round...</p>
            <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
              <div className="h-full bg-blue-500 animate-pulse" style={{ width: '100%' }} />
            </div>
          </div>
        </div>
      )}
      
      {/* Game controls */}
      <div className="game-controls flex justify-center space-x-4 mb-8">
        {!gameActive ? (
          <>
            <button 
              onClick={startGame}
              className="btn-start py-3 px-8 bg-green-500 text-white rounded-lg font-bold text-lg flex items-center hover:bg-green-600 transition-colors"
            >
              <Play className="mr-2" /> Start Game
            </button>
            
            <div className="difficulty-selector flex items-center">
              <span className="mr-2 text-sm">Difficulty:</span>
              <select 
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className={`p-2 rounded border ${theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
                aria-label="Select difficulty"
              >
                <option value="easy">Easy</option>
                <option value="normal">Normal</option>
                <option value="hard">Hard</option>
              </select>
            </div>
            
            <div className="game-mode-selector flex items-center">
              <span className="mr-2 text-sm">Mode:</span>
              <select 
                value={gameMode}
                onChange={(e) => setGameMode(e.target.value)}
                className={`p-2 rounded border ${theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
                aria-label="Select game mode"
              >
                <option value="classic">Classic</option>
                <option value="career">Career</option>
                <option value="crisis">Crisis</option>
              </select>
            </div>
          </>
        ) : (
          <>
            <button 
              onClick={togglePause}
              className={`btn-pause py-2 px-6 ${paused ? 'bg-green-500' : 'bg-yellow-500'} text-white rounded-lg font-bold flex items-center hover:opacity-90 transition-opacity`}
              aria-label={paused ? "Resume game" : "Pause game"}
            >
              {paused ? <Play className="mr-1" /> : <Pause className="mr-1" />}
              {paused ? 'Resume' : 'Pause'}
            </button>
            
            <button 
              onClick={resetGame}
              className="btn-reset py-2 px-6 bg-red-500 text-white rounded-lg font-bold flex items-center hover:bg-red-600 transition-colors"
              aria-label="Reset game"
            >
              <RefreshCcw className="mr-1" /> Reset
            </button>
          </>
        )}
      </div>
      
      {/* Market insights panel */}
      {gameActive && (
        <div className="market-insights-toggle mb-4">
          <button
            onClick={() => setShowMarketInsights(!showMarketInsights)}
            className={`w-full py-2 rounded-lg text-center font-bold ${
              showMarketInsights ? 
              (theme === 'dark' ? 'bg-gray-600' : 'bg-gray-200') : 
              (theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100')
            }`}
            aria-expanded={showMarketInsights}
            aria-controls="market-insights-panel"
          >
            {showMarketInsights ? 'Hide Market Insights ▲' : 'Show Market Insights ▼'}
          </button>
        </div>
      )}
      
      {gameActive && showMarketInsights && (
        <div 
          id="market-insights-panel"
          className={`market-insights p-4 rounded-lg mb-8 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}
        >
          <h3 className="text-lg font-bold mb-4">Market Insights</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="price-history">
              <h4 className="text-md font-bold mb-2">Price History</h4>
              <div className="trends-grid grid grid-cols-5 gap-2">
                {Object.entries(priceHistory).map(([asset, prices]) => (
                  <div key={asset} className="asset-trend">
                    <div className="capitalize text-sm mb-1">{asset}</div>
                    <div className="trend-line h-20 bg-gray-200 rounded-lg relative overflow-hidden">
                      {prices.length > 1 && prices.map((price, index) => {
                        if (index === 0) return null;
                        
                        const prevPrice = prices[index - 1];
                        const height = Math.min(100, Math.max(0, (price / 150) * 100));
                        const prevHeight = Math.min(100, Math.max(0, (prevPrice / 150) * 100));
                        
                        return (
                          <div 
                            key={index}
                            className={`absolute bottom-0 w-1 ${price >= prevPrice ? 'bg-green-500' : 'bg-red-500'}`}
                            style={{
                              height: `${height}%`,
                              left: `${(index / prices.length) * 100}%`,
                            }}
                          />
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="history-log">
              <h4 className="text-md font-bold mb-2">Round History</h4>
              <div className={`history-list max-h-48 overflow-y-auto p-2 rounded-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
                {history.length === 0 ? (
                  <p className="text-sm text-gray-500 text-center">No rounds completed yet</p>
                ) : (
                  history.map((item, index) => (
                    <div key={index} className={`history-item p-2 mb-2 rounded text-sm ${
                      item.scoreChange > 0 ? 'bg-green-100 text-green-800' : 
                      item.scoreChange < 0 ? 'bg-red-100 text-red-800' : 
                      'bg-blue-100 text-blue-800'
                    }`}>
                      <div className="flex justify-between">
                        <span>Round {item.round}</span>
                        <span>{item.scoreChange > 0 ? '+' : ''}{item.scoreChange.toFixed(2)}</span>
                      </div>
                      <div className="news-headline truncate">{item.news}</div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Welcome/start screen */}
      {!gameActive && round === 0 && (
        <div className={`welcome-screen p-6 rounded-lg shadow-lg text-center ${theme === 'dark' ? 'bg-gray-700' : 'bg-white'}`}>
          <h2 className="text-2xl font-bold mb-4">Welcome to Portfolio Panic!</h2>
          <p className="mb-6">React to financial news and adjust your portfolio to maximize returns. Can you beat the market?</p>
          
          <div className="game-modes grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div 
              className={`mode-card p-4 rounded-lg cursor-pointer ${gameMode === 'classic' ? 'ring-2 ring-blue-500' : ''} ${theme === 'dark' ? 'bg-gray-600' : 'bg-gray-100'}`} 
              onClick={() => setGameMode('classic')}
              role="radio"
              aria-checked={gameMode === 'classic'}
              tabIndex={0}
            >
              <h3 className="text-lg font-bold mb-2">Classic Mode</h3>
              <TrendingUp size={32} className="mx-auto mb-2 text-blue-500" />
              <p className="text-sm">Standard gameplay with random financial news events.</p>
            </div>
            
            <div 
              className={`mode-card p-4 rounded-lg cursor-pointer ${gameMode === 'career' ? 'ring-2 ring-purple-500' : ''} ${theme === 'dark' ? 'bg-gray-600' : 'bg-gray-100'}`} 
              onClick={() => setGameMode('career')}
              role="radio"
              aria-checked={gameMode === 'career'}
              tabIndex={0}
            >
              <h3 className="text-lg font-bold mb-2">Career Mode</h3>
              <Target size={32} className="mx-auto mb-2 text-purple-500" />
              <p className="text-sm">Progress through levels with increasing difficulty and complexity.</p>
            </div>
            
            <div 
              className={`mode-card p-4 rounded-lg cursor-pointer ${gameMode === 'crisis' ? 'ring-2 ring-red-500' : ''} ${theme === 'dark' ? 'bg-gray-600' : 'bg-gray-100'}`} 
              onClick={() => setGameMode('crisis')}
              role="radio"
              aria-checked={gameMode === 'crisis'}
              tabIndex={0}
            >
              <h3 className="text-lg font-bold mb-2">Crisis Mode</h3>
              <AlertCircle size={32} className="mx-auto mb-2 text-red-500" />
              <p className="text-sm">Survive a market crash! Intense gameplay with challenging events.</p>
            </div>
          </div>
          
          <div className="quick-tips mb-6">
            <h3 className="text-lg font-bold mb-2">Quick Tips</h3>
            <ul className={`text-left p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-600' : 'bg-gray-100'}`}>
              <li className="mb-1 flex items-start">
                <Check size={16} className="text-green-500 mr-2 mt-1 flex-shrink-0" />
                <span>Diversify your portfolio to reduce risk</span>
              </li>
              <li className="mb-1 flex items-start">
                <Check size={16} className="text-green-500 mr-2 mt-1 flex-shrink-0" />
                <span>React quickly to breaking news events</span>
              </li>
              <li className="mb-1 flex items-start">
                <Check size={16} className="text-green-500 mr-2 mt-1 flex-shrink-0" />
                <span>Learn how different assets respond to economic events</span>
              </li>
              <li className="flex items-start">
                <Check size={16} className="text-green-500 mr-2 mt-1 flex-shrink-0" />
                <span>Watch the market trends in the insights panel</span>
              </li>
            </ul>
          </div>
          
          <button 
            onClick={startGame}
            className="btn-start py-3 px-8 bg-green-500 text-white rounded-lg font-bold text-lg flex items-center mx-auto hover:bg-green-600 transition-colors"
          >
            <Play className="mr-2" /> Start Game
          </button>
        </div>
      )}
      
      {/* End game summary */}
      {!gameActive && round > 0 && (
        <div className={`game-summary p-6 rounded-lg shadow-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-white'}`}>
          <h2 className="text-2xl font-bold mb-4 text-center">Game Summary</h2>
          
          <div className="final-score flex flex-col items-center mb-6">
            <div className="text-sm text-gray-500 mb-1">Final Portfolio Value</div>
            <div className="text-4xl font-bold">${score.toLocaleString()}</div>
            <div className={`text-sm mt-2 ${score > 10000 ? 'text-green-500' : 'text-red-500'}`}>
              {score > 10000 ? `+${(score - 10000).toLocaleString()} (+${((score - 10000) / 10000 * 100).toFixed(1)}%)` : 
              `-${(10000 - score).toLocaleString()} (-${((10000 - score) / 10000 * 100).toFixed(1)}%)`}
            </div>
          </div>
          
          <div className="performance-metrics grid grid-cols-2 gap-4 mb-6">
            <div className={`metric p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-600' : 'bg-gray-100'}`}>
              <h3 className="text-md font-bold mb-2">Rounds Played</h3>
              <div className="text-2xl font-bold text-center">{history.length}</div>
            </div>
            
            <div className={`metric p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-600' : 'bg-gray-100'}`}>
              <h3 className="text-md font-bold mb-2">Success Rate</h3>
              <div className="text-2xl font-bold text-center">
                {history.length > 0 
                  ? `${(history.filter(h => h.scoreChange > 0).length / history.length * 100).toFixed(0)}%` 
                  : '0%'
                }
              </div>
            </div>
          </div>
          
          <div className="asset-performance mb-6">
            <h3 className="text-lg font-bold mb-2">Asset Performance</h3>
            
            <div className="grid grid-cols-5 gap-2">
              {Object.entries(priceHistory).map(([asset, prices]) => {
                const startPrice = prices[0];
                const endPrice = prices[prices.length - 1];
                const percentChange = ((endPrice - startPrice) / startPrice * 100).toFixed(1);
                
                return (
                  <div key={asset} className="asset-result">
                    <div className="capitalize text-sm font-bold mb-1">{asset}</div>
                    <div className={`text-sm font-bold ${percentChange > 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {percentChange > 0 ? '+' : ''}{percentChange}%
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          
          <div className="action-buttons flex justify-center space-x-4">
            <button 
              onClick={startGame}
              className="btn-play-again py-2 px-6 bg-green-500 text-white rounded-lg font-bold flex items-center hover:bg-green-600 transition-colors"
            >
              <RefreshCcw className="mr-2" /> Play Again
            </button>
            
            <button 
              onClick={() => setShowLeaderboard(true)}
              className="btn-leaderboard py-2 px-6 bg-blue-500 text-white rounded-lg font-bold flex items-center hover:bg-blue-600 transition-colors"
            >
              <Award className="mr-2" /> Leaderboard
            </button>
          </div>
        </div>
      )}
      
      {/* Settings modal */}
      {showSettings && (
        <div className="settings-modal fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className={`settings-content p-6 rounded-lg max-w-md w-full ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Settings</h2>
              <button 
                onClick={() => setShowSettings(false)} 
                className="text-gray-500 hover:text-gray-700"
                aria-label="Close settings"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="settings-options space-y-4">
              <div className="setting-option">
                <div className="flex justify-between items-center">
                  <label className="flex items-center">
                    <Sun size={20} className="mr-2 text-yellow-500" />
                    <span>Theme</span>
                  </label>
                  <button 
                    onClick={toggleTheme} 
                    className={`p-2 rounded-full ${theme === 'dark' ? 'bg-yellow-500' : 'bg-gray-700 text-white'}`}
                    aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
                  >
                    {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
                  </button>
                </div>
              </div>
              
              <div className="setting-option">
                <div className="flex justify-between items-center">
                  <label className="flex items-center">
                    <Activity size={20} className="mr-2 text-blue-500" />
                    <span>Sound Effects</span>
                  </label>
                  <button 
                    onClick={() => setSfxEnabled(!sfxEnabled)} 
                    className={`p-2 rounded-full ${sfxEnabled ? 'bg-green-500 text-white' : 'bg-gray-300'}`}
                    aria-label={`${sfxEnabled ? 'Disable' : 'Enable'} sound effects`}
                    aria-pressed={sfxEnabled}
                  >
                    {sfxEnabled ? <Check size={16} /> : <X size={16} />}
                  </button>
                </div>
              </div>
              
              <div className="setting-option">
                <div className="flex justify-between items-center">
                  <label className="flex items-center">
                    <Activity size={20} className="mr-2 text-purple-500" />
                    <span>Background Music</span>
                  </label>
                  <button 
                    onClick={() => setMusicEnabled(!musicEnabled)} 
                    className={`p-2 rounded-full ${musicEnabled ? 'bg-green-500 text-white' : 'bg-gray-300'}`}
                    aria-label={`${musicEnabled ? 'Disable' : 'Enable'} background music`}
                    aria-pressed={musicEnabled}
                  >
                    {musicEnabled ? <Check size={16} /> : <X size={16} />}
                  </button>
                </div>
              </div>
              
              <div className="setting-option">
                <label className="block mb-2 flex items-center">
                  <Clock size={20} className="mr-2 text-red-500" />
                  <span>Difficulty</span>
                </label>
                <select 
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                  className={`p-2 rounded border w-full ${theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
                  aria-label="Select difficulty"
                >
                  <option value="easy">Easy</option>
                  <option value="normal">Normal</option>
                  <option value="hard">Hard</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Tutorial modal */}
      {showTutorial && (
        <div className="tutorial-modal fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className={`tutorial-content p-6 rounded-lg max-w-2xl w-full ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">{tutorialSteps[tutorialStep].title}</h2>
              <button 
                onClick={() => setShowTutorial(false)} 
                className="text-gray-500 hover:text-gray-700"
                aria-label="Close tutorial"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="tutorial-step py-4">
              <p className="text-lg mb-6">{tutorialSteps[tutorialStep].content}</p>
              
              <div className="tutorial-image h-48 mb-6 flex items-center justify-center rounded-lg bg-gray-100">
                {tutorialStep === 0 && <Coins size={64} className="text-yellow-500" />}
                {tutorialStep === 1 && <AlertCircle size={64} className="text-red-500" />}
                {tutorialStep === 2 && <Briefcase size={64} className="text-blue-500" />}
                {tutorialStep === 3 && <Clock size={64} className="text-purple-500" />}
                {tutorialStep === 4 && <DollarSign size={64} className="text-green-500" />}
                {tutorialStep === 5 && <Activity size={64} className="text-indigo-500" />}
                {tutorialStep === 6 && <Award size={64} className="text-yellow-500" />}
              </div>
              
              <div className="navigation-buttons flex justify-between">
                <button 
                  onClick={prevTutorialStep}
                  className={`py-2 px-4 rounded-lg flex items-center ${
                    tutorialStep > 0 ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                  disabled={tutorialStep === 0}
                  aria-label="Previous tutorial step"
                >
                  <ChevronLeft className="mr-1" /> Previous
                </button>
                
                <div className="step-indicators flex space-x-1" role="tablist" aria-label="Tutorial progress">
                  {tutorialSteps.map((_, idx) => (
                    <div 
                      key={idx} 
                      className={`w-2 h-2 rounded-full ${
                        idx === tutorialStep ? 'bg-blue-500' : 'bg-gray-300'
                      }`}
                      role="tab"
                      aria-selected={idx === tutorialStep}
                      aria-label={`Step ${idx + 1}`}
                    />
                  ))}
                </div>
                
                <button 
                  onClick={tutorialStep < tutorialSteps.length - 1 ? nextTutorialStep : () => setShowTutorial(false)}
                  className="py-2 px-4 bg-blue-500 text-white rounded-lg flex items-center"
                  aria-label={tutorialStep < tutorialSteps.length - 1 ? "Next tutorial step" : "Start playing"}
                >
                  {tutorialStep < tutorialSteps.length - 1 ? 'Next' : 'Start Playing'} <ChevronRight className="ml-1" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PortfolioPanicGame;
