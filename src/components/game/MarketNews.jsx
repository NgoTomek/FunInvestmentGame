import React from 'react';
import { NewspaperIcon, TrendingUp, TrendingDown, AlertCircle } from 'lucide-react';

const MarketNews = ({ currentNews }) => {
  // If no news is provided, show a default message
  if (!currentNews || !currentNews.impact) {
    return (
      <div className="border border-gray-700 p-4 rounded-lg bg-gray-800 shadow-lg">
        <div className="flex items-center mb-3">
          <NewspaperIcon className="mr-2 text-blue-400" size={24} />
          <h3 className="text-xl font-bold">Market News</h3>
        </div>
        <div className="text-gray-400 flex items-center p-3 bg-gray-700 rounded-lg">
          <AlertCircle className="mr-2" size={18} />
          Awaiting market news...
        </div>
      </div>
    );
  }
  
  return (
    <div className="border border-gray-700 p-4 rounded-lg bg-gray-800 shadow-lg">
      <div className="flex items-center mb-3">
        <NewspaperIcon className="mr-2 text-blue-400" size={24} />
        <h3 className="text-xl font-bold">Market News</h3>
      </div>
      
      <div className="border-l-4 border-blue-500 bg-gray-700 p-4 rounded-tr-lg rounded-br-lg shadow-inner mb-4">
        <div className="text-lg font-bold mb-1">{currentNews.message}</div>
        <div className="text-sm text-gray-400">Breaking news affecting market conditions</div>
      </div>
      
      <div>
        <div className="text-sm text-gray-300 mb-3 font-bold">Market Impact Analysis:</div>
        
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {Object.entries(currentNews.impact || {}).map(([asset, impact]) => (
            <div key={asset} className={`${
              impact > 1 ? 'bg-green-900 bg-opacity-30 border-green-700' : 'bg-red-900 bg-opacity-30 border-red-700'
            } border p-3 rounded-lg transition-all hover:scale-105`}>
              <div className="capitalize mb-1 font-bold text-center">{asset}</div>
              <div className={`rounded-full py-1 px-2 text-xs font-bold flex items-center justify-center ${
                impact > 1 ? 'bg-green-800 text-green-300' : 'bg-red-800 text-red-300'
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
    </div>
  );
};

export default MarketNews;
