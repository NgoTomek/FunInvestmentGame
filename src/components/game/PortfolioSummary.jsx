import React from 'react';
import { PieChart, Briefcase, ArrowRight } from 'lucide-react';

const PortfolioSummary = ({ 
  portfolio,
  assetQuantities,
  assetPrices,
  calculatePortfolioValue,
  formatCurrency
}) => {
  // Calculate total invested amount
  const totalInvested = Object.entries(assetQuantities).reduce((total, [asset, quantity]) => {
    return total + (quantity * assetPrices[asset]);
  }, 0);
  
  // Calculate percentage allocation
  const calculateAllocation = () => {
    const totalValue = calculatePortfolioValue();
    
    return {
      cash: (portfolio.cash / totalValue) * 100,
      stocks: (assetQuantities.stocks * assetPrices.stocks / totalValue) * 100,
      gold: (assetQuantities.gold * assetPrices.gold / totalValue) * 100,
      crypto: (assetQuantities.crypto * assetPrices.crypto / totalValue) * 100,
      bonds: (assetQuantities.bonds * assetPrices.bonds / totalValue) * 100
    };
  };
  
  const allocation = calculateAllocation();
  
  // Get color for asset
  const getAssetColor = (asset) => {
    switch(asset) {
      case 'cash': return 'bg-gray-400';
      case 'stocks': return 'bg-blue-500';
      case 'gold': return 'bg-yellow-500';
      case 'crypto': return 'bg-purple-500';
      case 'bonds': return 'bg-green-500';
      default: return 'bg-gray-600';
    }
  };
  
  return (
    <div className="bg-gray-800 text-white p-4 rounded-lg">
      <h3 className="text-2xl font-bold mb-2 flex items-center">
        <Briefcase className="mr-2" size={20} />
        PORTFOLIO
      </h3>
      
      <div className="mb-2">
        <div className="flex justify-between mb-1">
          <span className="text-gray-400">Total Value:</span>
          <span className="font-bold">{formatCurrency(calculatePortfolioValue())}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Invested:</span>
          <span className="font-bold">{formatCurrency(totalInvested)}</span>
        </div>
      </div>
      
      {/* Holdings List */}
      <div className="space-y-1 mb-3">
        {Object.entries(assetQuantities).map(([asset, quantity]) => (
          quantity > 0 && (
            <div key={asset} className="flex justify-between items-center">
              <div className="flex items-center">
                <div className={`w-2 h-2 rounded-full mr-1 ${getAssetColor(asset)}`}></div>
                <span className="capitalize">{asset}:</span>
              </div>
              <div className="flex items-center">
                <span className="font-bold mr-2">{asset === 'crypto' ? quantity.toFixed(2) : quantity}</span>
                <ArrowRight size={12} className="text-gray-400" />
                <span className="ml-2">{formatCurrency(quantity * assetPrices[asset])}</span>
              </div>
            </div>
          )
        ))}
        {Object.values(assetQuantities).every(q => q === 0) && (
          <p className="text-gray-400">No assets in portfolio</p>
        )}
      </div>
      
      {/* Portfolio Allocation Chart */}
      <div className="mt-3">
        <div className="flex items-center mb-1">
          <PieChart size={14} className="mr-1 text-gray-400" />
          <span className="text-sm font-bold">Portfolio Allocation</span>
        </div>
        
        <div className="flex h-6 rounded-lg overflow-hidden">
          {Object.entries(allocation).map(([asset, percentage]) => {
            if (percentage < 1) return null;
            
            return (
              <div 
                key={asset}
                className={`${getAssetColor(asset)} h-full`}
                style={{ width: `${percentage}%` }}
                title={`${asset}: ${percentage.toFixed(1)}%`}
              ></div>
            );
          })}
        </div>
        
        <div className="flex flex-wrap justify-between text-xs mt-1">
          {Object.entries(allocation).map(([asset, percentage]) => {
            if (percentage < 5) return null;
            return (
              <div key={asset} className="flex items-center mr-2 mb-1">
                <div className={`w-2 h-2 rounded-full mr-1 ${getAssetColor(asset)}`}></div>
                <span>{asset}: {percentage.toFixed(0)}%</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PortfolioSummary;