import React from 'react';
import { NewspaperIcon, TrendingUp, TrendingDown } from 'lucide-react';

const MarketNews = ({ currentNews }) => {
  // If no news is provided, show a default message
  if (!currentNews || !currentNews.impact) {
    return (
      <div className="border border-gray-700 p-3 rounded-lg">
        <div className="text-lg font-bold mb-1">Awaiting Market News...</div>
        <div className="text-sm text-gray-400">
          Market news will appear here when available.
        </div>
      </div>
    );
  }
  
  return (
    <>
      <h3 className="text-xl font-bold mb-3 flex items-center">
        <NewspaperIcon className="mr-2" size={20} />
        Recent News
      </h3>
      <div className="border border-gray-700 p-3 rounded-lg">
        <div className="text-lg font-bold mb-1">{currentNews.message}</div>
        <div className="text-sm text-gray-400 mb-3">Impact Analysis:</div>
        
        <div className="grid grid-cols-4 gap-2">
          {Object.entries(currentNews.impact || {}).map(([asset, impact]) => (
            <div key={asset} className="flex flex-col items-center">
              <div className="capitalize mb-1">{asset}</div>
              <div className={`rounded-full px-2 py-1 text-xs font-bold flex items-center ${
                impact > 1 ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'
              }`}>
                {impact > 1 ? (
                  <>
                    <TrendingUp size={12} className="mr-1" />
                    +{((impact - 1) * 100).toFixed(1)}%
                  </>
                ) : (
                  <>
                    <TrendingDown size={12} className="mr-1" />
                    {((impact - 1) * 100).toFixed(1)}%
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default MarketNews;