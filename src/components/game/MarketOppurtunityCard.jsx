import React from 'react';
import { Zap, TrendingUp } from 'lucide-react';

const MarketOpportunityCard = ({ opportunity, handleOpportunity }) => {
  // Get opportunity details
  const getOpportunityStyle = () => {
    switch(opportunity.type) {
      case 'double':
        return {
          icon: <Zap size={36} className="text-yellow-500" />,
          bgColor: 'bg-orange-600',
          hoverColor: 'hover:bg-orange-500'
        };
      case 'insider':
        return {
          icon: <TrendingUp size={36} className="text-green-500" />,
          bgColor: 'bg-blue-600',
          hoverColor: 'hover:bg-blue-500'
        };
      case 'short_squeeze':
        return {
          icon: <Zap size={36} className="text-red-500" />,
          bgColor: 'bg-purple-600',
          hoverColor: 'hover:bg-purple-500'
        };
      default:
        return {
          icon: <Zap size={36} className="text-yellow-500" />,
          bgColor: 'bg-gray-600',
          hoverColor: 'hover:bg-gray-500'
        };
    }
  };
  
  const opportunityStyle = getOpportunityStyle();
  
  return (
    <div className="bg-gray-900 text-white p-4 rounded-lg">
      <h3 className="text-xl font-bold mb-3">Market Opportunity</h3>
      
      <div className="flex items-start mb-3">
        <div className="bg-gray-800 p-2 rounded-full mr-3">
          {opportunityStyle.icon}
        </div>
        <div>
          <div className="font-bold text-lg">{opportunity.title}</div>
          <p className="text-sm text-gray-400">{opportunity.description}</p>
        </div>
      </div>
      
      {/* Opportunity visualization */}
      <div className="w-full h-12 mb-3">
        <svg width="100%" height="100%" viewBox="0 0 180 40" preserveAspectRatio="none">
          <path
            d="M0,30 L30,25 L60,35 L90,10 L120,5 L150,25 L180,10"
            fill="none"
            stroke="#4ade80"
            strokeWidth="2"
          />
          <circle cx="90" cy="10" r="4" fill="#22c55e" />
        </svg>
      </div>
      
      {/* Action Button */}
      <button
        onClick={() => handleOpportunity(opportunity)}
        className={`w-full ${opportunityStyle.bgColor} ${opportunityStyle.hoverColor} text-white py-3 rounded-lg font-bold text-center uppercase tracking-wide`}
      >
        {opportunity.actionText || "TAKE OPPORTUNITY"}
      </button>
    </div>
  );
};

export default MarketOpportunityCard;