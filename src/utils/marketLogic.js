// Market simulation and news generation logic

// Generate a news event
export const generateNewsEvent = (gameMode, difficulty, difficultySettings) => {
  const newsEvents = [
    {
      title: "COMPANY X REPORTS STRONG EARNINGS!",
      message: "The stock price of Company X jumps after they announce better-than-expected quarterly earnings.",
      tip: "Positive news will usually cause a stock to rise.",
      impact: { stocks: 1.15, gold: 0.98, crypto: 1.05, bonds: 0.97 }
    },
    {
      title: "INTEREST RATES INCREASE!",
      message: "The central bank has increased interest rates by 0.5%.",
      tip: "Higher interest rates often hurt stocks but can help bonds.",
      impact: { stocks: 0.92, gold: 1.03, crypto: 0.88, bonds: 1.08 }
    },
    {
      title: "CRYPTOCURRENCY REGULATION ANNOUNCED",
      message: "Government announces new cryptocurrency regulations.",
      tip: "Regulations can cause short-term volatility in crypto markets.",
      impact: { stocks: 1.01, gold: 1.05, crypto: 0.78, bonds: 1.02 }
    },
    {
      title: "GOLD RESERVES DISCOVERED",
      message: "Large gold reserves discovered in remote region.",
      tip: "Increased supply can lower gold prices temporarily.",
      impact: { stocks: 1.03, gold: 0.85, crypto: 1.02, bonds: 0.99 }
    },
    {
      title: "NEW SMARTPHONE MODEL IS A HIT!",
      message: "The latest smartphone release has broken sales records.",
      tip: "Successful tech products often boost the stock market.",
      impact: { stocks: 1.12, gold: 0.97, crypto: 1.04, bonds: 0.98 }
    },
    {
      title: "GLOBAL ECONOMIC UNCERTAINTY RISES",
      message: "Geopolitical tensions are causing uncertainty in global markets.",
      tip: "Uncertainty often drives investors to safe-haven assets like gold.",
      impact: { stocks: 0.93, gold: 1.12, crypto: 0.95, bonds: 1.04 }
    },
    {
      title: "TECH COMPANY ANNOUNCES LAYOFFS",
      message: "Major tech company announces significant workforce reduction.",
      tip: "Cost-cutting can sometimes boost stock prices in the short term.",
      impact: { stocks: 1.06, gold: 1.01, crypto: 0.97, bonds: 1.01 }
    },
    {
      title: "HOUSING MARKET COOLING DOWN",
      message: "Real estate prices show signs of stabilizing after years of growth.",
      tip: "A cooling housing market can affect various asset classes differently.",
      impact: { stocks: 0.98, gold: 1.02, crypto: 0.99, bonds: 1.03 }
    }
  ];
  
  // Special events based on game mode
  if (gameMode === 'crisis' && Math.random() < 0.4) {
    newsEvents.push({
      title: "FINANCIAL CRISIS DEEPENS",
      message: "Markets in turmoil as banking sector faces liquidity challenges.",
      tip: "During financial crises, diversification can help protect your portfolio.",
      impact: { stocks: 0.82, gold: 1.18, crypto: 0.75, bonds: 0.92 }
    });
  }
  
  if (gameMode === 'challenge' && Math.random() < 0.4) {
    newsEvents.push({
      title: "BULL MARKET ACCELERATES",
      message: "Investor confidence soars as markets reach new all-time highs.",
      tip: "Bull markets can create opportunities, but be wary of overvaluation.",
      impact: { stocks: 1.20, gold: 0.95, crypto: 1.25, bonds: 0.92 }
    });
  }
  
  // Check for market crash (low probability random event)
  const crashProbability = difficultySettings[difficulty].marketCrashProbability;
  if (Math.random() < crashProbability) {
    return {
      title: "MARKET CRASH ALERT!",
      message: "Markets are in freefall as panic selling takes hold!",
      tip: "Market crashes can present buying opportunities for the patient investor.",
      impact: { stocks: 0.70, gold: 1.15, crypto: 0.65, bonds: 0.85 },
      isCrash: true
    };
  }
  
  // Normal news event selection
  return {
    ...newsEvents[Math.floor(Math.random() * newsEvents.length)],
    isCrash: false
  };
};

