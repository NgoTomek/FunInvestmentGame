// Market simulation and news generation logic

/**
 * Generate a news event based on game mode and difficulty
 * @param {string} gameMode - Current game mode
 * @param {string} difficulty - Current difficulty level
 * @param {Object} difficultySettings - Settings for different difficulty levels
 * @returns {Object} News event object with title, message, and impact
 */
export const generateNewsEvent = (gameMode, difficulty, difficultySettings) => {
  const newsEvents = [
    {
      title: "COMPANY X REPORTS STRONG EARNINGS!",
      message: "Tech stocks jump after better-than-expected quarterly earnings.",
      impact: { stocks: 1.15, oil: 0.98, gold: 0.98, crypto: 1.05 },
      tip: "Consider investing in tech stocks to capitalize on the momentum."
    },
    {
      title: "INTEREST RATES INCREASE!",
      message: "The central bank has increased interest rates by 0.5%.",
      impact: { stocks: 0.92, oil: 0.95, gold: 1.03, crypto: 0.88 },
      tip: "Higher interest rates often pressure stocks but can be good for bonds."
    },
    {
      title: "CRYPTOCURRENCY REGULATION ANNOUNCED",
      message: "Government announces new cryptocurrency regulations.",
      impact: { stocks: 1.01, oil: 1.0, gold: 1.05, crypto: 0.78 },
      tip: "Consider reducing crypto exposure until regulatory clarity emerges."
    },
    {
      title: "GOLD RESERVES DISCOVERED",
      message: "Large gold reserves discovered in remote region.",
      impact: { stocks: 1.03, oil: 0.99, gold: 0.85, crypto: 1.02 },
      tip: "New gold supplies often lead to lower gold prices in the short term."
    },
    {
      title: "NEW SMARTPHONE MODEL IS A HIT!",
      message: "The latest smartphone release has broken sales records.",
      impact: { stocks: 1.12, oil: 1.02, gold: 0.97, crypto: 1.04 },
      tip: "Tech innovations can boost stock markets across sectors."
    },
    {
      title: "GLOBAL ECONOMIC UNCERTAINTY RISES",
      message: "Geopolitical tensions are causing uncertainty in global markets.",
      impact: { stocks: 0.93, oil: 1.15, gold: 1.12, crypto: 0.95 },
      tip: "Safe haven assets like gold often perform well during uncertainty."
    },
    {
      title: "TECH COMPANY ANNOUNCES LAYOFFS",
      message: "Major tech company announces significant workforce reduction.",
      impact: { stocks: 0.94, oil: 1.02, gold: 1.01, crypto: 0.97 },
      tip: "Cost-cutting measures can sometimes boost stock prices in the near term."
    },
    {
      title: "HOUSING MARKET COOLING DOWN",
      message: "Real estate prices show signs of stabilizing after years of growth.",
      impact: { stocks: 0.98, oil: 0.97, gold: 1.02, crypto: 0.99 },
      tip: "Economic slowdowns can affect multiple asset classes differently."
    },
    {
      title: "OIL SUPPLY DISRUPTION",
      message: "Major oil-producing region faces production challenges.",
      impact: { stocks: 0.96, oil: 1.25, gold: 1.05, crypto: 0.98 },
      tip: "Energy price spikes can ripple through other markets."
    },
    {
      title: "SEC CRACKS DOWN ON CRYPTO EXCHANGES",
      message: "Regulatory action targets crypto trading platforms.",
      impact: { stocks: 1.01, oil: 1.0, gold: 1.03, crypto: 0.75 },
      tip: "Regulatory news often causes short-term volatility but can lead to healthier markets."
    },
    {
      title: "TECH BREAKTHROUGH ANNOUNCED",
      message: "Revolutionary technology could transform multiple industries.",
      impact: { stocks: 1.18, oil: 0.92, gold: 0.96, crypto: 1.15 },
      tip: "Disruptive innovations can create new market leaders."
    },
    {
      title: "INFLATION DATA HIGHER THAN EXPECTED",
      message: "Consumer prices rise faster than analyst projections.",
      impact: { stocks: 0.94, oil: 1.08, gold: 1.10, crypto: 0.97 },
      tip: "Gold traditionally performs well during inflation."
    }
  ];
  
  // Special events based on game mode
  if (gameMode === 'crisis' && Math.random() < 0.4) {
    newsEvents.push({
      title: "FINANCIAL CRISIS DEEPENS",
      message: "Markets in turmoil as banking sector faces liquidity challenges.",
      impact: { stocks: 0.82, oil: 0.90, gold: 1.18, crypto: 0.75 },
      tip: "During financial crises, diversification and safe havens are crucial."
    });
  }
  
  if (gameMode === 'challenge' && Math.random() < 0.4) {
    newsEvents.push({
      title: "BULL MARKET ACCELERATES",
      message: "Investor confidence soars as markets reach new all-time highs.",
      impact: { stocks: 1.20, oil: 1.15, gold: 0.95, crypto: 1.25 },
      tip: "Bull markets can create excellent trading opportunities, but beware of overextension."
    });
  }
  
  // Check for market crash (low probability random event)
  const crashProbability = difficultySettings[difficulty].marketCrashProbability;
  if (Math.random() < crashProbability) {
    return {
      title: "MARKET CRASH ALERT!",
      message: "Markets are in freefall as panic selling takes hold!",
      impact: { stocks: 0.70, oil: 0.75, gold: 1.15, crypto: 0.65 },
      tip: "Stay calm during crashes. They often present buying opportunities for long-term investors.",
      isCrash: true
    };
  }
  
  // Add flash crash as a rare event (1% chance)
  if (Math.random() < 0.01) {
    return {
      title: "FLASH CRASH IN PROGRESS!",
      message: "Algorithmic trading triggers sudden market plunge. Act fast!",
      impact: { stocks: 0.80, oil: 0.82, gold: 0.85, crypto: 0.70 },
      tip: "Flash crashes typically recover quickly. Consider buying the dip if you're feeling brave.",
      isFlashCrash: true,
      duration: 5 // Only lasts 5 seconds
    };
  }
  
  // Add insider information leak (3% chance)
  if (Math.random() < 0.03) {
    const assets = ['stocks', 'oil', 'gold', 'crypto'];
    const asset = assets[Math.floor(Math.random() * assets.length)];
    
    const impact = {};
    assets.forEach(a => {
      impact[a] = a === asset ? 1.3 : 0.95;
    });
    
    return {
      title: "INSIDER INFORMATION LEAKED!",
      message: `Confidential data suggests ${asset} will surge in the next minute!`,
      impact: impact,
      tip: "Quick action on insider information can be profitable, but timing is everything.",
      isInsiderInfo: true
    };
  }
  
  // Normal news event selection
  const selectedNews = newsEvents[Math.floor(Math.random() * newsEvents.length)];
  return {
    ...selectedNews,
    isCrash: false
  };
};

