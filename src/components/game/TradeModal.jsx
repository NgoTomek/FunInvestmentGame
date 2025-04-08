import React, { useState, useEffect } from 'react';
import { X, DollarSign, TrendingUp, TrendingDown } from 'lucide-react';

const TradeModal = ({ 
  asset, 
  price, 
  quantity, 
  cash, 
  initialAction, 
  onClose, 
  onSubmit,
  formatCurrency 
}) => {
  const [action, setAction] = useState(initialAction || 'buy');
  const [tradeQuantity, setTradeQuantity] = useState(1);
  const [maxPossible, setMaxPossible] = useState(1);
  const [holdDuration, setHoldDuration] = useState(1); // For hold strategy
  const [holdCondition, setHoldCondition] = useState('price-increase'); // For hold strategy
  const [holdPercentage, setHoldPercentage] = useState(5); // For hold strategy
  
  // Calculate total cost or return
  const calculateTotal = () => {
    return price * tradeQuantity;
  };
  
  // Calculate max possible buy quantity based on cash
  useEffect(() => {
    if (action === 'buy') {
      const maxBuy = Math.floor(cash / price);
      setMaxPossible(maxBuy);
      // If user entered more than possible, adjust
      if (tradeQuantity > maxBuy) {
        setTradeQuantity(maxBuy);
      }
    } else if (action === 'sell') {
      setMaxPossible(quantity);
      // If user entered more than possible, adjust
      if (tradeQuantity > quantity) {
        setTradeQuantity(quantity);
      }
    }
  }, [action, cash, price, quantity]);
  
  // Handle quantity change
  const handleQuantityChange = (e) => {
    let newValue = parseFloat(e.target.value) || 0;
    // Ensure not negative
    newValue = Math.max(0, newValue);
    // Ensure within bounds
    if (action === 'buy') {
      newValue = Math.min(newValue, maxPossible);
    } else if (action === 'sell') {
      newValue = Math.min(newValue, quantity);
    }
    
    // For crypto, allow 2 decimal places
    if (asset === 'crypto') {
      newValue = Math.round(newValue * 100) / 100;
    } else {
      newValue = Math.floor(newValue);
    }
    
    setTradeQuantity(newValue);
  };
  
  // Set maximum possible quantity
  const setMaximum = () => {
    setTradeQuantity(maxPossible);
  };
  
  // Set half of maximum possible quantity
  const setHalf = () => {
    setTradeQuantity(Math.floor(maxPossible / 2));
  };
  
  // Handle preset quantity buttons
  const handlePresetQuantity = (amount) => {
    if (amount > maxPossible) {
      setTradeQuantity(maxPossible);
    } else {
      setTradeQuantity(amount);
    }
  };
  
  // Handle submit
  const handleSubmit = () => {
    if (action === 'hold') {
      // For hold strategy, submit with strategy details
      onSubmit(asset, 'hold', {
        duration: holdDuration,
        condition: holdCondition,
        percentage: holdPercentage
      });
    } else {
      // For buy/sell actions
      onSubmit(asset, action, tradeQuantity);
    }
  };
  
  // Get asset color
  const getAssetColor = () => {
    switch(asset) {
      case 'stocks': return 'text-blue-500';
      case 'gold': return 'text-yellow-500';
      case 'crypto': return 'text-purple-500';
      case 'bonds': return 'text-green-500';
      default: return 'text-white';
    }
  };
  
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
      <div className="bg-gray-800 text-white p-6 rounded-lg max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">
            <span className={getAssetColor()}>{asset.toUpperCase()}</span> TRADING
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X size={24} />
          </button>
        </div>
        
        {/* Current Price & Holdings */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-gray-700 p-3 rounded-lg">
            <div className="text-sm text-gray-400 mb-1">Current Price</div>
            <div className="text-xl font-bold">{formatCurrency(price)}</div>
          </div>
          <div className="bg-gray-700 p-3 rounded-lg">
            <div className="text-sm text-gray-400 mb-1">You Own</div>
            <div className="text-xl font-bold">
              {asset === 'crypto' ? quantity.toFixed(2) : quantity} {asset}
            </div>
          </div>
        </div>
        
        {/* Action Tabs */}
        <div className="flex border-b border-gray-700 mb-4">
          <button 
            className={`py-2 px-4 font-bold ${action === 'buy' ? 'text-green-500 border-b-2 border-green-500' : 'text-gray-400'}`}
            onClick={() => setAction('buy')}
          >
            BUY
          </button>
          <button 
            className={`py-2 px-4 font-bold ${action === 'sell' ? 'text-red-500 border-b-2 border-red-500' : 'text-gray-400'}`}
            onClick={() => setAction('sell')}
            disabled={quantity <= 0}
          >
            SELL
          </button>
          <button 
            className={`py-2 px-4 font-bold ${action === 'hold' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-400'}`}
            onClick={() => setAction('hold')}
          >
            HOLD
          </button>
        </div>
        
        {/* Buy/Sell Form */}
        {(action === 'buy' || action === 'sell') && (
          <>
            {/* Quantity controls */}
            <div className="mb-4">
              <label className="block text-sm font-bold mb-2">Quantity</label>
              <div className="flex items-center">
                <input
                  type="number"
                  value={tradeQuantity}
                  onChange={handleQuantityChange}
                  className="bg-gray-700 text-white p-2 rounded-lg w-full"
                  step={asset === 'crypto' ? '0.01' : '1'}
                  min="0"
                  max={action === 'buy' ? Math.floor(cash / price) : quantity}
                />
                <button 
                  onClick={setHalf}
                  className="ml-2 bg-gray-700 text-white p-2 rounded-lg"
                >
                  Half
                </button>
                <button 
                  onClick={setMaximum}
                  className="ml-2 bg-gray-700 text-white p-2 rounded-lg"
                >
                  Max
                </button>
              </div>
            </div>
            
            {/* Quick quantity buttons */}
            <div className="grid grid-cols-4 gap-2 mb-6">
              <button 
                onClick={() => handlePresetQuantity(1)}
                className="bg-gray-700 text-white p-2 rounded-lg"
              >
                1
              </button>
              <button 
                onClick={() => handlePresetQuantity(5)}
                className="bg-gray-700 text-white p-2 rounded-lg"
              >
                5
              </button>
              <button 
                onClick={() => handlePresetQuantity(10)}
                className="bg-gray-700 text-white p-2 rounded-lg"
              >
                10
              </button>
              <button 
                onClick={() => handlePresetQuantity(25)}
                className="bg-gray-700 text-white p-2 rounded-lg"
              >
                25
              </button>
            </div>
            
            {/* Transaction summary */}
            <div className="bg-gray-700 p-4 rounded-lg mb-6">
              <div className="flex justify-between mb-2">
                <span>Price per unit:</span>
                <span className="font-bold">{formatCurrency(price)}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span>Quantity:</span>
                <span className="font-bold">{tradeQuantity}</span>
              </div>
              <div className="flex justify-between text-lg font-bold pt-2 border-t border-gray-600">
                <span>Total {action === 'buy' ? 'Cost' : 'Return'}:</span>
                <span className={action === 'buy' ? 'text-red-500' : 'text-green-500'}>
                  {formatCurrency(calculateTotal())}
                </span>
              </div>
            </div>
            
            {/* Available funds message */}
            {action === 'buy' && (
              <div className="flex items-center mb-6">
                <DollarSign className="text-green-500 mr-2" size={20} />
                <span>Available funds: {formatCurrency(cash)}</span>
              </div>
            )}
          </>
        )}
        
        {/* Hold Strategy Form */}
        {action === 'hold' && (
          <>
            <div className="mb-4">
              <label className="block text-sm font-bold mb-2">Hold Strategy</label>
              <select
                value={holdCondition}
                onChange={(e) => setHoldCondition(e.target.value)}
                className="bg-gray-700 text-white p-2 rounded-lg w-full mb-4"
              >
                <option value="price-increase">Sell when price increases by</option>
                <option value="price-decrease">Sell when price decreases by</option>
                <option value="time-period">Hold for fixed time period</option>
              </select>
              
              {holdCondition !== 'time-period' ? (
                <div className="flex items-center">
                  <input 
                    type="number" 
                    value={holdPercentage}
                    onChange={(e) => setHoldPercentage(Math.max(1, parseInt(e.target.value) || 0))}
                    className="bg-gray-700 text-white p-2 rounded-lg w-24"
                    min="1"
                    max="50"
                  />
                  <span className="ml-2">% {holdCondition === 'price-increase' ? <TrendingUp className="inline text-green-500" size={16} /> : <TrendingDown className="inline text-red-500" size={16} />}</span>
                </div>
              ) : (
                <div className="flex items-center">
                  <input 
                    type="number" 
                    value={holdDuration}
                    onChange={(e) => setHoldDuration(Math.max(1, parseInt(e.target.value) || 0))}
                    className="bg-gray-700 text-white p-2 rounded-lg w-24"
                    min="1"
                    max="10"
                  />
                  <span className="ml-2">rounds</span>
                </div>
              )}
            </div>
            
            <div className="bg-gray-700 p-4 rounded-lg mb-6">
              <h4 className="font-bold mb-2">Strategy Summary</h4>
              <p>
                {holdCondition === 'price-increase' && `Automatically sell ${asset} when the price increases by ${holdPercentage}%`}
                {holdCondition === 'price-decrease' && `Automatically sell ${asset} when the price decreases by ${holdPercentage}%`}
                {holdCondition === 'time-period' && `Hold ${asset} for ${holdDuration} rounds before reconsidering`}
              </p>
              <p className="text-gray-400 mt-2 text-sm">
                Hold strategies can help you make disciplined trading decisions based on your plan.
              </p>
            </div>
          </>
        )}
        
        {/* Action buttons */}
        <div className="flex justify-between">
          <button 
            onClick={onClose}
            className="bg-gray-600 text-white py-2 px-6 rounded-lg font-bold"
          >
            CANCEL
          </button>
          <button 
            onClick={handleSubmit}
            className={`text-white py-2 px-6 rounded-lg font-bold ${
              action === 'buy' ? 'bg-green-600' : 
              action === 'sell' ? 'bg-red-600' : 
              'bg-blue-600'
            }`}
            disabled={(action === 'buy' && (tradeQuantity <= 0 || cash < price * tradeQuantity)) ||
                     (action === 'sell' && (tradeQuantity <= 0 || quantity < tradeQuantity))}
          >
            {action.toUpperCase()}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TradeModal;