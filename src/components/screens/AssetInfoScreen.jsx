import React from 'react';
import Button from '../ui/Button';

const AssetInfoScreen = ({ setGameScreen }) => {
  return (
    <div className="screen asset-info-screen bg-gray-900 text-white p-6 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center">Asset Information</h1>
      
      <div className="grid gap-6 mb-8">
        <div className="bg-gray-800 p-4 rounded-lg">
          <h2 className="text-xl font-bold mb-2 text-blue-400">Stocks</h2>
          <p className="mb-2">Stocks represent ownership in a company. They tend to grow over time but can be volatile.</p>
          <ul className="list-disc pl-5 mb-2">
            <li>Higher potential returns but with higher risk</li>
            <li>Affected by economic news and company performance</li>
            <li>Good for long-term growth</li>
          </ul>
        </div>
        
        <div className="bg-gray-800 p-4 rounded-lg">
          <h2 className="text-xl font-bold mb-2 text-yellow-400">Gold</h2>
          <p className="mb-2">Gold is a precious metal that serves as a store of value. It often performs well during economic uncertainty.</p>
          <ul className="list-disc pl-5 mb-2">
            <li>Traditional safe-haven asset</li>
            <li>Tends to rise during market crashes</li>
            <li>Lower volatility than stocks and crypto</li>
          </ul>
        </div>
        
        <div className="bg-gray-800 p-4 rounded-lg">
          <h2 className="text-xl font-bold mb-2 text-green-400">Bonds</h2>
          <p className="mb-2">Bonds are loans to governments or corporations that pay regular interest.</p>
          <ul className="list-disc pl-5 mb-2">
            <li>More stable than stocks</li>
            <li>Provide regular income</li>
            <li>Lower returns but lower risk</li>
            <li>Sensitive to interest rate changes</li>
          </ul>
        </div>
        
        <div className="bg-gray-800 p-4 rounded-lg">
          <h2 className="text-xl font-bold mb-2 text-purple-400">Crypto</h2>
          <p className="mb-2">Cryptocurrency is a digital or virtual currency secured by cryptography.</p>
          <ul className="list-disc pl-5 mb-2">
            <li>Highest volatility of all assets</li>
            <li>Potential for large gains and losses</li>
            <li>Not tied to traditional markets</li>
            <li>More speculative than other assets</li>
          </ul>
        </div>
      </div>
      
      <div className="investment-tips bg-gray-800 p-4 rounded-lg mb-8">
        <h2 className="text-xl font-bold mb-2 text-green-500">Investment Tips</h2>
        <ul className="list-disc pl-5">
          <li>Diversify your portfolio to reduce risk</li>
          <li>Pay attention to news events that might impact asset prices</li>
          <li>Consider market trends when making investment decisions</li>
          <li>Different assets perform differently in various market conditions</li>
        </ul>
      </div>
      
      <div className="flex justify-center">
        <Button 
          onClick={() => setGameScreen('menu')}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded"
        >
          Back to Menu
        </Button>
      </div>
    </div>
  );
};

export default AssetInfoScreen; 