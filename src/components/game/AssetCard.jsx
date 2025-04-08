import React from 'react';
import { ArrowUp, ArrowDown, Info } from 'lucide-react';
import TrendIndicator from '../ui/TrendIndicator';
import Button from '../ui/Button';

const AssetCard = ({ 
  asset, 
  price, 
  quantity, 
  trend, 
  priceHistory, 
  openTradeModal,
  formatCurrency
}) => {
  // Render mini chart
  const renderMiniChart = () => {
    const history = priceHistory.slice(-5);
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
  
  // Get asset-specific details
  const getAssetDetails = () => {
    switch(asset) {
      case 'stocks':
        return {
          name: 'STOCKS',
          description: 'Moderate risk, moderate returns',
          color: 'blue'
        };
      case 'gold':
        return {
          name: 'GOLD',
          description: 'Safe haven asset',
          color: 'yellow'
        };
      case 'crypto':
        return {
          name: 'CRYPTO',
          description: 'High risk, high potential returns',
          color: 'purple'
        };
      case 'bonds':
        return {
          name: 'BONDS',
          description: 'Low risk, stable returns',
          color: 'green'
        };
      default:
        return {
          name: asset.toUpperCase(),
          description: '',
          color: 'gray'
        };
    }
  };
  
  const details = getAssetDetails();
  
  return (
    <div className="bg-gray-800 text-white p-4 rounded-lg relative">
      {/* Asset Info Button */}
      <button 
        className="absolute top-2 right-2 text-gray-400 hover:text-white"
        aria-label={`${asset} information`}
      >
        <Info size={16} />
      </button>
      
      {/* Header with trend */}
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-2xl font-bold">{details.name}</h3>
        <TrendIndicator trend={trend} />
      </div>
      
      {/* Price and Quantity */}
      <div className="flex justify-between items-center mb-2">
        <div>
          <p className="text-4xl font-bold">${price}</p>
          <p className="text-xs text-gray-400">{details.description}</p>
        </div>
        <div className="text-xs">
          <div>Owned: {asset === 'crypto' ? quantity.toFixed(2) : quantity}</div>
          <div>Value: {formatCurrency(quantity * price)}</div>
        </div>
      </div>
      
      {/* Mini Chart */}
      {renderMiniChart()}
      
      {/* Trade Actions */}
      <div className="grid grid-cols-3 gap-2 mt-4">
        <Button 
          onClick={() => openTradeModal(asset, 'buy')}
          color="green"
          label="BUY"
        />
        <Button 
          onClick={() => openTradeModal(asset, 'sell')}
          color="red"
          label="SELL"
          disabled={quantity <= 0}
        />
        <Button 
          onClick={() => openTradeModal(asset, 'hold')}
          color="blue"
          label="HOLD"
          tooltip="Set a strategy for automatic trades"
        />
      </div>
    </div>
  );
};

export default AssetCard;