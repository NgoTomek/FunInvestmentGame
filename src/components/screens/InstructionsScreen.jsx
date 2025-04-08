import React from 'react';
import { ArrowLeft, ArrowUp, ArrowDown, Zap, DollarSign, BarChart, TrendingUp, TrendingDown, AlertTriangle, BookOpen, CheckSquare } from 'lucide-react';

const InstructionsScreen = ({ setGameScreen }) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-teal-600 to-teal-800 p-4">
      <div className="bg-gray-800 text-white p-6 rounded-lg w-full max-w-2xl mb-8 overflow-y-auto max-h-[80vh] shadow-lg border border-gray-700">
        <div className="flex items-center mb-6">
          <button 
            onClick={() => setGameScreen('menu')}
            className="bg-gray-700 text-white p-2 rounded-lg mr-3 hover:bg-gray-600 transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <h2 className="text-4xl font-bold text-center flex-1 flex items-center justify-center">
            <BookOpen className="mr-3 text-blue-400" size={28} />
            HOW TO PLAY
          </h2>
        </div>
        
        {/* Game Objective */}
        <div className="mb-8 bg-gray-700 p-4 rounded-lg border-l-4 border-blue-500">
          <h3 className="text-2xl font-bold mb-3">Game Objective</h3>
          <p className="mb-3">
            In Portfolio Panic, your goal is to maximize your investment returns by trading 
            different assets in response to market events and price movements.
          </p>
          <p>
            Buy assets when prices are low, sell when they're high, and react strategically 
            to market news to grow your portfolio value!
          </p>
        </div>
        
        {/* Game Flow */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold mb-3 flex items-center">
            <BarChart className="mr-2 text-green-400" size={24} />
            Game Flow
          </h3>
          <ol className="list-decimal pl-5 space-y-2 bg-gray-700 p-4 rounded-lg">
            <li>The game consists of several rounds (depending on difficulty)</li>
            <li>Each round lasts 60 seconds</li>
            <li>Market prices update every 8-12 seconds (based on difficulty)</li>
            <li>News events appear that impact market prices</li>
            <li>At the end of all rounds, your final performance is evaluated</li>
          </ol>
        </div>
        
        {/* Trading System */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold mb-3 flex items-center">
            <DollarSign className="mr-2 text-yellow-400" size={24} />
            Trading System
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div className="bg-gray-700 p-4 rounded-lg hover:bg-gray-600 transition-colors">
              <h4 className="flex items-center text-xl font-bold mb-2">
                <DollarSign className="mr-2 text-green-500" size={20} />
                Buying Assets
              </h4>
              <p className="text-sm">
                Click the BUY button on any asset to purchase it. You can specify the quantity 
                you want to buy. You can't buy more than your available cash allows.
              </p>
            </div>
            <div className="bg-gray-700 p-4 rounded-lg hover:bg-gray-600 transition-colors">
              <h4 className="flex items-center text-xl font-bold mb-2">
                <DollarSign className="mr-2 text-red-500" size={20} />
                Selling Assets
              </h4>
              <p className="text-sm">
                Click the SELL button to sell any asset you own. You can specify the quantity 
                to sell. Selling converts the asset back to cash at the current market price.
              </p>
            </div>
          </div>
          <div className="bg-gray-700 p-4 rounded-lg hover:bg-gray-600 transition-colors">
            <h4 className="flex items-center text-xl font-bold mb-2">
              <BarChart className="mr-2 text-blue-500" size={20} />
              Short Selling
            </h4>
            <p className="text-sm mb-2">
              Advanced traders can also "short" assets they believe will decrease in price:
            </p>
            <ul className="list-disc pl-5 text-sm">
              <li>When you short an asset, you profit if the price goes down</li>
              <li>Short positions have higher risk and higher potential reward</li>
              <li>You can close a short position at any time to lock in profits or cut losses</li>
            </ul>
          </div>
        </div>
        
        {/* Market Indicators */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold mb-3 flex items-center">
            <TrendingUp className="mr-2 text-blue-400" size={24} />
            Market Indicators
          </h3>
          <p className="mb-3">
            Pay attention to these indicators to make informed trading decisions:
          </p>
          
          <div className="space-y-4">
            <div className="bg-gray-700 p-4 rounded-lg">
              <h4 className="text-xl font-bold mb-2">Trend Indicators</h4>
              <div className="flex items-center mb-2">
                <div className="flex mr-3">
                  <ArrowUp className="text-green-500" size={16} />
                  <ArrowUp className="text-green-500" size={16} />
                </div>
                <span>= Strong upward trend</span>
              </div>
              <div className="flex items-center">
                <div className="flex mr-3">
                  <ArrowDown className="text-red-500" size={16} />
                </div>
                <span>= Weak downward trend</span>
              </div>
              <p className="text-sm text-gray-400 mt-2">
                The number of arrows indicates the strength of the trend.
              </p>
            </div>
            
            <div className="bg-gray-700 p-4 rounded-lg">
              <h4 className="text-xl font-bold mb-2">News Events</h4>
              <p className="mb-2">
                News events appear that affect asset prices. Each news item will show 
                the expected impact on different asset classes.
              </p>
              <div className="flex items-center">
                <TrendingUp className="text-green-500 mr-2" size={16} />
                <span>= Positive impact on price</span>
              </div>
              <div className="flex items-center">
                <TrendingDown className="text-red-500 mr-2" size={16} />
                <span>= Negative impact on price</span>
              </div>
            </div>
            
            <div className="bg-gray-700 p-4 rounded-lg">
              <h4 className="flex items-center text-xl font-bold mb-2">
                <AlertTriangle className="mr-2 text-yellow-500" size={20} />
                Market Crashes
              </h4>
              <p>
                Occasionally, market crashes occur that cause dramatic price movements. 
                These are rare but can provide buying opportunities or devastating losses 
                depending on your portfolio composition.
              </p>
            </div>
          </div>
        </div>
        
        {/* Tips for Success */}
        <div className="mb-4 bg-blue-900 bg-opacity-30 p-4 rounded-lg border border-blue-800">
          <h3 className="text-2xl font-bold mb-3 flex items-center">
            <CheckSquare className="mr-2 text-blue-400" size={24} />
            Tips for Success
          </h3>
          <ul className="space-y-2">
            <li className="flex items-start">
              <Zap size={16} className="text-yellow-400 mr-2 mt-1" />
              <span>Diversify your portfolio to reduce risk</span>
            </li>
            <li className="flex items-start">
              <Zap size={16} className="text-yellow-400 mr-2 mt-1" />
              <span>Gold often performs well during market uncertainty</span>
            </li>
            <li className="flex items-start">
              <Zap size={16} className="text-yellow-400 mr-2 mt-1" />
              <span>Cryptocurrency is highly volatile but can yield big returns</span>
            </li>
            <li className="flex items-start">
              <Zap size={16} className="text-yellow-400 mr-2 mt-1" />
              <span>Watch for trends and react quickly to market news</span>
            </li>
            <li className="flex items-start">
              <Zap size={16} className="text-yellow-400 mr-2 mt-1" />
              <span>Don't put all your money in one asset</span>
            </li>
            <li className="flex items-start">
              <Zap size={16} className="text-yellow-400 mr-2 mt-1" />
              <span>Buy low, sell high, and don't panic during crashes</span>
            </li>
          </ul>
        </div>
      </div>
      
      <button 
        onClick={() => setGameScreen('menu')}
        className="bg-gray-800 text-white py-3 px-8 rounded-lg text-xl font-bold hover:bg-gray-700 transition transform hover:-translate-y-1 shadow-lg"
      >
        BACK TO MENU
      </button>
    </div>
  );
};

export default InstructionsScreen;
