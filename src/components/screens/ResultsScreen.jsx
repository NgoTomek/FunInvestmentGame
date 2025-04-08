import React from 'react';
import { TrendingUp, TrendingDown, Award, Share2 } from 'lucide-react';
import Button from '../ui/Button';

const ResultsScreen = ({ gameResult, gameStats, setGameScreen, startGame }) => {
  // Format currency display
  const formatCurrency = (value) => {
    return '$' + Math.round(value).toLocaleString();
  };
  
  // Get performance rating based on return percentage
  const getPerformanceRating = () => {
    if (gameResult.returnPercentage >= 20) return { rating: 'S', color: 'text-purple-500' };
    if (gameResult.returnPercentage >= 15) return { rating: 'A', color: 'text-green-500' };
    if (gameResult.returnPercentage >= 10) return { rating: 'B', color: 'text-blue-500' };
    if (gameResult.returnPercentage >= 5) return { rating: 'C', color: 'text-yellow-500' };
    if (gameResult.returnPercentage >= 0) return { rating: 'D', color: 'text-orange-500' };
    return { rating: 'F', color: 'text-red-500' };
  };
  
  const performance = getPerformanceRating();
  
  // Generate performance feedback
  const getPerformanceFeedback = () => {
    if (gameResult.returnPercentage >= 15) {
      return "Outstanding! You've mastered the market and achieved excellent returns. Your timing was impeccable and your strategy sound.";
    } else if (gameResult.returnPercentage >= 10) {
      return "Great job! You navigated the market volatility well and grew your investment portfolio. You're showing real trading potential.";
    } else if (gameResult.returnPercentage >= 5) {
      return "Good work! Your cautious approach has yielded positive results. With more experience, you could achieve even better returns.";
    } else if (gameResult.returnPercentage >= 0) {
      return "You managed to end with a profit - not bad in these market conditions. Consider diversifying more on your next attempt.";
    } else if (gameResult.returnPercentage >= -10) {
      return "Markets can be challenging. Try paying closer attention to news events and trends to improve your returns next time.";
    } else {
      return "Tough market conditions got the better of you this time. Study the asset information and try a more defensive strategy next time.";
    }
  };
  
  return (
    <div className="h-screen flex flex-col items-center justify-center bg-teal-600 p-4">
      <div className="bg-gray-800 text-white p-8 rounded-lg w-full max-w-lg mb-8 relative overflow-hidden">
        {/* Performance Rating */}
        <div className="absolute top-4 right-4 w-16 h-16 flex items-center justify-center rounded-full border-4 border-gray-700">
          <span className={`text-4xl font-bold ${performance.color}`}>{performance.rating}</span>
        </div>
        
        <h2 className="text-4xl font-bold mb-8 text-center">GAME RESULTS</h2>
        
        {/* Final Value */}
        <div className="mb-6">
          <h3 className="text-lg text-gray-400 mb-1">FINAL PORTFOLIO VALUE</h3>
          <p className="text-5xl font-bold">{formatCurrency(gameResult.finalValue)}</p>
        </div>
        
        {/* Return */}
        <div className="mb-6">
          <h3 className="text-lg text-gray-400 mb-1">TOTAL RETURN</h3>
          <div className="flex items-center">
            <p className={`text-5xl font-bold ${gameResult.returnPercentage >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {gameResult.returnPercentage >= 0 ? '+' : ''}{gameResult.returnPercentage.toFixed(1)}%
            </p>
            {gameResult.returnPercentage >= 0 ? 
              <TrendingUp className="text-green-500 ml-2" size={32} /> : 
              <TrendingDown className="text-red-500 ml-2" size={32} />
            }
          </div>
        </div>
        
        {/* Asset Performance */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-gray-700 p-3 rounded-lg">
            <h4 className="text-sm text-gray-400 mb-1">Best Performing Asset</h4>
            <p className="text-xl font-bold capitalize">{gameResult.bestAsset}</p>
            {gameResult.bestReturn && (
              <p className="text-green-500 font-bold">+{gameResult.bestReturn.toFixed(1)}%</p>
            )}
          </div>
          
          <div className="bg-gray-700 p-3 rounded-lg">
            <h4 className="text-sm text-gray-400 mb-1">Worst Performing Asset</h4>
            <p className="text-xl font-bold capitalize">{gameResult.worstAsset}</p>
            {gameResult.worstReturn && (
              <p className="text-red-500 font-bold">{gameResult.worstReturn.toFixed(1)}%</p>
            )}
          </div>
        </div>
        
        {/* Trading Stats */}
        <div className="bg-gray-700 p-4 rounded-lg mb-6">
          <h4 className="text-lg font-bold mb-3">Trading Activity</h4>
          <div className="grid grid-cols-2 gap-x-4 gap-y-2">
            <div className="text-sm text-gray-400">Trades Executed:</div>
            <div className="text-sm font-bold text-right">{gameStats.tradesExecuted}</div>
            
            <div className="text-sm text-gray-400">Profitable Trades:</div>
            <div className="text-sm font-bold text-right">{gameStats.profitableTrades}</div>
            
            <div className="text-sm text-gray-400">Win Rate:</div>
            <div className="text-sm font-bold text-right">
              {gameStats.tradesExecuted > 0 
                ? `${((gameStats.profitableTrades / gameStats.tradesExecuted) * 100).toFixed(1)}%` 
                : '0%'
              }
            </div>
            
            <div className="text-sm text-gray-400">Market Crashes:</div>
            <div className="text-sm font-bold text-right">{gameStats.marketCrashesWeathered}</div>
          </div>
        </div>
        
        {/* Performance Feedback */}
        <div className="mb-8 p-4 bg-gray-700 rounded-lg">
          <h4 className="flex items-center font-bold mb-2">
            <Award className="text-yellow-400 mr-2" size={20} />
            <span>Performance Analysis</span>
          </h4>
          <p className="text-sm">{getPerformanceFeedback()}</p>
        </div>
        
        {/* Actions */}
        <div className="grid grid-cols-2 gap-4">
          <button 
            onClick={() => setGameScreen('menu')}
            className="bg-blue-600 text-white py-3 px-8 rounded-lg font-bold hover:bg-blue-700 transition transform hover:-translate-y-1"
          >
            MAIN MENU
          </button>
          <button 
            onClick={() => {
              setGameScreen('game');
              startGame();
            }}
            className="bg-green-600 text-white py-3 px-8 rounded-lg font-bold hover:bg-green-700 transition transform hover:-translate-y-1"
          >
            PLAY AGAIN
          </button>
        </div>
        
        {/* Share button */}
        <button className="mt-4 flex items-center justify-center w-full text-gray-300 hover:text-white">
          <Share2 size={16} className="mr-2" />
          <span>Share Results</span>
        </button>
      </div>
      
      <div className="bg-gray-800 text-white p-4 rounded-lg">
        <h2 className="text-2xl font-bold text-center">
          <span className="text-white">PORTFOLIO</span> <span className="text-yellow-400">PANIC</span>
        </h2>
      </div>
    </div>
  );
};

export default ResultsScreen;