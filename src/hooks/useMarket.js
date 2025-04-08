import { useState, useEffect, useCallback } from 'react';
import { INITIAL_ASSET_PRICES, GAME_MODE_SETTINGS } from '../utils/gameData';
import { updateMarketPrices, generateNewsEvent } from '../utils/marketLogic';

/**
 * Custom hook for managing market state and operations
 * @param {string} difficulty - Current difficulty level
 * @param {string} gameMode - Current game mode
 * @param {Object} difficultySettings - Settings for the current difficulty
 * @returns {Object} Market state and functions
 */
const useMarket = (difficulty, gameMode, difficultySettings) => {
  // Market state
  const [assetPrices, setAssetPrices] = useState(INITIAL_ASSET_PRICES);
  const [assetTrends, setAssetTrends] = useState(() => {
    // Initialize based on game mode
    return GAME_MODE_SETTINGS[gameMode].startingTrends || {
      stocks: { direction: 'up', strength: 1 },
      gold: { direction: 'up', strength: 1 },
      crypto: { direction: 'up', strength: 1 },
      bonds: { direction: 'down', strength: 1 }
    };
  });
  const [assetVolatility, setAssetVolatility] = useState({
    stocks: 0.08,
    gold: 0.05,
    crypto: 0.15,
    bonds: 0.03
  });
  const [priceHistory, setPriceHistory] = useState({
    stocks: [230, 235, 240],
    gold: [1830, 1840, 1850],
    crypto: [30000, 29500, 29200],
    bonds: [1000, 990, 980]
  });
  
  // News system
  const [currentNews, setCurrentNews] = useState({
    message: "Awaiting market news...",
    impact: { stocks: 1.0, gold: 1.0, crypto: 1.0, bonds: 1.0 }
  });
  const [showNewsPopup, setShowNewsPopup] = useState(false);
  const [newsPopup, setNewsPopup] = useState({
    title: "",
    message: "",
    tip: ""
  });
  
  // Market alerts
  const [showMarketAlert, setShowMarketAlert] = useState(false);
  const [marketAlert, setMarketAlert] = useState({
    title: "",
    message: ""
  });
  
  // Initialize market conditions based on game mode and difficulty
  useEffect(() => {
    // Set volatility based on difficulty
    const volatilityMultiplier = difficultySettings[difficulty].volatilityMultiplier;
    setAssetVolatility({
      stocks: 0.08 * volatilityMultiplier,
      gold: 0.05 * volatilityMultiplier,
      crypto: 0.15 * volatilityMultiplier,
      bonds: 0.03 * volatilityMultiplier
    });
    
    // Set initial trends based on game mode
    if (GAME_MODE_SETTINGS[gameMode].startingTrends) {
      setAssetTrends(GAME_MODE_SETTINGS[gameMode].startingTrends);
    }
    
    // Reset prices to initial values
    setAssetPrices(INITIAL_ASSET_PRICES);
    
    // Reset price history
    setPriceHistory({
      stocks: [230, 235, 240],
      gold: [1830, 1840, 1850],
      crypto: [30000, 29500, 29200],
      bonds: [1000, 990, 980]
    });
  }, [difficulty, gameMode, difficultySettings]);
  
  // Update market prices
  const updateMarket = useCallback((newsImpact = null) => {
    const result = updateMarketPrices(
      assetPrices,
      priceHistory,
      assetTrends,
      assetVolatility,
      newsImpact,
      difficulty,
      gameMode
    );
    
    setAssetPrices(result.updatedPrices);
    setPriceHistory(result.updatedPriceHistory);
    setAssetTrends(result.updatedTrends);
    
    return result;
  }, [assetPrices, priceHistory, assetTrends, assetVolatility, difficulty, gameMode]);
  
  // Generate a news event
  const generateNews = useCallback((callback = null) => {
    const newsEvent = generateNewsEvent(gameMode, difficulty, difficultySettings);
    
    // Handle market crash events
    if (newsEvent.isCrash) {
      setShowMarketAlert(true);
      setMarketAlert({
        title: "MARKET CRASH!",
        message: "Widespread selling pressure across markets. Brace for volatility!"
      });
      
      // Notify caller of crash event
      if (callback) {
        callback('crash', newsEvent);
      }
    }
    
    // Update news state
    setNewsPopup(newsEvent);
    setCurrentNews({
      message: newsEvent.title,
      impact: newsEvent.impact
    });
    
    // Show news popup
    setShowNewsPopup(true);
    
    return newsEvent;
  }, [gameMode, difficulty, difficultySettings]);
  
  // Apply news impact to market with optional delay
  const applyNewsImpact = useCallback((newsEvent, delay = 0) => {
    if (delay > 0) {
      setTimeout(() => {
        updateMarket(newsEvent.impact);
      }, delay);
    } else {
      updateMarket(newsEvent.impact);
    }
  }, [updateMarket]);
  
  // Get trend description for an asset
  const getTrendDescription = useCallback((asset) => {
    const trend = assetTrends[asset];
    const strength = trend.strength;
    
    if (trend.direction === 'up') {
      if (strength === 1) return 'Slight upward trend';
      if (strength === 2) return 'Moderate upward trend';
      if (strength === 3) return 'Strong upward trend';
    } else {
      if (strength === 1) return 'Slight downward trend';
      if (strength === 2) return 'Moderate downward trend';
      if (strength === 3) return 'Strong downward trend';
    }
    
    return 'Stable';
  }, [assetTrends]);
  
  // Get volatility description for an asset
  const getVolatilityDescription = useCallback((asset) => {
    const vol = assetVolatility[asset];
    
    if (vol < 0.05) return 'Very Low';
    if (vol < 0.08) return 'Low';
    if (vol < 0.12) return 'Moderate';
    if (vol < 0.18) return 'High';
    return 'Very High';
  }, [assetVolatility]);
  
  return {
    // Market state
    assetPrices,
    setAssetPrices,
    assetTrends,
    setAssetTrends,
    assetVolatility,
    setAssetVolatility,
    priceHistory,
    setPriceHistory,
    
    // News system
    currentNews,
    setCurrentNews,
    showNewsPopup,
    setShowNewsPopup,
    newsPopup,
    setNewsPopup,
    
    // Market alerts
    showMarketAlert,
    setShowMarketAlert,
    marketAlert,
    setMarketAlert,
    
    // Functions
    updateMarket,
    generateNews,
    applyNewsImpact,
    getTrendDescription,
    getVolatilityDescription
  };
};

export default useMarket;