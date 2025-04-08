import React, { useState } from 'react';
import { TrendingUp, AlertCircle } from 'lucide-react';

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
          name: 'Tech Stock',
          color: 'blue',
          chartColor: '#4ade80'
        };
      case 'oil':
        return {
          name: 'Oil',
          color: 'black',
          chartColor: '#4ade80'
        };
      case 'gold':
        return {
          name: 'Gold',
          color: 'yellow',
          chartColor: '#4ade80'
        };
      case 'crypto':
        return {
          name: 'Crypto',
          color: 'purple',
          chartColor: '#4ade80'
        };
      default:
        return {
          name: asset.toUpperCase(),
          color: 'gray',
          chartColor: '#4ade80'
        };
    }
  };
  
  const details = getAssetDetails();
  
  // Render mini chart
  const renderMiniChart = () => {
    const history = priceHistory.slice(-7);
    const max = Math.max(...history);
    const min = Math.min(...history);
    const range = max - min || 1;
    
    // Calculate points for SVG polyline
    const width = 180;
    const height = 40;
    const points = history.map((price, i) => {
      const x = (i / (history.length - 1)) * width;
      const y = height - ((price - min) / range) * height;
      return `${x},${y}`;
    }).join(' ');
    
    return (
      <div className="w-full h-12 mt-1 mb-3">
        <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
          <polyline
            points={points}
            fill="none"
            stroke={details.chartColor}
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
  
  return (
    <div className="bg-gray-900 text-white p-4 rounded-lg relative">
      {/* Asset Title */}
      <h3 className="text-xl font-bold mb-1">{details.name}</h3>
      
      {/* Price Chart */}
      {renderMiniChart()}
      
      {/* Price */}
      <div className="text-3xl font-bold mb-3">${Number(price).toLocaleString()}</div>
      
      {/* Trade Actions */}
      <div className="grid grid-cols-2 gap-2">
        <button 
          onClick={() => handleAction('buy', 0.25)}
          className="bg-blue-700 hover:bg-blue-600 text-white py-2 rounded-lg font-bold text-center"
        >
          BUY
        </button>
        <button 
          onClick={() => setShowQuickActions(prev => !prev)}
          className="bg-blue-700 hover:bg-blue-600 text-white py-2 rounded-lg font-bold text-center"
        >
          SELL
        </button>
      </div>
      
      {/* Quick Action Menu */}
      {showQuickActions && (
        <div className="absolute left-0 right-0 bottom-full mb-2 bg-gray-800 rounded-lg p-2 z-10 shadow-lg">
          <div className="grid grid-cols-2 gap-2 mb-2">
            <button 
              onClick={() => handleAction('buy', 0.25)}
              className="bg-green-700 hover:bg-green-600 text-white py-1 px-2 rounded-lg text-sm"
            >
              Buy 25%
            </button>
            <button 
              onClick={() => handleAction('buy', 0.5)}
              className="bg-green-700 hover:bg-green-600 text-white py-1 px-2 rounded-lg text-sm"
            >
              Buy 50%
            </button>
            <button 
              onClick={() => handleAction('buy', 1)}
              className="bg-green-700 hover:bg-green-600 text-white py-1 px-2 rounded-lg text-sm"
            >
              Buy 100%
            </button>
            <button 
              onClick={() => handleAction('buy', 'double')}
              className="bg-orange-600 hover:bg-orange-500 text-white py-1 px-2 rounded-lg text-sm"
            >
              Double Down
            </button>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button 
              onClick={() => handleAction('sell', 0.5)}
              className="bg-red-700 hover:bg-red-600 text-white py-1 px-2 rounded-lg text-sm"
            >
              Sell 50%
            </button>
            <button 
              onClick={() => handleAction('sell', 1)}
              className="bg-red-700 hover:bg-red-600 text-white py-1 px-2 rounded-lg text-sm"
            >
              Sell All
            </button>
            <button 
              onClick={() => handleAction('short', 0.25)}
              className="bg-purple-700 hover:bg-purple-600 text-white py-1 px-2 rounded-lg text-sm"
            >
              Short 25%
            </button>
            <button
              onClick={() => setShowQuickActions(false)}
              className="bg-gray-600 hover:bg-gray-500 text-white py-1 px-2 rounded-lg text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssetCard;