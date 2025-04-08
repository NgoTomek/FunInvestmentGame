import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const PriceChart = ({ asset, priceHistory, asset_name }) => {
  // Prepare data for recharts
  const chartData = priceHistory.map((price, index) => ({
    time: index + 1, // Use index as time point
    price: price
  }));
  
  // Get asset color based on asset type
  const getAssetColor = () => {
    switch(asset) {
      case 'stocks': return '#3B82F6'; // blue-500
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
  
  // Custom tooltip component
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-800 p-2 border border-gray-700 rounded-lg shadow-lg">
          <p className="text-white font-bold">{`${asset_name || asset}: ${payload[0].value}`}</p>
          <p className="text-gray-400 text-xs">Time: {payload[0].payload.time}</p>
        </div>
      );
    }
    return null;
  };
  
  return (
    <div className="w-full h-64 bg-gray-800 p-4 rounded-lg">
      <h3 className="text-lg font-bold mb-2 capitalize">{asset_name || asset} Price Chart</h3>
      
      {priceHistory && priceHistory.length > 1 ? (
        <ResponsiveContainer width="100%" height="85%">
          <LineChart
            data={chartData}
            margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
          >
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
            <Line 
              type="monotone" 
              dataKey="price" 
              stroke={getAssetColor()} 
              strokeWidth={2}
              dot={{ r: 3, fill: getAssetColor(), stroke: getAssetColor() }}
              activeDot={{ r: 5, stroke: '#fff', strokeWidth: 2 }}
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