import React from 'react';
import { Briefcase, BarChart2, PieChart } from 'lucide-react';

const TabNavigation = ({ tabs, selectedTab, setSelectedTab }) => {
  // Get icon for tab
  const getTabIcon = (tabId) => {
    switch(tabId) {
      case 'portfolio':
        return <Briefcase size={18} />;
      case 'market':
        return <BarChart2 size={18} />;
      case 'analysis':
        return <PieChart size={18} />;
      default:
        return null;
    }
  };
  
  return (
    <div className="bg-gray-800 text-white rounded-lg mb-4 shadow-lg">
      <div className="flex">
        {tabs.map(tab => (
          <button 
            key={tab.id}
            className={`flex-1 py-3 px-4 font-bold transition-all duration-200 flex items-center justify-center space-x-2 ${
              selectedTab === tab.id 
                ? 'border-b-2 border-yellow-400 text-yellow-400 bg-gray-700' 
                : 'hover:bg-gray-700'
            }`}
            onClick={() => setSelectedTab(tab.id)}
          >
            {getTabIcon(tab.id)}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default TabNavigation;
