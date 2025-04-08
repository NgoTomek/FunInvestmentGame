import { useState, useEffect } from 'react';
import { loadAchievements, saveAchievements } from '../utils/localStorage';
import { ACHIEVEMENTS } from '../utils/gameData';

/**
 * Custom hook for managing achievements
 * @returns {Object} Achievement management functions and state
 */
const useAchievements = () => {
  // Initialize achievements state from localStorage or defaults
  const [achievements, setAchievements] = useState(() => {
    const savedAchievements = loadAchievements();
    return savedAchievements || ACHIEVEMENTS;
  });
  
  // Save achievements to localStorage when they change
  useEffect(() => {
    saveAchievements(achievements);
  }, [achievements]);
  
  /**
   * Unlock an achievement by ID
   * @param {string} id - The achievement ID to unlock
   * @returns {boolean} Whether the achievement was newly unlocked
   */
  const unlockAchievement = (id) => {
    if (!achievements[id] || achievements[id].unlocked) {
      return false; // Already unlocked or doesn't exist
    }
    
    setAchievements(prev => ({
      ...prev,
      [id]: { ...prev[id], unlocked: true }
    }));
    
    return true; // Successfully unlocked
  };
  
  /**
   * Check if an achievement is unlocked
   * @param {string} id - The achievement ID to check
   * @returns {boolean} Whether the achievement is unlocked
   */
  const isUnlocked = (id) => {
    return achievements[id]?.unlocked || false;
  };
  
  /**
   * Reset all achievements to locked state
   */
  const resetAchievements = () => {
    const resetState = Object.entries(achievements).reduce((acc, [id, achievement]) => {
      acc[id] = { ...achievement, unlocked: false };
      return acc;
    }, {});
    
    setAchievements(resetState);
  };
  
  /**
   * Get count of unlocked achievements
   * @returns {number} Number of unlocked achievements
   */
  const getUnlockedCount = () => {
    return Object.values(achievements).filter(a => a.unlocked).length;
  };
  
  /**
   * Check for achievements based on game state
   * @param {Object} gameState - Current game state
   * @param {Object} assetQuantities - Asset quantities
   * @param {Object} assetPrices - Asset prices
   * @param {number} portfolioValue - Total portfolio value
   */
  const checkAchievements = (gameState, assetQuantities, assetPrices, portfolioValue) => {
    const { 
      startingCash, gameStats, round, totalRounds
    } = gameState;
    
    // Check each achievement condition
    if (gameStats.profitableTrades > 0 && !isUnlocked('firstProfit')) {
      unlockAchievement('firstProfit');
    }
    
    // Diversified portfolio - own all assets
    const hasAllAssets = Object.values(assetQuantities).every(qty => qty > 0);
    if (hasAllAssets && !isUnlocked('diversified')) {
      unlockAchievement('diversified');
    }
    
    // Gold hoarder
    if (assetQuantities.gold >= 5 && !isUnlocked('goldHoarder')) {
      unlockAchievement('goldHoarder');
    }
    
    // Risk taker (>50% in crypto)
    const cryptoValue = assetQuantities.crypto * assetPrices.crypto;
    if (cryptoValue > portfolioValue * 0.5 && !isUnlocked('riskTaker')) {
      unlockAchievement('riskTaker');
    }
    
    // Wealthy investor
    if (portfolioValue >= 15000 && !isUnlocked('wealthyInvestor')) {
      unlockAchievement('wealthyInvestor');
    }
    
    // Day trader - 10 trades in single round
    if (gameStats.tradesPerRound >= 10 && !isUnlocked('dayTrader')) {
      unlockAchievement('dayTrader');
    }
    
    // Return-based achievements checked at end of game
    if (round === totalRounds) {
      const returnPercentage = ((portfolioValue - startingCash) / startingCash) * 100;
      
      // 10% return achievement
      if (returnPercentage >= 10 && !isUnlocked('tenPercent')) {
        unlockAchievement('tenPercent');
      }
      
      // Crash survivor achievement
      if (gameStats.marketCrashesWeathered > 0 && returnPercentage > 0 && !isUnlocked('marketCrash')) {
        unlockAchievement('marketCrash');
      }
      
      // Bond king achievement
      const bondReturn = (assetQuantities.bonds * assetPrices.bonds - startingCash) / startingCash * 100;
      if (bondReturn >= 5 && !isUnlocked('bondKing')) {
        unlockAchievement('bondKing');
      }
    }
  };
  
  return {
    achievements,
    unlockAchievement,
    isUnlocked,
    resetAchievements,
    getUnlockedCount,
    checkAchievements
  };
};

export default useAchievements;