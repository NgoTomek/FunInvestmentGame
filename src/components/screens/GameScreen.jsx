import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowUp, ArrowDown, AlertTriangle, TrendingUp, TrendingDown, DollarSign, Clock, BarChart2, Award, Settings, HelpCircle, Info, ArrowLeft } from 'lucide-react';
import AssetCard from '../game/AssetCard';
import TradeModal from '../game/TradeModal';
import MarketNews from '../game/MarketNews';
import PortfolioSummary from '../game/PortfolioSummary';
import NotificationSystem from '../game/NotificationSystem';
import TabNavigation from '../ui/TabNavigation';
import PriceChart from '../game/PriceChart';
import MarketOpportunityCard from '../game/MarketOppurtunityCard';
import { useGame } from '../../context/GameContext';

const GameScreen = () => {
  const navigate = useNavigate();
  
  // Get state and functions from context
  const { 
    portfolio,
    assetPrices,
    assetData,
    assetTrends,
    priceHistory,
    timer,
    round,
    totalRounds,
    paused,
    currentNews,
    showNewsPopup,
    setShowNewsPopup,
    newsPopup,
    showMarketAlert,
    setShowMarketAlert,
    marketAlert,
    marketOpportunity,
    notifications,
    togglePause,
    handleTrade,
    handleOpportunity,
    formatCurrency,
    formatTime,
    handleEndGame,
    calculatePortfolioValue
  } = useGame();
  
  // Local state for UI
  const [selectedTab, setSelectedTab] = useState('portfolio');
  const [showTradeModal, setShowTradeModal] = useState(false);
  const [tradeAsset, setTradeAsset] = useState(null);
  const [tradeAction, setTradeAction] = useState('buy');
  
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
  
  // Handle game end button
  const onEndGameClick = () => {
    handleEndGame();
    navigate('/results');
  };
  
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
        calculatePortfolioValue={calculatePortfolioValue}
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
          handleQuickTrade={handleTrade}
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
  const renderAnalysisTab = () => (
    <div className="space-y-4 mb-auto">
      <div className="bg-gray-800 text-white p-4 rounded-lg">
        <h3 className="text-2xl font-bold mb-4 flex items-center">
          <TrendingUp className="mr-2 text-green-500" size={24} />
          Portfolio Analysis
        </h3>
        
        {/* Portfolio value and other analysis */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div className="border border-gray-700 p-3 rounded-lg">
            <h4 className="text-lg font-bold mb-2">Current Value</h4>
            <div className="text-3xl font-bold">{formatCurrency(calculatePortfolioValue())}</div>
          </div>
        </div>
      </div>
    </div>
  );
  
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-teal-600 to-teal-800 p-4">
      {/* Header */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <div className="bg-gray-800 text-white p-4 rounded-lg flex items-center justify-between shadow-lg">
          <div>
            <div className="text-gray-400 text-xs uppercase tracking-wider mb-1">Portfolio Value</div>
            <span className="text-4xl font-bold">{formatCurrency(calculatePortfolioValue())}</span>
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
          onClick={() => navigate('/')}
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
