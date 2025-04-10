import React from 'react';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, TrendingDown, Award, Share2, Home, RotateCcw, DollarSign, Medal, ChevronUp, ChevronDown, Activity } from 'lucide-react';
import { useGame } from '../../context/GameContext';

const ResultsScreen = () => {
  const navigate = useNavigate();
  const { 
    gameResult, 
    gameStats, 
    startGame, 
    formatCurrency
  } = useGame();
  
  // Get performance rating based on return percentage
  const getPerformanceRating = () => {
    if (gameResult.returnPercentage >= 20) return { rating: 'S', color: 'text-purple-500', bgColor: 'bg-purple-900', borderColor: 'border-purple-500' };
    if (gameResult.returnPercentage >= 15) return { rating: 'A', color: 'text-green-500', bgColor: 'bg-green-900', borderColor: 'border-green-500' };
    if (gameResult.returnPercentage >= 10) return { rating: 'B', color: 'text-blue-500', bgColor: 'bg-blue-900', borderColor: 'border-blue-500' };
    if (gameResult.returnPercentage >= 5) return { rating: 'C', color: 'text-yellow-500', bgColor: 'bg-yellow-900', borderColor: 'border-yellow-500' };
    if (gameResult.returnPercentage >= 0) return { rating: 'D', color: 'text-orange-500', bgColor: 'bg-orange-900', borderColor: 'border-orange-500' };
    return { rating: 'F', color: 'text-red-500', bgColor: 'bg-red-900', borderColor: 'border-red-500' };
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
  
  const handlePlayAgain = () => {
    startGame();
    navigate('/game');
  };
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-teal-600 to-teal-800 p-4">
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 text-white p-8 rounded-lg w-full max-w-lg mb-8 relative overflow-hidden shadow-2xl border border-gray-700">
        {/* Performance Rating Medal */}
        <div className={`absolute top-4 right-4 w-20 h-20 flex items-center justify-center rounded-full border-4 ${performance.borderColor} ${performance.bgColor} shadow-lg`}>
          <span className={`text-5xl font-bold ${performance.color}`}>{performance.rating}</span>
        </div>
        
        <h2 className="text-4xl font-bold mb-6 text-center">GAME RESULTS</h2>
        
        {/* Return with visual bar */}
        <div className="relative mb-8 overflow-hidden">
          <h3 className="text-lg text-gray-400 mb-2 flex items-center">
            <Activity className="mr-2" size={18} />
            TOTAL RETURN
          </h3>
          <div className="flex items-center mb-3">
            <p className={`text-5xl font-bold ${gameResult.returnPercentage >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {gameResult.returnPercentage >= 0 ? '+' : ''}{gameResult.returnPercentage.toFixed(1)}%
            </p>
            {gameResult.returnPercentage >= 0 ? 
              <TrendingUp className="text-green-500 ml-3" size={32} /> : 
              <TrendingDown className="text-red-500 ml-3" size={32} />
            }
          </div>
          
          {/* Progress bar */}
          <div className="h-2 bg-gray-700 rounded-full overflow-hidden w-full">
            <div 
              className={`h-full ${gameResult.returnPercentage >= 0 ? 'bg-green-500' : 'bg-red-500'}`}
              style={{ 
                width: `${Math.min(100, Math.max(0, 50 + (gameResult.returnPercentage / 2)))}%`,
                transition: 'width 1s ease-out'
              }}
            ></div>
          </div>
        </div>
        
        {/* Final Value */}
        <div className="mb-6 bg-gray-800 p-4 rounded-lg border border-gray-700">
          <h3 className="text-lg text-gray-400 mb-1 flex items-center">
            <DollarSign className="mr-2" size={18} />
            FINAL PORTFOLIO VALUE
          </h3>
          <p className="text-4xl font-bold">{formatCurrency(gameResult.finalValue)}</p>
        </div>
        
        {/* Asset Performance */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-green-900 bg-opacity-30 p-4 rounded-lg border border-green-800">
            <h4 className="text-sm text-gray-300 mb-1 flex items-center">
              <ChevronUp className="text-green-500 mr-1" size={16} />
              Best Performing Asset
            </h4>
            <p className="text-xl font-bold capitalize">{gameResult.bestAsset}</p>
            {gameResult.bestReturn > 0 && (
              <p className="text-green-500 font-bold flex items-center">
                <TrendingUp size={16} className="mr-1" />
                +{gameResult.bestReturn.toFixed(1)}%
              </p>
            )}
          </div>
          
          <div className="bg-red-900 bg-opacity-30 p-4 rounded-lg border border-red-800">
            <h4 className="text-sm text-gray-300 mb-1 flex items-center">
              <ChevronDown className="text-red-500 mr-1" size={16} />
              Worst Performing Asset
            </h4>
            <p className="text-xl font-bold capitalize">{gameResult.worstAsset}</p>
            {gameResult.worstReturn < 0 && (
              <p className="text-red-500 font-bold flex items-center">
                <TrendingDown size={16} className="mr-1" />
                {gameResult.worstReturn.toFixed(1)}%
              </p>
            )}
          </div>
        </div>
        
        {/* Trading Stats */}
        <div className="bg-gray-800 p-4 rounded-lg mb-6 border border-gray-700">
          <h4 className="text-lg font-bold mb-3 flex items-center">
            <Activity className="mr-2 text-blue-400" size={20} />
            Trading Activity
          </h4>
          <div className="grid grid-cols-2 gap-x-4 gap-y-3">
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
        <div className="mb-8 p-4 bg-blue-900 bg-opacity-30 rounded-lg border border-blue-800">
          <h4 className="flex items-center font-bold mb-2">
            <Medal className="text-yellow-400 mr-2" size={20} />
            <span>Performance Analysis</span>
          </h4>
          <p className="text-sm">{getPerformanceFeedback()}</p>
        </div>
        
        {/* Actions */}
        <div className="grid grid-cols-2 gap-4">
          <button 
            onClick={() => navigate('/')}
            className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-3 px-8 rounded-lg font-bold hover:from-blue-500 hover:to-blue-700 transition transform hover:-translate-y-1 flex items-center justify-center shadow-md"
          >
            <Home size={18} className="mr-2" />
            MAIN MENU
          </button>
          <button 
            onClick={handlePlayAgain}
            className="bg-gradient-to-r from-green-600 to-green-800 text-white py-3 px-8 rounded-lg font-bold hover:from-green-500 hover:to-green-700 transition transform hover:-translate-y-1 flex items-center justify-center shadow-md"
          >
            <RotateCcw size={18} className="mr-2" />
            PLAY AGAIN
          </button>
        </div>
        
        {/* Share button */}
        <button className="mt-4 flex items-center justify-center w-full text-gray-300 hover:text-white py-2 px-4 rounded-lg transition-colors">
          <Share2 size={16} className="mr-2" />
          <span>Share Results</span>
        </button>
      </div>
      
      <div className="bg-gray-800 text-white p-4 rounded-lg shadow-lg mb-4">
        <h2 className="text-2xl font-bold text-center">
          <span className="text-white">PORTFOLIO</span> <span className="text-yellow-400">PANIC</span>
        </h2>
      </div>
    </div>
  );
};

export default ResultsScreen;