/**
 * Update market prices based on current conditions
 * @param {Object} assetPrices - Current asset prices 
 * @param {Object} priceHistory - Historical price data
 * @param {Object} assetTrends - Current market trends
 * @param {Object} assetVolatility - Volatility for each asset
 * @param {Object} newsImpact - Impact from news events
 * @param {string} difficulty - Current difficulty level
 * @param {string} gameMode - Current game mode
 * @returns {Object} Updated prices, history, and trends
 */
export const updateMarketPrices = (
  assetPrices,
  priceHistory,
  assetTrends,
  assetVolatility,
  newsImpact = null,
  difficulty,
  gameMode
) => {
  // Create deep copies to avoid mutations
  const updatedPrices = { ...assetPrices };
  const updatedPriceHistory = {};
  Object.keys(priceHistory).forEach(asset => {
    updatedPriceHistory[asset] = [...priceHistory[asset]];
  });
  const updatedTrends = JSON.parse(JSON.stringify(assetTrends));
  
  // Apply difficulty modifier for regular fluctuations
  const difficultyModifier = difficulty === 'easy' ? 0.8 : 
                           difficulty === 'hard' ? 1.3 : 1;
  
  // Apply game mode modifiers
  const modeModifier = {
    stocks: gameMode === 'crisis' ? 0.7 : gameMode === 'challenge' ? 1.3 : 1,
    oil: gameMode === 'crisis' ? 0.8 : gameMode === 'challenge' ? 1.2 : 1,
    gold: gameMode === 'crisis' ? 1.2 : gameMode === 'challenge' ? 0.9 : 1,
    crypto: gameMode === 'crisis' ? 0.6 : gameMode === 'challenge' ? 1.4 : 1
  };
  
  // Process each asset
  Object.keys(updatedPrices).forEach(asset => {
    let changePercent = 0;
    
    // Apply news impact if provided
    if (newsImpact && newsImpact[asset]) {
      changePercent = (newsImpact[asset] - 1) * 100;
      updatedPrices[asset] = Math.round(updatedPrices[asset] * newsImpact[asset]);
      
      // Update trend based on news impact
      if (newsImpact[asset] > 1.1) {
        updatedTrends[asset] = { direction: 'up', strength: 3 };
      } else if (newsImpact[asset] > 1.03) {
        updatedTrends[asset] = { direction: 'up', strength: 2 };
      } else if (newsImpact[asset] > 1.0) {
        updatedTrends[asset] = { direction: 'up', strength: 1 };
      } else if (newsImpact[asset] < 0.9) {
        updatedTrends[asset] = { direction: 'down', strength: 3 };
      } else if (newsImpact[asset] < 0.97) {
        updatedTrends[asset] = { direction: 'down', strength: 2 };
      } else if (newsImpact[asset] < 1.0) {
        updatedTrends[asset] = { direction: 'down', strength: 1 };
      }
    } else {
      // Regular market movement based on volatility and trends
      const baseVolatility = assetVolatility[asset] || 0.08;
      const adjustedVolatility = baseVolatility * difficultyModifier * (modeModifier[asset] || 1);
      
      // Apply existing trend influence (60% influence)
      const trendInfluence = updatedTrends[asset].direction === 'up' ? 0.6 : -0.6;
      const trendStrength = updatedTrends[asset].strength / 3; // Normalize to 0-1
      
      // Random component (-1 to 1)
      const randomComponent = (Math.random() * 2 - 1);
      
      // Combine trend and random factors
      changePercent = (trendInfluence * trendStrength + randomComponent * (1 - trendStrength)) * adjustedVolatility * 100;
      
      // Calculate new price
      const newPrice = updatedPrices[asset] * (1 + changePercent/100);
      updatedPrices[asset] = Math.round(newPrice);
      
      // Occasionally change trend direction (10% chance, influenced by volatility)
      if (Math.random() < 0.1 * adjustedVolatility) {
        // Flip direction
        const newDirection = updatedTrends[asset].direction === 'up' ? 'down' : 'up';
        
        // Update strength (1-3)
        const newStrength = Math.max(1, Math.min(3, 
          updatedTrends[asset].strength + (Math.random() > 0.5 ? 1 : -1)));
        
        updatedTrends[asset] = { direction: newDirection, strength: newStrength };
      }
    }
    
    // Prevent prices from going too low
    updatedPrices[asset] = Math.max(1, updatedPrices[asset]);
    
    // Update price history
    if (updatedPriceHistory[asset]) {
      updatedPriceHistory[asset].push(updatedPrices[asset]);
      
      // Keep history at a reasonable length (last 50 points)
      if (updatedPriceHistory[asset].length > 50) {
        updatedPriceHistory[asset] = updatedPriceHistory[asset].slice(-50);
      }
    } else {
      // Initialize history if it doesn't exist
      updatedPriceHistory[asset] = [updatedPrices[asset]];
    }
  });
  
  return {
    updatedPrices,
    updatedPriceHistory,
    updatedTrends
  };
};