// Update market prices based on trends, news impacts and other factors
export const updateMarketPrices = (
  assetPrices,
  priceHistory,
  assetTrends,
  assetVolatility,
  newsImpact = null,
  difficulty,
  gameMode
) => {
  // Create updated prices
  const updatedPrices = { ...assetPrices };
  const updatedPriceHistory = { ...priceHistory };
  const updatedTrends = { ...assetTrends };
  
  // Apply difficulty modifier for regular fluctuations
  const difficultyModifier = difficulty === 'easy' ? 0.8 : 
                           difficulty === 'hard' ? 1.3 : 1;
  
  // Apply game mode modifiers
  const modeModifier = {
    stocks: gameMode === 'crisis' ? 0.7 : gameMode === 'challenge' ? 1.3 : 1,
    gold: gameMode === 'crisis' ? 1.2 : gameMode === 'challenge' ? 0.9 : 1,
    crypto: gameMode === 'crisis' ? 0.6 : gameMode === 'challenge' ? 1.4 : 1,
    bonds: gameMode === 'crisis' ? 0.8 : gameMode === 'challenge' ? 1.1 : 1
  };
  
  // Process each asset
  Object.keys(updatedPrices).forEach(asset => {
    let changePercent = 0;
    
    // Apply news impact if provided
    if (newsImpact) {
      changePercent = (newsImpact[asset] - 1) * 100;
      updatedPrices[asset] = Math.round(updatedPrices[asset] * newsImpact[asset]);
      
      // Update trend based on news impact
      if (newsImpact[asset] > 1.02) {
        updatedTrends[asset] = { direction: 'up', strength: Math.min(3, Math.ceil((newsImpact[asset] - 1) * 20)) };
      } else if (newsImpact[asset] < 0.98) {
        updatedTrends[asset] = { direction: 'down', strength: Math.min(3, Math.ceil((1 - newsImpact[asset]) * 20)) };
      } else {
        // Small change - maintain current trend but with lower strength
        updatedTrends[asset] = { 
          direction: updatedTrends[asset].direction, 
          strength: Math.max(1, updatedTrends[asset].strength - 1) 
        };
      }
    } else {
      // Regular market movement based on trends and volatility
      const trendDirection = updatedTrends[asset].direction === 'up' ? 1 : -1;
      const trendStrength = updatedTrends[asset].strength;
      
      // Base change calculation with modifiers
      const baseChange = trendDirection * trendStrength * assetVolatility[asset] * 100 * difficultyModifier * modeModifier[asset];
      
      // Add random noise to price movement
      const noise = (Math.random() - 0.5) * assetVolatility[asset] * 100 * difficultyModifier;
      changePercent = baseChange + noise;
      
      // Calculate new price with realistic constraints
      const newPrice = updatedPrices[asset] * (1 + changePercent/100);
      updatedPrices[asset] = Math.round(newPrice);
      
      // Small chance to reverse trend (more likely for more volatile assets)
      const reversalChance = 0.10 + (assetVolatility[asset] * 0.5); 
      if (Math.random() < reversalChance) {
        updatedTrends[asset] = { 
          direction: updatedTrends[asset].direction === 'up' ? 'down' : 'up',
          strength: Math.floor(Math.random() * 3) + 1
        };
      }
      
      // Small chance to increase/decrease trend strength
      if (Math.random() < 0.3) {
        const strengthChange = Math.random() < 0.5 ? 1 : -1;
        const newStrength = updatedTrends[asset].strength + strengthChange;
        if (newStrength >= 1 && newStrength <= 3) {
          updatedTrends[asset].strength = newStrength;
        }
      }
    }
    
    // Prevent prices from going too low
    updatedPrices[asset] = Math.max(1, updatedPrices[asset]);
    
    // Update price history
    updatedPriceHistory[asset] = [...updatedPriceHistory[asset], updatedPrices[asset]];
    if (updatedPriceHistory[asset].length > 10) {
      updatedPriceHistory[asset].shift();
    }
  });
  
  return {
    updatedPrices,
    updatedPriceHistory,
    updatedTrends
  };
};
