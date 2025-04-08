import React, { useState } from 'react';
import { TrendingUp, TrendingDown, DollarSign, BarChart3, ArrowUpRight, ArrowDownRight } from 'lucide-react';

const AssetCard = ({ 
  asset, 
  price, 
  value,
  trend,
  priceHistory, 
  handleQuickTrade,
  formatCurrency,
  cash
}) => {
  const [showQuickActions, setShowQuickActions] = useState(false);
  
  // Get asset-specific details
  const getAssetDetails = () => {
    switch(asset) {
      case 'stocks':
        return {
          name: 'Tech Stocks',
          icon: '📈',
          color: 'blue',
          gradientFrom: 'from-blue-600',
          gradientTo: 'to-blue-900',
          chartColor: '#4ade80'
        };
      case 'oil':
        return {
          name: 'Oil',
          icon: '🛢️',
          color: 'black',
          gradientFrom: 'from-gray-700',
          gradientTo: 'to-gray-900',
          chartColor: '#4ade80'
        };
      case 'gold':
        return {
          name: 'Gold',
          icon: '🪙',
          color: 'yellow',
          gradientFrom: 'from-yellow-600',
          gradientTo: 'to-yellow-800',
          chartColor: '#4ade80'
        };
      case 'crypto':
        return {
          name: 'Crypto',
          icon: '₿',
          color: 'purple',
          gradientFrom: 'from-purple-600',
          gradientTo: 'to-purple-900',
          chartColor: '#4ade80'
        };
      default:
        return {
          name: asset.charAt(0).toUpperCase() + asset.slice(1),
          icon: '💼',
          color: 'gray',
          gradientFrom: 'from-gray-600',
          gradientTo: 'to-gray-800',
          chartColor: '#4ade80'
        };
    }
  };
  
  const details = getAssetDetails();
  
  // Render mini chart
  const renderMiniChart = () => {
    const history = Array.isArray(priceHistory) && priceHistory.length > 1 
      ? priceHistory.slice(-7) 
      : [price * 0.95, price * 0.98, price * 1.02, price * 0.99, price];
      
    const max = Math.max(...history);
    const min = Math.min(...history);
    const range = max - min || 1;
    
    // Calculate points for SVG polyline
    const width = 100;
    const height = 40;
    const points = history.map((price, i) => {
      const x = (i / (history.length - 1)) * width;
      const y = height - ((price - min) / range) * height;
      return `${x},${y}`;
    }).join(' ');

    // Determine chart color based on trend
    const chartColor = history[history.length - 1] >= history[0] ? '#10B981' : '#EF4444';
    
    return (
      <div className="w-full h-10 mt-1 mb-2">
        <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
          <polyline
            points={points}
            fill="none"
            stroke={chartColor}
            strokeWidth="2"
          />
        </svg>
      </div>
    );
  };
  
  // Handle quick trade actions
  const handleAction = (action, amount) => {
    // Close the quick actions menu
    setShowQuickActions(false);
    
    // Execute the quick trade
    handleQuickTrade(asset, action, amount);
  };
  
  // Calculate price change
  const calculatePriceChange = () => {
    if (!priceHistory || priceHistory.length < 2) {
      return { value: 0, percentage: 0 };
    }
    
    const previousPrice = priceHistory[priceHistory.length - 2];
    const change = price - previousPrice;
    const percentage = (change / previousPrice) * 100;
    
    return {
      value: change,
      percentage
    };
  };
  
  const priceChange = calculatePriceChange();
  const isPositive = priceChange.percentage >= 0;
  
  return (
    <div className={`bg-gradient-to-br ${details.gradientFrom} ${details.gradientTo} text-white p-4 rounded-lg shadow-lg relative overflow-hidden transition-all hover:shadow-xl`}>
      {/* Asset Title */}
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-xl font-bold flex items-center">
          <span className="mr-2">{details.icon}</span>
          {details.name}
        </h3>
        <div className={`rounded-full px-2 py-1 text-xs font-bold flex items-center ${
          isPositive ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'
        }`}>
          {isPositive ? (
            <>
              <ArrowUpRight size={12} className="mr-1" />
              +{priceChange.percentage.toFixed(1)}%
            </>
          ) : (
            <>
              <ArrowDownRight size={12} className="mr-1" />
              {priceChange.percentage.toFixed(1)}%
            </>
          )}
        </div>
      </div>
      
      {/* Price Chart */}
      {renderMiniChart()}
      
      {/* Current Price & Holdings */}
      <div className="flex justify-between items-center mb-3">
        <div>
          <div className="text-xs text-gray-300 mb-1">Price</div>
          <div className="text-2xl font-bold">${Number(price).toLocaleString()}</div>
        </div>
        {value > 0 && (
          <div className="text-right">
            <div className="text-xs text-gray-300 mb-1">You Own</div>
            <div className="text-xl font-bold">{formatCurrency(value)}</div>
          </div>
        )}
      </div>
      
      {/* Trade Actions */}
      <div className="grid grid-cols-2 gap-2">
        <button 
          onClick={() => handleAction('buy', 0.25)}
          className="bg-green-700 hover:bg-green-600 text-white py-2 rounded-lg font-bold text-center transition-all flex items-center justify-center"
        >
          <DollarSign size={16} className="mr-1" />
          BUY
        </button>
        <button 
          onClick={() => setShowQuickActions(prev => !prev)}
          className="bg-blue-700 hover:bg-blue-600 text-white py-2 rounded-lg font-bold text-center transition-all flex items-center justify-center"
        >
          <BarChart3 size={16} className="mr-1" />
          TRADE
        </button>
      </div>
      
      {/* Quick Action Menu */}
      {showQuickActions && (
        <div className="absolute left-0 right-0 bottom-full mb-2 bg-gray-800 rounded-lg p-3 z-10 shadow-lg border border-gray-700">
          <div className="grid grid-cols-2 gap-2 mb-2">
            <button 
              onClick={() => handleAction('buy', 0.25)}
              className="bg-green-700 hover:bg-green-600 text-white py-1 px-2 rounded-lg text-sm transition-all"
            >
              Buy 25%
            </button>
            <button 
              onClick={() => handleAction('buy', 0.5)}
              className="bg-green-700 hover:bg-green-600 text-white py-1 px-2 rounded-lg text-sm transition-all"
            >
              Buy 50%
            </button>
            <button 
              onClick={() => handleAction('buy', 1)}
              className="bg-green-700 hover:bg-green-600 text-white py-1 px-2 rounded-lg text-sm transition-all"
            >
              Buy 100%
            </button>
            <button 
              onClick={() => handleAction('buy', 'double')}
              className="bg-orange-600 hover:bg-orange-500 text-white py-1 px-2 rounded-lg text-sm transition-all"
            >
              Double Down
            </button>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button 
              onClick={() => handleAction('sell', 0.5)}
              className="bg-red-700 hover:bg-red-600 text-white py-1 px-2 rounded-lg text-sm transition-all"
              disabled={value <= 0}
            >
              Sell 50%
            </button>
            <button 
              onClick={() => handleAction('sell', 1)}
              className="bg-red-700 hover:bg-red-600 text-white py-1 px-2 rounded-lg text-sm transition-all"
              disabled={value <= 0}
            >
              Sell All
            </button>
            <button 
              onClick={() => handleAction('short', 0.25)}
              className="bg-purple-700 hover:bg-purple-600 text-white py-1 px-2 rounded-lg text-sm transition-all"
            >
              Short 25%
            </button>
            <button
              onClick={() => setShowQuickActions(false)}
              className="bg-gray-600 hover:bg-gray-500 text-white py-1 px-2 rounded-lg text-sm transition-all"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
      
      {/* Trend Indicator */}
      <div className="absolute top-2 right-2 opacity-10">
        {trend && trend.direction === 'up' ? (
          <TrendingUp size={64} className="text-green-300" />
        ) : (
          <TrendingDown size={64} className="text-red-300" />
        )}
      </div>
    </div>
  );
};

export default AssetCard;
