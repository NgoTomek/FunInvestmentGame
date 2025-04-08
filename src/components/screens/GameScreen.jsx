import React, { useState, useEffect, useRef } from 'react';
import { ArrowUp, ArrowDown, AlertTriangle, TrendingUp, TrendingDown, DollarSign, Clock, BarChart2, Award, Settings, HelpCircle, Info, ArrowLeft } from 'lucide-react';
import AssetCard from '../game/AssetCard';
import TradeModal from '../game/TradeModal';
import MarketNews from '../game/MarketNews';
import PortfolioSummary from '../game/PortfolioSummary';
import NotificationSystem from '../game/NotificationSystem';
import TabNavigation from '../ui/TabNavigation';
import PriceChart from '../game/PriceChart';
import MarketOpportunityCard from '../game/MarketOppurtunityCard';
import { generateNewsEvent, updateMarketPrices, generateMarketOpportunity } from '../../utils/marketLogic';
import { calculatePortfolioValue } from '../../utils/portfoliomanager';

const GameScreen = ({ 
  portfolio, 
  setPortfolio, 
  assetPrices, 
  setAssetPrices, 
  assetData, 
  setAssetData, 
  timer, 
  setTimer, 
  round, 
  setRound, 
  totalRounds, 
  paused, 
  setPaused, 
  currentNews, 
  setCurrentNews, 
  gameStats, 
  setGameStats, 
  difficulty, 
  difficultySettings, 
  gameMode, 
  handleEndGame, 
  setGameScreen, 
  achievements, 
  checkAchievements, 
  addNotification
}) => {
  // Create state for items not provided by parent
  const [selectedTab, setSelectedTab] = useState('portfolio');
  const [priceHistory, setPriceHistory] = useState({
    stocks: [assetPrices.stocks, assetPrices.stocks * 0.98, assetPrices.stocks * 1.02, assetPrices.stocks * 0.99, assetPrices.stocks * 1.03],
    oil: [assetPrices.oil, assetPrices.oil * 0.97, assetPrices.oil * 1.03, assetPrices.oil * 1.01, assetPrices.oil * 0.99],
    gold: [assetPrices.gold, assetPrices.gold * 1.01, assetPrices.gold * 0.99, assetPrices.gold * 1.02, assetPrices.gold * 0.98],
    crypto: [assetPrices.crypto, assetPrices.crypto * 0.96, assetPrices.crypto * 1.05, assetPrices.crypto * 0.98, assetPrices.crypto * 1.04]
  });
  const [assetTrends, setAssetTrends] = useState({
    stocks: { direction: 'up', strength: 1 },
    oil: { direction: 'up', strength: 1 },
    gold: { direction: 'up', strength: 1 },
    crypto: { direction: 'up', strength: 2 }
  });
  const [marketUpdateCountdown, setMarketUpdateCountdown] = useState(10);
  const [showNewsPopup, setShowNewsPopup] = useState(false);
  const [newsPopup, setNewsPopup] = useState({ title: '', message: '', tip: '' });
  const [showMarketAlert, setShowMarketAlert] = useState(false);
  const [marketAlert, setMarketAlert] = useState({ title: '', message: '' });
  const [marketOpportunity, setMarketOpportunity] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [assetVolatility, setAssetVolatility] = useState({
    stocks: 0.08,
    oil: 0.10,
    gold: 0.05,
    crypto: 0.15
  });

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
    
    // Random chance to generate market opportunity (5%)
    if (Math.random() < 0.05 && !marketOpportunity) {
      setMarketOpportunity(generateMarketOpportunity());
    }
    
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
    
    // Clear market opportunity
    setMarketOpportunity(null);
    
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
  
  // Format currency
  const formatCurrency = (value) => {
    return '$' + Math.round(value).toLocaleString();
  };
  
  // Open trade modal
  const openTradeModal = (asset, defaultAction = 'buy') => {
    setTradeAsset(asset);
    setTradeAction(defaultAction);
    setShowTradeModal(true);
  };
  
  // Handle trade
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
  
  // Handle trade from modal
  const handleTradeSubmit = (asset, action, quantity) => {
    handleTrade(asset, action, quantity);
    setShowTradeModal(false);
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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-auto">
      {/* Cash Display */}
      <div className="bg-gray-800 text-white p-4 rounded-lg">
        <h3 className="text-2xl font-bold mb-2 flex items-center">
          <DollarSign className="mr-2 text-green-500" size={20} />
          CASH
        </h3>
        <p className="text-4xl font-bold mb-4">{formatCurrency(portfolio.cash)}</p>
        <p className="text-sm text-gray-400">Available for purchases</p>
      </div>
      
      {/* Portfolio Summary */}
      <PortfolioSummary 
        portfolio={portfolio}
        assetQuantities={assetData.quantities}
        assetPrices={assetPrices}
        calculatePortfolioValue={() => calculatePortfolioValue(portfolio, assetData, assetPrices)}
        formatCurrency={formatCurrency}
      />
      
      {/* Asset Cards */}
      {Object.keys(assetPrices).map(asset => (
        <AssetCard 
          key={asset}
          asset={asset}
          price={assetPrices[asset]}
          value={(assetData.quantities[asset] || 0) * assetPrices[asset]}
          trend={assetTrends[asset] || { direction: 'up', strength: 1 }}
          priceHistory={priceHistory[asset] || [assetPrices[asset]]}
          handleQuickTrade={(asset, action, amount) => handleTrade(asset, action, amount)}
          formatCurrency={formatCurrency}
          cash={portfolio.cash}
        />
      ))}
      
      {/* Market Opportunity Card (if available) */}
      {marketOpportunity && (
        <MarketOpportunityCard 
          opportunity={marketOpportunity}
          handleOpportunity={handleOpportunity}
        />
      )}
    </div>
  );
  
  // Render market tab content
  const renderMarketTab = () => (
    <div className="space-y-4 mb-auto">
      <div className="bg-gray-800 text-white p-4 rounded-lg">
        <h3 className="text-2xl font-bold mb-4 flex items-center">
          <BarChart2 className="mr-2 text-blue-500" size={24} />
          Market Overview
        </h3>
        
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
          {Object.entries(assetPrices).map(([asset, price]) => (
            <div key={asset} className="border border-gray-700 p-3 rounded-lg transition-all hover:border-blue-500 cursor-pointer"
                 onClick={() => openTradeModal(asset)}>
              <div className="flex items-center justify-between mb-2">
                <span className="capitalize font-bold">{asset}</span>
                <div className="flex">
                  {assetTrends[asset]?.direction === 'up' ? (
                    Array(assetTrends[asset]?.strength || 1).fill(0).map((_, i) => (
                      <ArrowUp key={`${asset}-up-${i}`} className="text-green-500" size={16} />
                    ))
                  ) : (
                    Array(assetTrends[asset]?.strength || 1).fill(0).map((_, i) => (
                      <ArrowDown key={`${asset}-down-${i}`} className="text-red-500" size={16} />
                    ))
                  )}
                </div>
              </div>
              <div className="text-2xl font-bold">
                ${Number(price).toLocaleString()}
              </div>
              {/* Mini chart */}
              <div className="flex items-end h-6 space-x-1 mt-2">
                {(priceHistory[asset] || [price]).slice(-5).map((histPrice, i, arr) => {
                  const max = Math.max(...arr);
                  const min = Math.min(...arr);
                  const range = max - min || 1;
                  const height = ((histPrice - min) / range) * 100;
                  const color = i === arr.length - 1 
                    ? (histPrice >= arr[i-1] ? 'bg-green-500' : 'bg-red-500')
                    : (histPrice >= (arr[i-1] || histPrice) ? 'bg-green-300' : 'bg-red-300');
                  
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
      </div>
      
      <MarketNews currentNews={currentNews} />
      
      {/* Selected Asset Chart */}
      {selectedTab === 'market' && (
        <PriceChart 
          asset={tradeAsset || 'stocks'}
          asset_name={tradeAsset ? tradeAsset.charAt(0).toUpperCase() + tradeAsset.slice(1) : 'Stocks'}
          priceHistory={priceHistory[tradeAsset || 'stocks'] || []}
        />
      )}
    </div>
  );
  
  // Render analysis tab content
  const renderAnalysisTab = () => {
    const portfolioValue = calculatePortfolioValue(portfolio, assetData, assetPrices);
    const startingCash = difficultySettings[difficulty].startingCash;
    const returnPct = ((portfolioValue - startingCash) / startingCash) * 100;
    
    return (
      <div className="space-y-4 mb-auto">
        <div className="bg-gray-800 text-white p-4 rounded-lg">
          <h3 className="text-2xl font-bold mb-4 flex items-center">
            <TrendingUp className="mr-2 text-green-500" size={24} />
            Portfolio Analysis
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            {/* Current Value */}
            <div className="border border-gray-700 p-3 rounded-lg">
              <h4 className="text-lg font-bold mb-2">Current Value</h4>
              <div className="text-3xl font-bold">{formatCurrency(portfolioValue)}</div>
              <div className="text-sm text-gray-400 mt-1">
                Starting: {formatCurrency(startingCash)}
              </div>
              
              {/* Return visualization */}
              <div className="mt-2">
                <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${returnPct >= 0 ? 'bg-green-500' : 'bg-red-500'}`}
                    style={{ width: `${Math.min(100, Math.max(0, (portfolioValue / startingCash) * 100))}%` }}
                  ></div>
                </div>
                <div className="text-sm mt-1">
                  {returnPct >= 0 ? (
                    <span className="text-green-500">
                      +{returnPct.toFixed(1)}%
                    </span>
                  ) : (
                    <span className="text-red-500">
                      {returnPct.toFixed(1)}%
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
          <div className="mt-4">
            <div className="text-lg font-bold mb-2">Portfolio Allocation</div>
            <div className="flex h-8 rounded-lg overflow-hidden">
              {Object.entries({
                cash: (portfolio.cash / portfolioValue) * 100,
                stocks: ((assetData.quantities.stocks || 0) * assetPrices.stocks / portfolioValue) * 100,
                oil: ((assetData.quantities.oil || 0) * assetPrices.oil / portfolioValue) * 100,
                gold: ((assetData.quantities.gold || 0) * assetPrices.gold / portfolioValue) * 100,
                crypto: ((assetData.quantities.crypto || 0) * assetPrices.crypto / portfolioValue) * 100
              }).map(([asset, percentage]) => {
                if (percentage < 1) return null;
                
                const color = asset === 'cash' ? 'bg-gray-400' :
                              asset === 'stocks' ? 'bg-blue-500' :
                              asset === 'oil' ? 'bg-black' :
                              asset === 'gold' ? 'bg-yellow-500' :
                              asset === 'crypto' ? 'bg-purple-500' :
                              'bg-green-500';
                
                const width = `${percentage}%`;
                
                return (
                  <div 
                    key={asset}
                    className={`${color} h-full transition-all`}
                    style={{ width }}
                    title={`${asset}: ${percentage.toFixed(1)}%`}
                  ></div>
                );
              })}
            </div>
            
            <div className="flex flex-wrap gap-2 mt-2">
              {Object.entries({
                cash: (portfolio.cash / portfolioValue) * 100,
                stocks: ((assetData.quantities.stocks || 0) * assetPrices.stocks / portfolioValue) * 100,
                oil: ((assetData.quantities.oil || 0) * assetPrices.oil / portfolioValue) * 100,
                gold: ((assetData.quantities.gold || 0) * assetPrices.gold / portfolioValue) * 100,
                crypto: ((assetData.quantities.crypto || 0) * assetPrices.crypto / portfolioValue) * 100
              }).map(([asset, percentage]) => {
                if (percentage < 5) return null;
                
                const color = asset === 'cash' ? 'bg-gray-400' :
                              asset === 'stocks' ? 'bg-blue-500' :
                              asset === 'oil' ? 'bg-black' :
                              asset === 'gold' ? 'bg-yellow-500' :
                              asset === 'crypto' ? 'bg-purple-500' :
                              'bg-green-500';
                
                return (
                  <div key={asset} className="flex items-center bg-gray-700 px-2 py-1 rounded-md">
                    <div className={`w-3 h-3 rounded-full mr-2 ${color}`}></div>
                    <span>{asset}: {percentage.toFixed(1)}%</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        
        {/* Risk Analysis */}
        <div className="bg-gray-800 text-white p-4 rounded-lg">
          <h4 className="text-lg font-bold mb-3 flex items-center">
            <AlertTriangle className="mr-2 text-yellow-500" size={20} />
            Risk Analysis
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {Object.entries(assetVolatility).map(([asset, volatility]) => (
              <div key={asset} className="border border-gray-700 p-3 rounded-lg">
                <div className="capitalize text-sm mb-1 flex justify-between">
                  <span>{asset}</span>
                  <span className={
                    volatility < 0.06 ? 'text-green-500' :
                    volatility < 0.10 ? 'text-yellow-500' :
                    'text-red-500'
                  }>
                    {volatility < 0.06 ? 'Low' :
                     volatility < 0.10 ? 'Medium' :
                     'High'}
                  </span>
                </div>
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
        </div>
        
        {/* Achievements */}
        <div className="bg-gray-800 text-white p-4 rounded-lg">
          <h4 className="text-lg font-bold mb-3 flex items-center">
            <Award className="mr-2 text-yellow-500" size={20} />
            Achievements
          </h4>
          {Object.entries(achievements).filter(([_, ach]) => ach.unlocked).length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {Object.entries(achievements).map(([id, ach]) => (
                ach.unlocked && (
                  <div key={id} className="bg-yellow-800 bg-opacity-30 text-yellow-300 px-3 py-2 rounded-lg text-sm font-bold flex items-center">
                    <Award size={16} className="mr-2" />
                    {ach.title}
                  </div>
                )
              ))}
            </div>
          ) : (
            <div className="text-sm text-gray-400 p-3 bg-gray-700 rounded-lg">
              No achievements unlocked yet. Keep playing to earn achievements!
            </div>
          )}
        </div>
      </div>
    );
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-teal-600 to-teal-800 p-4">
      {/* Header */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <div className="bg-gray-800 text-white p-4 rounded-lg flex items-center justify-between shadow-lg">
          <div>
            <div className="text-gray-400 text-xs uppercase tracking-wider mb-1">Portfolio Value</div>
            <span className="text-4xl font-bold">{formatCurrency(calculatePortfolioValue(portfolio, assetData, assetPrices))}</span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-gray-400 text-xs uppercase mb-1">Round</span>
            <span className="text-xl font-bold">{round}/{totalRounds}</span>
          </div>
        </div>
        
        <div className="bg-gray-800 text-white p-4 rounded-lg flex items-center justify-between shadow-lg">
          <div>
            <div className="text-gray-400 text-xs uppercase tracking-wider mb-1">Time Remaining</div>
            <div className="flex items-center">
              <Clock className="text-yellow-500 mr-2" size={24} />
              <span className="text-4xl font-bold">{formatTime(timer)}</span>
            </div>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-gray-400 text-xs uppercase mb-1">Next Update</span>
            <span className="text-xl font-bold">{marketUpdateCountdown}s</span>
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
      <div className="overflow-y-auto flex-1 mb-4">
        {selectedTab === 'portfolio' && renderPortfolioTab()}
        {selectedTab === 'market' && renderMarketTab()}
        {selectedTab === 'analysis' && renderAnalysisTab()}
      </div>
      
      {/* News Ticker */}
      <div className="bg-gray-800 text-white p-3 rounded-lg mb-4 shadow-lg border-l-4 border-blue-500">
        <p className="text-lg font-bold animate-pulse">{currentNews.message}</p>
      </div>
      
      {/* Game Controls */}
      <div className="flex justify-between bg-gray-800 text-white p-4 rounded-lg shadow-lg">
        <button 
          onClick={() => setGameScreen('menu')}
          className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg font-bold flex items-center transition-all"
        >
          <ArrowLeft size={18} className="mr-1" />
          END GAME
        </button>
        
        <h2 className="text-2xl font-bold text-center hidden md:block">
          <span className="text-white">PORTFOLIO</span> <span className="text-yellow-400">PANIC</span>
        </h2>
        
        <button 
          onClick={togglePause}
          className={`${paused ? 'bg-green-600 hover:bg-green-700' : 'bg-yellow-600 hover:bg-yellow-700'} text-white py-2 px-4 rounded-lg font-bold transition-all`}
        >
          {paused ? 'RESUME' : 'PAUSE'}
        </button>
      </div>
      
      {/* Notifications */}
      <NotificationSystem notifications={notifications} />
      
      {/* News Popup */}
      {showNewsPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 z-30 p-4">
          <div className="bg-gray-800 text-white p-6 rounded-lg max-w-md w-full border-l-4 border-blue-500 shadow-2xl">
            <h2 className="text-2xl font-bold mb-4">{newsPopup.title}</h2>
            <p className="mb-4 text-gray-300">{newsPopup.message}</p>
            <div className="bg-gray-700 p-3 rounded-lg mb-6">
              <h3 className="text-yellow-400 font-bold flex items-center mb-2">
                <Info size={18} className="mr-2" />
                TRADING TIP
              </h3>
              <p>{newsPopup.tip}</p>
            </div>
            <button 
              onClick={() => setShowNewsPopup(false)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-8 rounded-lg font-bold transition-all"
            >
              CONTINUE
            </button>
          </div>
        </div>
      )}
      
      {/* Market Alert Popup */}
      {showMarketAlert && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 z-40 p-4">
          <div className="bg-red-900 text-white p-6 rounded-lg max-w-md w-full border-2 border-red-700 shadow-2xl animate-pulse">
            <div className="flex items-center mb-4">
              <AlertTriangle className="text-red-500 mr-2" size={28} />
              <h2 className="text-2xl font-bold">{marketAlert.title}</h2>
            </div>
            <p className="mb-6">{marketAlert.message}</p>
            <button 
              onClick={() => setShowMarketAlert(false)}
              className="bg-red-700 hover:bg-red-800 text-white py-2 px-8 rounded-lg font-bold w-full transition-all"
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
          quantity={assetData.quantities[tradeAsset] || 0}
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
