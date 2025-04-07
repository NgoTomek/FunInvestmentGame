import React, { useState, useEffect } from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';

const PortfolioPanicGame = () => {
  // Game states
  const [gameScreen, setGameScreen] = useState('menu'); // menu, game, results, instructions, settings, assetInfo
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
  
  const [assetTrends, setAssetTrends] = useState({
    stocks: 'up',
    gold: 'up',
    crypto: 'down',
    bonds: 'down'
  });
  
  const [timer, setTimer] = useState(60);
  const [paused, setPaused] = useState(false);
  const [currentNews, setCurrentNews] = useState({
    message: "New smartphone model is a hit!",
    impact: { stocks: 1.05, gold: 0.98, crypto: 1.02, bonds: 0.99 }
  });
  
  const [settings, setSettings] = useState({
    sound: true,
    music: true
  });
  
  const [showNewsPopup, setShowNewsPopup] = useState(false);
  const [newsPopup, setNewsPopup] = useState({
    title: "COMPANY X REPORTS STRONG EARNINGS!",
    message: "The stock price of Company X jumps after they announce better-than-expected quarterly earnings.",
    tip: "Positive news will usually cause a stock to rise."
  });
  
  const [gameResult, setGameResult] = useState({
    finalValue: 0,
    returnPercentage: 0
  });
  
  // Calculate total portfolio value
  const calculatePortfolioValue = () => {
    return portfolio.cash + 
      (portfolio.stocks * assetPrices.stocks) +
      (portfolio.gold * assetPrices.gold) +
      (portfolio.crypto * assetPrices.crypto) +
      (portfolio.bonds * assetPrices.bonds);
  };
  
  // Format currency display
  const formatCurrency = (value) => {
    return '$' + value.toLocaleString();
  };
  
  // Buy asset handler
  const handleBuy = (asset) => {
    if (portfolio.cash >= assetPrices[asset]) {
      setPortfolio({
        ...portfolio,
        [asset]: portfolio[asset] + 1,
        cash: portfolio.cash - assetPrices[asset]
      });
    }
  };
  
  // Sell asset handler
  const handleSell = (asset) => {
    if (portfolio[asset] > 0) {
      setPortfolio({
        ...portfolio,
        [asset]: portfolio[asset] - 1,
        cash: portfolio.cash + assetPrices[asset]
      });
    }
  };
  
  // Start game
  const startGame = () => {
    setGameScreen('game');
    setPortfolio({
      cash: 10000,
      stocks: 0,
      gold: 0,
      crypto: 0,
      bonds: 0
    });
    setTimer(60);
    setPaused(false);
    generateNews();
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
      }
    ];
    
    const randomNews = newsEvents[Math.floor(Math.random() * newsEvents.length)];
    
    setNewsPopup(randomNews);
    setCurrentNews({
      message: randomNews.title,
      impact: randomNews.impact
    });
    
    setShowNewsPopup(true);
    
    // Apply market effects
    setTimeout(() => {
      updateMarket(randomNews.impact);
    }, 3000);
  };
  
  // Update market prices based on news impact
  const updateMarket = (impact) => {
    setAssetPrices(prev => ({
      stocks: Math.round(prev.stocks * impact.stocks),
      gold: Math.round(prev.gold * impact.gold),
      crypto: Math.round(prev.crypto * impact.crypto),
      bonds: Math.round(prev.bonds * impact.bonds)
    }));
    
    // Update trends
    setAssetTrends({
      stocks: impact.stocks > 1 ? 'up' : 'down',
      gold: impact.gold > 1 ? 'up' : 'down',
      crypto: impact.crypto > 1 ? 'up' : 'down',
      bonds: impact.bonds > 1 ? 'up' : 'down'
    });
  };
  
  // End game and show results
  const endGame = () => {
    const finalValue = calculatePortfolioValue();
    const returnPercentage = ((finalValue - 10000) / 10000) * 100;
    
    setGameResult({
      finalValue,
      returnPercentage
    });
    
    setGameScreen('results');
  };
  
  // Timer effect
  useEffect(() => {
    let interval;
    
    if (gameScreen === 'game' && !paused && timer > 0) {
      interval = setInterval(() => {
        setTimer(prev => {
          if (prev <= 1) {
            clearInterval(interval);
            endGame();
            return 0;
          }
          return prev - 1;
        });
        
        // Generate news every 15 seconds
        if (timer % 15 === 0 && timer !== 60) {
          generateNews();
        }
      }, 1000);
    }
    
    return () => clearInterval(interval);
  }, [gameScreen, paused, timer]);
  
  // Format time display
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };
  
  // Toggle settings
  const toggleSetting = (setting) => {
    setSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };
  
  // Render main menu screen
  const renderMainMenu = () => (
    <div className="h-screen flex flex-col items-center justify-center bg-teal-600 p-4">
      <h1 className="text-7xl font-bold text-white mb-20">PORTFOLIO<br/>PANIC!</h1>
      
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
    </div>
  );
  
  // Render game screen
  const renderGameScreen = () => (
    <div className="h-screen flex flex-col bg-teal-600 p-4">
      {/* Header */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-gray-800 text-white p-4 rounded-lg flex items-center justify-center">
          <span className="text-4xl font-bold">{formatCurrency(calculatePortfolioValue())}</span>
        </div>
        
        <div className="bg-gray-800 text-white p-4 rounded-lg flex items-center justify-center">
          <span className="text-xl font-bold">TIME:</span>
          <span className="text-4xl font-bold ml-2">{formatTime(timer)}</span>
        </div>
      </div>
      
      {/* Asset Grid */}
      <div className="grid grid-cols-2 gap-4 mb-auto">
        {/* Stocks */}
        <div className="bg-gray-800 text-white p-4 rounded-lg">
          <div className="flex items-center mb-2">
            {assetTrends.stocks === 'up' ? 
              <ArrowUp className="text-yellow-400" size={20} /> : 
              <ArrowDown className="text-red-500" size={20} />
            }
            <h3 className="text-2xl font-bold ml-2">STOCKS</h3>
          </div>
          <p className="text-4xl font-bold mb-4">${assetPrices.stocks}</p>
          <div className="grid grid-cols-2 gap-2">
            <button 
              onClick={() => handleBuy('stocks')}
              className="bg-blue-600 text-white py-2 px-4 rounded-lg font-bold"
            >
              BUY
            </button>
            <button 
              onClick={() => handleSell('stocks')}
              className="bg-blue-600 text-white py-2 px-4 rounded-lg font-bold"
            >
              SELL
            </button>
          </div>
        </div>
        
        {/* Gold */}
        <div className="bg-gray-800 text-white p-4 rounded-lg">
          <div className="flex items-center mb-2">
            {assetTrends.gold === 'up' ? 
              <ArrowUp className="text-green-500" size={20} /> : 
              <ArrowDown className="text-red-500" size={20} />
            }
            <h3 className="text-2xl font-bold ml-2">GOLD</h3>
          </div>
          <p className="text-4xl font-bold mb-4">{assetPrices.gold}</p>
          <div className="grid grid-cols-2 gap-2">
            <button 
              onClick={() => handleBuy('gold')}
              className="bg-blue-600 text-white py-2 px-4 rounded-lg font-bold"
            >
              BUY
            </button>
            <button 
              onClick={() => handleSell('gold')}
              className="bg-blue-600 text-white py-2 px-4 rounded-lg font-bold"
            >
              SELL
            </button>
          </div>
        </div>
        
        {/* Crypto */}
        <div className="bg-gray-800 text-white p-4 rounded-lg">
          <div className="flex items-center mb-2">
            {assetTrends.crypto === 'up' ? 
              <ArrowUp className="text-green-500" size={20} /> : 
              <ArrowDown className="text-red-500" size={20} />
            }
            <h3 className="text-2xl font-bold ml-2">CRYPTO</h3>
          </div>
          <p className="text-4xl font-bold mb-4">${assetPrices.crypto}</p>
          <div className="grid grid-cols-2 gap-2">
            <button 
              onClick={() => handleBuy('crypto')}
              className="bg-blue-600 text-white py-2 px-4 rounded-lg font-bold"
            >
              BUY
            </button>
            <button 
              onClick={() => handleSell('crypto')}
              className="bg-blue-600 text-white py-2 px-4 rounded-lg font-bold"
            >
              SELL
            </button>
          </div>
        </div>
        
        {/* Bonds */}
        <div className="bg-gray-800 text-white p-4 rounded-lg">
          <div className="flex items-center mb-2">
            {assetTrends.bonds === 'up' ? 
              <ArrowUp className="text-green-500" size={20} /> : 
              <ArrowDown className="text-red-500" size={20} />
            }
            <h3 className="text-2xl font-bold ml-2">BONDS</h3>
          </div>
          <p className="text-4xl font-bold mb-4">${assetPrices.bonds}</p>
          <div className="grid grid-cols-2 gap-2">
            <button 
              onClick={() => handleBuy('bonds')}
              className="bg-blue-600 text-white py-2 px-4 rounded-lg font-bold"
            >
              BUY
            </button>
            <button 
              onClick={() => handleSell('bonds')}
              className="bg-blue-600 text-white py-2 px-4 rounded-lg font-bold"
            >
              SELL
            </button>
          </div>
        </div>
      </div>
      
      {/* News Ticker */}
      <div className="bg-gray-800 text-white p-4 rounded-lg mb-4">
        <p className="text-lg font-bold">{currentNews.message}</p>
      </div>
      
      {/* Footer */}
      <div className="bg-gray-800 text-white p-4 rounded-lg">
        <h2 className="text-2xl font-bold text-center">
          <span className="text-white">PORTFOLIO</span> <span className="text-yellow-400">PANIC</span>
        </h2>
      </div>
      
      {/* News Popup */}
      {showNewsPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
          <div className="bg-gray-800 text-white p-6 rounded-lg max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4">{newsPopup.title}</h2>
            <p className="mb-4">{newsPopup.message}</p>
            <p className="text-yellow-400 mb-6">TIP: {newsPopup.tip}</p>
            <button 
              onClick={() => setShowNewsPopup(false)}
              className="bg-gray-300 text-gray-800 py-2 px-8 rounded-lg font-bold"
            >
              OK
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
        
        <div className="mb-8">
          <h3 className="text-2xl font-bold mb-2">FINAL VALUE</h3>
          <p className="text-5xl font-bold">{formatCurrency(gameResult.finalValue)}</p>
        </div>
        
        <div className="mb-8">
          <h3 className="text-2xl font-bold mb-2">RETURN:</h3>
          <p className={`text-5xl font-bold ${gameResult.returnPercentage >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            {gameResult.returnPercentage >= 0 ? '+' : ''}{gameResult.returnPercentage.toFixed(1)}%
          </p>
        </div>
        
        <p className="text-xl mb-8">
          Great job! You navigated the market volatility and grew your investment portfolio.
        </p>
        
        <button 
          onClick={() => setGameScreen('menu')}
          className="bg-blue-600 text-white py-3 px-8 rounded-lg font-bold w-full"
        >
          CONTINUE
        </button>
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
        <h2 className="text-4xl font-bold mb-8 text-center">INSTRUCTIONS</h2>
        
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
        
        <button 
          onClick={() => setGameScreen('menu')}
          className="bg-blue-600 text-white py-3 px-8 rounded-lg font-bold w-full"
        >
          CONTINUE
        </button>
      </div>
      
      <div className="bg-gray-800 text-white p-4 rounded-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center">
          <span className="text-white">PORTFOLIO</span> <span className="text-yellow-400">PANIC</span>
        </h2>
      </div>
    </div>
  );
  
  // Render settings screen
  const renderSettingsScreen = () => (
    <div className="h-screen flex flex-col items-center justify-center bg-teal-600 p-4">
      <div className="bg-gray-800 text-white p-8 rounded-lg w-full max-w-md mb-8">
        <h2 className="text-4xl font-bold mb-8 text-center">SETTINGS</h2>
        
        <div className="mb-6">
          <div className="flex justify-between items-center">
            <span className="text-2xl font-bold">SOUND</span>
            <button 
              onClick={() => toggleSetting('sound')}
              className={`w-14 h-7 rounded-full relative ${settings.sound ? 'bg-blue-600' : 'bg-gray-600'}`}
            >
              <span className={`absolute w-5 h-5 bg-white rounded-full top-1 transition-transform ${settings.sound ? 'left-8' : 'left-1'}`}></span>
            </button>
          </div>
        </div>
        
        <div className="mb-10">
          <div className="flex justify-between items-center">
            <span className="text-2xl font-bold">MUSIC</span>
            <button 
              onClick={() => toggleSetting('music')}
              className={`w-14 h-7 rounded-full relative ${settings.music ? 'bg-blue-600' : 'bg-gray-600'}`}
            >
              <span className={`absolute w-5 h-5 bg-white rounded-full top-1 transition-transform ${settings.music ? 'left-8' : 'left-1'}`}></span>
            </button>
          </div>
        </div>
        
        <button 
          onClick={() => setGameScreen('menu')}
          className="bg-blue-600 text-white py-3 px-8 rounded-lg font-bold w-full"
        >
          MAIN MENU
        </button>
      </div>
      
      <div className="bg-gray-800 text-white p-4 rounded-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center">
          <span className="text-white">PORTFOLIO</span> <span className="text-yellow-400">PANIC!</span>
        </h2>
      </div>
    </div>
  );
  
  // Render asset info screen
  const renderAssetInfoScreen = () => (
    <div className="h-screen flex flex-col items-center justify-center bg-teal-600 p-4">
      <div className="bg-gray-800 text-white p-8 rounded-lg w-full max-w-md mb-8">
        <h2 className="text-4xl font-bold mb-8 text-center">ASSET INFO</h2>
        
        <div className="mb-6">
          <h3 className="text-2xl font-bold mb-2">STOCKS</h3>
          <p className="mb-4">Shares of publicly traded companies. Stocks tend to rise with good company news and economic growth.</p>
        </div>
        
        <div className="mb-6">
          <h3 className="text-2xl font-bold mb-2">GOLD</h3>
          <p className="mb-4">Precious metal that often serves as a safe haven during market uncertainty or inflation.</p>
        </div>
        
        <div className="mb-6">
          <h3 className="text-2xl font-bold mb-2">CRYPTO</h3>
          <p className="mb-4">Digital currencies with high volatility. Affected by adoption news, regulation, and market sentiment.</p>
        </div>
        
        <div className="mb-6">
          <h3 className="text-2xl font-bold mb-2">BONDS</h3>
          <p className="mb-4">Debt securities that typically provide stability but are sensitive to interest rate changes.</p>
        </div>
        
        <button 
          onClick={() => setGameScreen('menu')}
          className="bg-blue-600 text-white py-3 px-8 rounded-lg font-bold w-full"
        >
          BACK
        </button>
      </div>
      
      <div className="bg-gray-800 text-white p-4 rounded-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center">
          <span className="text-white">PORTFOLIO</span> <span className="text-yellow-400">PANIC!</span>
        </h2>
      </div>
    </div>
  );
  
  // Render based on current game screen
  switch (gameScreen) {
    case 'game':
      return renderGameScreen();
    case 'results':
      return renderResultsScreen();
    case 'instructions':
      return renderInstructionsScreen();
    case 'settings':
      return renderSettingsScreen();
    case 'assetInfo':
      return renderAssetInfoScreen();
    default:
      return renderMainMenu();
  }
};

export default PortfolioPanicGame;
