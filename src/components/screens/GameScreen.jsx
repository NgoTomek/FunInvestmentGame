import React, { useState, useEffect, useRef } from 'react';
import { ArrowUp, ArrowDown, AlertTriangle, TrendingUp, TrendingDown, DollarSign, Clock, BarChart2, Award, Info, Settings, HelpCircle, ArrowLeft } from 'lucide-react';
import AssetCard from '../game/AssetCard';
import TradeModal from '../game/TradeModal';
import MarketNews from '../game/MarketNews';
import PortfolioSummary from '../game/PortfolioSummary';
import NotificationSystem from '../game/NotificationSystem';
import TabNavigation from '../ui/TabNavigation';
import { generateNewsEvent, updateMarketPrices } from '../../utils/marketLogic';

const GameScreen = ({ 
  portfolio, assetPrices, setAssetPrices, assetQuantities, setAssetQuantities,
  assetTrends, setAssetTrends, assetVolatility, setAssetVolatility, priceHistory, setPriceHistory, timer, setTimer,
  marketUpdateCountdown, setMarketUpdateCountdown, round, setRound,
  totalRounds, paused, setPaused, currentNews, setCurrentNews, showNewsPopup,
  setShowNewsPopup, newsPopup, setNewsPopup, showMarketAlert, setShowMarketAlert,
  marketAlert, setMarketAlert, selectedTab, setSelectedTab, notifications,
  addNotification, handleTrade, calculatePortfolioValue, formatCurrency,
  gameStats, setGameStats, difficulty, difficultySettings, gameMode,
  handleEndGame, setGameScreen, achievements, checkAchievements
}) => {
  // Timer references
  const gameTimerRef = useRef(null);
  const marketUpdateRef = useRef(null);
  
  // Trade modal state
  const [showTradeModal, setShowTradeModal] = useState(false);
  const [tradeAsset, setTradeAsset] = useState(null);
  const [tradeAction, setTradeAction] = useState('buy');
  
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
      assetVolatility,
      newsImpact,
      difficulty,
      gameMode
    );
    
    setAssetPrices(result.updatedPrices);
    setPriceHistory(result.updatedPriceHistory);
    setAssetTrends(result.updatedTrends);
    
    // Check achievements after market update
    checkAchievements();
  };
  
  // Generate news event
  const generateNews = () => {
    const newsEvent = generateNewsEvent(gameMode, difficulty, difficultySettings);
    
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
    
    // Restart timers
    startGameTimer();
    startMarketUpdates();
    
    // Generate news for next round
    generateNews();
    
    // Check achievements at end of round
    checkAchievements();
    
    addNotification(`Round ${round} completed. Starting round ${round + 1}!`, 'info');
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
  
  // Format time display (mm:ss)
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  // Open trade modal
  const openTradeModal = (asset, defaultAction = 'buy') => {
    setTradeAsset(asset);
    setTradeAction(defaultAction);
    setShowTradeModal(true);
  };
  
  // Handle trade from modal
  const handleTradeSubmit = (asset, action, quantity) => {
    handleTrade(asset, action, quantity);
    setShowTradeModal(false);
  };
  
  // Start timers when component mounts
  useEffect(() => {
    startGameTimer();
    startMarketUpdates();
    generateNews();
    
    // Intro notification
    setTimeout(() => {
      addNotification(`Welcome to ${gameMode.charAt(0).toUpperCase() + gameMode.slice(1)} Mode!`, 'info');
    }, 500);
    
    // Cleanup on unmount
    return () => {
      if (gameTimerRef.current) clearInterval(gameTimerRef.current);
      if (marketUpdateRef.current) clearInterval(marketUpdateRef.current);
    };
  }, []);
  
  // Render portfolio tab content
  const renderPortfolioTab = () => (
    <div className="grid grid-cols-2 gap-4 mb-auto">
      {/* Cash Display */}
      <div className="bg-gray-800 text-white p-4 rounded-lg">
        <h3 className="text-2xl font-bold mb-2">CASH</h3>
        <p className="text-4xl font-bold mb-4">{formatCurrency(portfolio.cash)}</p>
        <p className="text-sm text-gray-400">Available for purchases</p>
      </div>
      
      {/* Portfolio Summary */}
      <PortfolioSummary 
        portfolio={portfolio}
        assetQuantities={assetQuantities}
        assetPrices={assetPrices}
        calculatePortfolioValue={calculatePortfolioValue}
        formatCurrency={formatCurrency}
      />
      
      {/* Asset Cards */}
      {['stocks', 'gold', 'crypto', 'bonds'].map(asset => (
        <AssetCard 
          key={asset}
          asset={asset}
          price={assetPrices[asset]}
          quantity={assetQuantities[asset]}
          trend={assetTrends[asset]}
          priceHistory={priceHistory[asset]}
          openTradeModal={openTradeModal}
          formatCurrency={formatCurrency}
        />
      ))}
    </div>
  );
  
  // Render market tab content
  const renderMarketTab = () => (
    <div className="bg-gray-800 text-white p-4 rounded-lg mb-auto">
      <h3 className="text-2xl font-bold mb-4">Market Overview</h3>
      
      <div className="grid grid-cols-4 gap-4 mb-4">
        {Object.entries(assetPrices).map(([asset, price]) => (
          <div key={asset} className="border border-gray-700 p-3 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="capitalize font-bold">{asset}</span>
              <div className="flex">
                {assetTrends[asset].direction === 'up' ? (
                  Array(assetTrends[asset].strength).fill(0).map((_, i) => (
                    <ArrowUp key={`${asset}-up-${i}`} className="text-green-500" size={16} />
                  ))
                ) : (
                  Array(assetTrends[asset].strength).fill(0).map((_, i) => (
                    <ArrowDown key={`${asset}-down-${i}`} className="text-red-500" size={16} />
                  ))
                )}
              </div>
            </div>
            <div className="text-2xl font-bold">
              ${asset === 'gold' ? '' : '$'}{price}
            </div>
            {/* Mini chart */}
            <div className="flex items-end h-6 space-x-1 mt-2">
              {priceHistory[asset].slice(-5).map((price, i, arr) => {
                const max = Math.max(...arr);
                const min = Math.min(...arr);
                const range = max - min || 1;
                const height = ((price - min) / range) * 100;
                const color = i === arr.length - 1 
                  ? (price >= arr[i-1] ? 'bg-green-500' : 'bg-red-500')
                  : (price >= (arr[i-1] || price) ? 'bg-green-300' : 'bg-red-300');
                
                return (
                  <div 
                    key={`${asset}-chart-${i}`}
                    className={`w-1 ${color}`} 
                    style={{ height: `${Math.max(10, height)}%` }}
                  ></div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      
      <MarketNews 
        currentNews={currentNews}
      />
    </div>
  );
  
  // Render analysis tab content
  const renderAnalysisTab = () => (
    <div className="bg-gray-800 text-white p-4 rounded-lg mb-auto">
      <h3 className="text-2xl font-bold mb-4">Portfolio Analysis</h3>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        {/* Current Value */}
        <div className="border border-gray-700 p-3 rounded-lg">
          <h4 className="text-lg font-bold mb-2">Current Value</h4>
          <div className="text-3xl font-bold">{formatCurrency(calculatePortfolioValue())}</div>
          <div className="text-sm text-gray-400 mt-1">
            Starting: {formatCurrency(difficultySettings[difficulty].startingCash)}
          </div>
          
          {/* Return visualization */}
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
        
        {/* Trading Stats */}
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
      
      {/* Portfolio Composition */}
      <div className="mt-2">
        <div className="text-sm font-bold mb-1">Portfolio Allocation</div>
        <div className="flex h-6 rounded-lg overflow-hidden">
          {Object.entries({
            cash: (portfolio.cash / calculatePortfolioValue()) * 100,
            stocks: (assetQuantities.stocks * assetPrices.stocks / calculatePortfolioValue()) * 100,
            gold: (assetQuantities.gold * assetPrices.gold / calculatePortfolioValue()) * 100,
            crypto: (assetQuantities.crypto * assetPrices.crypto / calculatePortfolioValue()) * 100,
            bonds: (assetQuantities.bonds * assetPrices.bonds / calculatePortfolioValue()) * 100
          }).map(([asset, percentage]) => {
            if (percentage < 1) return null;
            
            const color = asset === 'cash' ? 'bg-gray-400' :
                          asset === 'stocks' ? 'bg-blue-500' :
                          asset === 'gold' ? 'bg-yellow-500' :
                          asset === 'crypto' ? 'bg-purple-500' :
                          'bg-green-500';
            
            const width = `${percentage}%`;
            
            return (
              <div 
                key={asset}
                className={`${color} h-full`}
                style={{ width }}
                title={`${asset}: ${percentage.toFixed(1)}%`}
              ></div>
            );
          })}
        </div>
        <div className="flex justify-between text-xs mt-1">
          {Object.entries({
            cash: (portfolio.cash / calculatePortfolioValue()) * 100,
            stocks: (assetQuantities.stocks * assetPrices.stocks / calculatePortfolioValue()) * 100,
            gold: (assetQuantities.gold * assetPrices.gold / calculatePortfolioValue()) * 100,
            crypto: (assetQuantities.crypto * assetPrices.crypto / calculatePortfolioValue()) * 100,
            bonds: (assetQuantities.bonds * assetPrices.bonds / calculatePortfolioValue()) * 100
          }).map(([asset, percentage]) => {
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
      
      {/* Risk Analysis */}
      <h4 className="text-lg font-bold mt-4 mb-2">Risk Analysis</h4>
      <div className="grid grid-cols-4 gap-2">
        {Object.entries({
          stocks: 0.08,
          gold: 0.05,
          crypto: 0.15,
          bonds: 0.03
        }).map(([asset, volatility]) => (
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
      
      {/* Achievements */}
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
  );
  
  return (
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
      <TabNavigation 
        tabs={[
          { id: 'portfolio', label: 'Portfolio' },
          { id: 'market', label: 'Market' },
          { id: 'analysis', label: 'Analysis' }
        ]}
        selectedTab={selectedTab}
        setSelectedTab={setSelectedTab}
      />
      
      {/* Tab Content */}
      {selectedTab === 'portfolio' && renderPortfolioTab()}
      {selectedTab === 'market' && renderMarketTab()}
      {selectedTab === 'analysis' && renderAnalysisTab()}
      
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
      <NotificationSystem notifications={notifications} />
      
      {/* News Popup */}
      {showNewsPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-30">
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
      
      {/* Trade Modal */}
      {showTradeModal && tradeAsset && (
        <TradeModal
          asset={tradeAsset}
          price={assetPrices[tradeAsset]}
          quantity={assetQuantities[tradeAsset]}
          cash={portfolio.cash}
          initialAction={tradeAction}
          onClose={() => setShowTradeModal(false)}
          onSubmit={handleTradeSubmit}
          formatCurrency={formatCurrency}
        />
      )}
    </div>
  );
};

export default GameScreen;