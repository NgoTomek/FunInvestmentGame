import React from 'react';

const TabNavigation = ({ tabs, selectedTab, setSelectedTab }) => {
  return (
    <div className="bg-gray-800 text-white rounded-lg mb-4">
      <div className="flex">
        {tabs.map(tab => (
          <button 
            key={tab.id}
            className={`py-3 px-4 font-bold transition-all duration-200 ${
              selectedTab === tab.id 
                ? 'border-b-2 border-yellow-400 text-yellow-400' 
                : 'hover:bg-gray-700'
            }`}
            onClick={() => setSelectedTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TabNavigation;