/**
 * Generate a market opportunity for special events
 * @returns {Object} Market opportunity object
 */
export const generateMarketOpportunity = () => {
  const opportunityTypes = [
    {
      type: 'double',
      title: 'Double or nothing!',
      description: 'Take a chance for big gains, but beware of potential losses...',
      actionText: 'DOUBLE OR NOTHING',
      asset: 'crypto',
      risk: 'high'
    },
    {
      type: 'insider',
      title: 'Insider Tip',
      description: 'Reliable source says oil prices are about to surge.',
      actionText: 'BUY OIL NOW',
      asset: 'oil',
      risk: 'medium'
    },
    {
      type: 'short_squeeze',
      title: 'Short Squeeze Potential',
      description: 'Gold shorts are overcrowded. Potential for a squeeze!',
      actionText: 'BUY GOLD',
      asset: 'gold',
      risk: 'medium'
    },
    {
      type: 'flash_sale',
      title: 'Flash Sale!',
      description: 'Limited time discount on tech stocks. Buy now!',
      actionText: 'BUY DISCOUNTED STOCKS',
      asset: 'stocks',
      risk: 'low'
    },
    {
      type: 'margin_call',
      title: 'Margin Call Warning',
      description: 'Large funds facing liquidation. Market volatility ahead!',
      actionText: 'MOVE TO GOLD',
      asset: 'gold',
      risk: 'high'
    }
  ];
  
  return opportunityTypes[Math.floor(Math.random() * opportunityTypes.length)];
};
