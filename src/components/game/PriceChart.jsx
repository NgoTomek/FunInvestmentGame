import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

const PriceChart = ({ asset, priceHistory, asset_name }) => {
  // Prepare data for recharts
  const chartData = priceHistory && priceHistory.length > 0 
    ? priceHistory.map((price, index) => ({
        time: index + 1, // Use index as time point
        price: price
      }))
    : [{ time: 1, price: 0 }];
  
  // Get asset color based on asset type
  const getAssetColor = () => {
    switch(asset) {
      case 'stocks': return '#3B82F6'; // blue-500
      case 'oil': return '#1F2937'; // gray-800
      case 'gold': return '#F59E0B'; // yellow-500
      case 'crypto': return '#8B5CF6'; // purple-500
      case 'bonds': return '#10B981'; // green-500
      default: return '#6B7280'; // gray-500
    }
  };
  
  // Calculate min and max for YAxis domain
  const allPrices = priceHistory || [];
  const minPrice = Math.min(...allPrices) * 0.95; // 5% lower than min
  const maxPrice = Math.max(...allPrices) * 1.05; // 5% higher than max
  
  // Calculate average price
  const avgPrice = allPrices.length > 0 
    ? allPrices.reduce((sum, price) => sum + price, 0) / allPrices.length
    : 0;
  
  // Custom tooltip component
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const currentPrice = payload[0].value;
      
      // Calculate percentage change from first price
      const firstPrice = allPrices[0] || 0;
      const percentChange = firstPrice > 0 
        ? ((currentPrice - firstPrice) / firstPrice) * 100
        : 0;
      
      return (
        <div className="bg-gray-800 p-3 border border-gray-700 rounded-lg shadow-lg">
          <p className="text-white font-bold mb-1">{`${asset_name || asset}: $${currentPrice.toLocaleString()}`}</p>
          <p className="text-gray-400 text-xs mb-1">Time: {payload[0].payload.time}</p>
          <p className={`text-xs font-bold ${percentChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {percentChange >= 0 ? '+' : ''}{percentChange.toFixed(2)}% from start
          </p>
        </div>
      );
    }
    return null;
  };
  
  // Get gradient IDs
  const upGradientId = `chart-gradient-up-${asset}`;
  const downGradientId = `chart-gradient-down-${asset}`;
  
  // Determine if trend is up
  const isTrendUp = priceHistory && priceHistory.length > 1
    ? priceHistory[priceHistory.length - 1] >= priceHistory[0] 
    : true;
  
  return (
    <div className="w-full h-64 bg-gray-800 p-4 rounded-lg shadow-lg">
      <h3 className="text-lg font-bold mb-2 capitalize flex justify-between items-center">
        <span>{asset_name || asset} Price Chart</span>
        {priceHistory && priceHistory.length > 0 && (
          <span className={`text-sm px-2 py-1 rounded ${
            isTrendUp ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'
          }`}>
            {isTrendUp ? 'UPTREND' : 'DOWNTREND'}
          </span>
        )}
      </h3>
      
      {priceHistory && priceHistory.length > 1 ? (
        <ResponsiveContainer width="100%" height="85%">
          <LineChart
            data={chartData}
            margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
          >
            <defs>
              <linearGradient id={upGradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id={downGradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#EF4444" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#EF4444" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis 
              dataKey="time" 
              tick={{ fill: '#9CA3AF' }} 
              label={{ value: 'Time', position: 'insideBottomRight', offset: 0, fill: '#9CA3AF' }}
            />
            <YAxis 
              domain={[minPrice, maxPrice]} 
              tick={{ fill: '#9CA3AF' }}
              label={{ value: 'Price', angle: -90, position: 'insideLeft', fill: '#9CA3AF' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine y={avgPrice} stroke="#6B7280" strokeDasharray="3 3" />
            <Line 
              type="monotone" 
              dataKey="price" 
              stroke={isTrendUp ? "#10B981" : "#EF4444"} 
              strokeWidth={2}
              dot={{ r: 4, fill: isTrendUp ? "#10B981" : "#EF4444", stroke: isTrendUp ? "#10B981" : "#EF4444" }}
              activeDot={{ r: 6, stroke: '#fff', strokeWidth: 2 }}
              fill={`url(#${isTrendUp ? upGradientId : downGradientId})`}
              fillOpacity={0.2}
            />
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <div className="flex items-center justify-center h-full text-gray-400">
          Not enough data to display chart
        </div>
      )}
    </div>
  );
};

export default PriceChart;
