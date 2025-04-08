// Market simulation and news generation logic

// Generate a news event
export const generateNewsEvent = (gameMode, difficulty, difficultySettings) => {
  const newsEvents = [
    {
      title: "COMPANY X REPORTS STRONG EARNINGS!",
      message: "Tech stocks jump after better-than-expected quarterly earnings.",
      impact: { stocks: 1.15, oil: 0.98, gold: 0.98, crypto: 1.05 }
    },
    {
      title: "INTEREST RATES INCREASE!",
      message: "The central bank has increased interest rates by 0.5%.",
      impact: { stocks: 0.92, oil: 0.95, gold: 1.03, crypto: 0.88 }
    },
    {
      title: "CRYPTOCURRENCY REGULATION ANNOUNCED",
      message: "Government announces new cryptocurrency regulations.",
      impact: { stocks: 1.01, oil: 1.0, gold: 1.05, crypto: 0.78 }
    },
    {
      title: "GOLD RESERVES DISCOVERED",
      message: "Large gold reserves discovered in remote region.",
      impact: { stocks: 1.03, oil: 0.99, gold: 0.85, crypto: 1.02 }
    },
    {
      title: "NEW SMARTPHONE MODEL IS A HIT!",
      message: "The latest smartphone release has broken sales records.",
      impact: { stocks: 1.12, oil: 1.02, gold: 0.97, crypto: 1.04 }
    },
    {
      title: "GLOBAL ECONOMIC UNCERTAINTY RISES",
      message: "Geopolitical tensions are causing uncertainty in global markets.",
      impact: { stocks: 0.93, oil: 1.15, gold: 1.12, crypto: 0.95 }
    },
    {
      title: "TECH COMPANY ANNOUNCES LAYOFFS",
      message: "Major tech company announces significant workforce reduction.",
      impact: { stocks: 1.06, oil: 1.02, gold: 1.01, crypto: 0.97 }
    },
    {
      title: "HOUSING MARKET COOLING DOWN",
      message: "Real estate prices show signs of stabilizing after years of growth.",
      impact: { stocks: 0.98, oil: 0.97, gold: 1.02, crypto: 0.99 }
    },
    {
      title: "OIL SUPPLY DISRUPTION",
      message: "Major oil-producing region faces production challenges.",
      impact: { stocks: 0.96, oil: 1.25, gold: 1.05, crypto: 0.98 }
    },
    {
      title: "SEC CRACKS DOWN ON CRYPTO EXCHANGES",
      message: "Regulatory action targets crypto trading platforms.",
      impact: { stocks: 1.01, oil: 1.0, gold: 1.03, crypto: 0.75 }
    },
    {
      title: "TECH BREAKTHROUGH ANNOUNCED",
      message: "Revolutionary technology could transform multiple industries.",
      impact: { stocks: 1.18, oil: 0.92, gold: 0.96, crypto: 1.15 }
    },
    {
      title: "INFLATION DATA HIGHER THAN EXPECTED",
      message: "Consumer prices rise faster than analyst projections.",
      impact: { stocks: 0.94, oil: 1.08, gold: 1.10, crypto: 0.97 }
    }
  ];
  
  // Special events based on game mode
  if (gameMode === 'crisis' && Math.random() < 0.4) {
    newsEvents.push({
      title: "FINANCIAL CRISIS DEEPENS",
      message: "Markets in turmoil as banking sector faces liquidity challenges.",
      impact: { stocks: 0.82, oil: 0.90, gold: 1.18, crypto: 0.75 }
    });
  }
  
  if (gameMode === 'challenge' && Math.random() < 0.4) {
    newsEvents.push({
      title: "BULL MARKET ACCELERATES",
      message: "Investor confidence soars as markets reach new all-time highs.",
      impact: { stocks: 1.20, oil: 1.15, gold: 0.95, crypto: 1.25 }
    });
  }
  
  // Check for market crash (low probability random event)
  const crashProbability = difficultySettings[difficulty].marketCrashProbability;
  if (Math.random() < crashProbability) {
    return {
      title: "MARKET CRASH ALERT!",
      message: "Markets are in freefall as panic selling takes hold!",
      impact: { stocks: 0.70, oil: 0.75, gold: 1.15, crypto: 0.65 },
      isCrash: true
    };
  }
  
  // Add flash crash as a rare event (1% chance)
  if (Math.random() < 0.01) {
    return {
      title: "FLASH CRASH IN PROGRESS!",
      message: "Algorithmic trading triggers sudden market plunge. Act fast!",
      impact: { stocks: 0.80, oil: 0.82, gold: 0.85, crypto: 0.70 },
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
      isInsiderInfo: true
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
  newsImpact = null,
  difficulty,
  gameMode
) => {
  // Create updated prices
  const updatedPrices = { ...assetPrices };
  
  // Make sure we have all required assets
  if (!updatedPrices.oil) updatedPrices.oil = 65;
  
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
  
  // Define volatility for each asset
  const assetVolatility = {
    stocks: 0.08,
    oil: 0.10,
    gold: 0.05,
    crypto: 0.15
  };
  
  // Process each asset
  Object.keys(updatedPrices).forEach(asset => {
    let changePercent = 0;
    
    // Apply news impact if provided
    if (newsImpact && newsImpact[asset]) {
      changePercent = (newsImpact[asset] - 1) * 100;
      updatedPrices[asset] = Math.round(updatedPrices[asset] * newsImpact[asset]);
    } else {
      // Regular market movement based on volatility
      const baseVolatility = assetVolatility[asset] || 0.08;
      const adjustedVolatility = baseVolatility * difficultyModifier * (modeModifier[asset] || 1);
      
      // Random price movement (-volatility to +volatility)
      changePercent = (Math.random() * 2 - 1) * adjustedVolatility * 100;
      
      // Add some momentum (prices tend to continue in same direction)
      // 60% chance price continues in same direction as last change
      if (Math.random() < 0.6) {
        const lastChange = changePercent >= 0 ? 1 : -1;
        const momentum = Math.random() * adjustedVolatility * 50 * lastChange;
        changePercent += momentum;
      }
      
      // Calculate new price
      const newPrice = updatedPrices[asset] * (1 + changePercent/100);
      updatedPrices[asset] = Math.round(newPrice);
    }
    
    // Prevent prices from going too low
    updatedPrices[asset] = Math.max(1, updatedPrices[asset]);
  });
  
  return {
    updatedPrices
  };
};

// Generate a market opportunity
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

// Generate dramatic market events
export const generateDramaticEvent = () => {
  const events = [
    {
      type: 'flash_crash',
      title: 'FLASH CRASH',
      description: 'All asset prices are plunging for the next 5 seconds!',
      duration: 5,
      impact: { stocks: 0.8, oil: 0.82, gold: 0.9, crypto: 0.75 }
    },
    {
      type: 'bull_run',
      title: 'SUDDEN BULL RUN',
      description: 'Markets surging across the board! Quick gains possible.',
      duration: 8,
      impact: { stocks: 1.15, oil: 1.12, gold: 1.08, crypto: 1.25 }
    },
    {
      type: 'liquidity_crisis',
      title: 'LIQUIDITY CRISIS',
      description: 'Trading volumes dropping. Wide bid-ask spreads!',
      duration: 12,
      effect: 'increased_spreads'
    },
    {
      type: 'regulatory_action',
      title: 'SURPRISE REGULATION',
      description: 'New financial regulations announced. Market uncertainty!',
      duration: 10,
      impact: { stocks: 0.92, oil: 0.95, gold: 1.05, crypto: 0.7 }
    },
    {
      type: 'market_manipulation',
      title: 'MARKET MANIPULATION DETECTED',
      description: 'Unusual trading patterns detected. Extreme volatility ahead!',
      duration: 15,
      effect: 'increased_volatility'
    }
  ];
  
  return events[Math.floor(Math.random() * events.length)];
};