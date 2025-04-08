import React from 'react';
import { Zap, TrendingUp, AlertTriangle, DollarSign, Rocket } from 'lucide-react';

const MarketOpportunityCard = ({ opportunity, handleOpportunity }) => {
  // Get opportunity details
  const getOpportunityStyle = () => {
    switch(opportunity.type) {
      case 'double':
        return {
          icon: <Zap size={36} className="text-yellow-300" />,
          bgGradient: 'bg-gradient-to-br from-orange-600 to-red-700',
          hoverGradient: 'hover:from-orange-500 hover:to-red-600',
          textColor: 'text-white'
        };
      case 'insider':
        return {
          icon: <TrendingUp size={36} className="text-green-300" />,
          bgGradient: 'bg-gradient-to-br from-blue-600 to-blue-900',
          hoverGradient: 'hover:from-blue-500 hover:to-blue-800',
          textColor: 'text-white'
        };
      case 'short_squeeze':
        return {
          icon: <Zap size={36} className="text-purple-300" />,
          bgGradient: 'bg-gradient-to-br from-purple-600 to-purple-900',
          hoverGradient: 'hover:from-purple-500 hover:to-purple-800',
          textColor: 'text-white'
        };
      case 'flash_sale':
        return {
          icon: <DollarSign size={36} className="text-green-300" />,
          bgGradient: 'bg-gradient-to-br from-green-600 to-green-900',
          hoverGradient: 'hover:from-green-500 hover:to-green-800',
          textColor: 'text-white'
        };
      case 'margin_call':
        return {
          icon: <AlertTriangle size={36} className="text-yellow-300" />,
          bgGradient: 'bg-gradient-to-br from-red-600 to-red-900',
          hoverGradient: 'hover:from-red-500 hover:to-red-800',
          textColor: 'text-white'
        };
      default:
        return {
          icon: <Rocket size={36} className="text-blue-300" />,
          bgGradient: 'bg-gradient-to-br from-gray-700 to-gray-900',
          hoverGradient: 'hover:from-gray-600 hover:to-gray-800',
          textColor: 'text-white'
        };
    }
  };
  
  const opportunityStyle = getOpportunityStyle();
  
  // Get risk indicator color
  const getRiskColor = (risk) => {
    switch(risk) {
      case 'low':
        return 'bg-green-500';
      case 'medium':
        return 'bg-yellow-500';
      case 'high':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };
  
  return (
    <div className="bg-gray-900 text-white p-4 rounded-lg relative shadow-lg border border-gray-800 overflow-hidden">
      {/* Glow Effect */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-blue-500 opacity-20 animate-pulse rounded-lg"></div>
      
      <div className="relative">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-xl font-bold">Special Opportunity</h3>
          {opportunity.risk && (
            <div className="flex items-center">
              <div className={`w-2 h-2 rounded-full mr-1 ${getRiskColor(opportunity.risk)}`}></div>
              <span className="text-xs uppercase">{opportunity.risk} risk</span>
            </div>
          )}
        </div>
        
        <div className="flex items-start mb-3">
          <div className={`${opportunityStyle.bgGradient} p-3 rounded-full mr-3`}>
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
            <defs>
              <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#4ade80" stopOpacity="0.8"/>
                <stop offset="100%" stopColor="#4ade80" stopOpacity="0.2"/>
              </linearGradient>
            </defs>
            <path
              d="M0,30 L30,25 L60,35 L90,10 L120,5 L150,25 L180,10"
              fill="none"
              stroke="#4ade80"
              strokeWidth="2"
            />
            <circle cx="90" cy="10" r="4" fill="#22c55e" />
            <circle cx="90" cy="10" r="8" fill="none" stroke="#22c55e" strokeWidth="1" opacity="0.5">
              <animate attributeName="r" from="4" to="12" dur="2s" repeatCount="indefinite" />
              <animate attributeName="opacity" from="0.8" to="0" dur="2s" repeatCount="indefinite" />
            </circle>
          </svg>
        </div>
        
        {/* Action Button */}
        <button
          onClick={() => handleOpportunity(opportunity)}
          className={`w-full ${opportunityStyle.bgGradient} ${opportunityStyle.hoverGradient} ${opportunityStyle.textColor} py-3 rounded-lg font-bold text-center uppercase tracking-wide transition-all transform hover:-translate-y-1`}
        >
          {opportunity.actionText || "TAKE OPPORTUNITY"}
        </button>
        
        {/* Time Limit Indicator */}
        <div className="mt-2 text-center text-xs text-gray-400">
          Limited time offer - Act quickly!
        </div>
      </div>
    </div>
  );
};

export default MarketOpportunityCard;
