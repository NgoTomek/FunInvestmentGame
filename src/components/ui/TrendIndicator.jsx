import React from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';

const TrendIndicator = ({ trend }) => {
  const direction = trend.direction;
  const strength = trend.strength;
  
  return (
    <div className="flex" title={`${direction === 'up' ? 'Upward' : 'Downward'} trend, strength: ${strength}/3`}>
      {direction === 'up' ? (
        Array(strength).fill(0).map((_, i) => (
          <ArrowUp key={`up-${i}`} className="text-green-500" size={16} />
        ))
      ) : (
        Array(strength).fill(0).map((_, i) => (
          <ArrowDown key={`down-${i}`} className="text-red-500" size={16} />
        ))
      )}
    </div>
  );
};

export default TrendIndicator;