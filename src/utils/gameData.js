// Game constants and configuration

// Difficulty settings
export const DIFFICULTY_SETTINGS = {
    easy: { 
      startingCash: 12000, 
      updateInterval: 12, 
      volatilityMultiplier: 0.7, 
      marketCrashProbability: 0.05,
      rounds: 4
    },
    normal: { 
      startingCash: 10000, 
      updateInterval: 10, 
      volatilityMultiplier: 1.0, 
      marketCrashProbability: 0.1,
      rounds: 5
    },
    hard: { 
      startingCash: 8000, 
      updateInterval: 8, 
      volatilityMultiplier: 1.5, 
      marketCrashProbability: 0.15,
      rounds: 6
    }
  };
  
  // Game mode settings
  export const GAME_MODE_SETTINGS = {
    standard: {
      name: "Standard Mode",
      description: "React to market news and build your portfolio",
      marketCondition: "normal",
      startingTrends: {
        stocks: { direction: 'up', strength: 1 },
        gold: { direction: 'up', strength: 1 },
        crypto: { direction: 'up', strength: 1 },
        bonds: { direction: 'down', strength: 1 }
      }
    },
    crisis: {
      name: "Financial Crisis",
      description: "Survive a financial meltdown and try to keep your investments safe",
      marketCondition: "bearish",
      startingTrends: {
        stocks: { direction: 'down', strength: 2 },
        gold: { direction: 'up', strength: 2 },
        crypto: { direction: 'down', strength: 3 },
        bonds: { direction: 'down', strength: 1 }
      }
    },
    challenge: {
      name: "Bull Run Challenge",
      description: "Maximize returns during a strong bull market with extreme volatility",
      marketCondition: "bullish",
      startingTrends: {
        stocks: { direction: 'up', strength: 2 },
        gold: { direction: 'down', strength: 1 },
        crypto: { direction: 'up', strength: 3 },
        bonds: { direction: 'up', strength: 1 }
      }
    }
  };
  
  // Initial asset prices
  export const INITIAL_ASSET_PRICES = {
    stocks: 240,
    gold: 1850,
    crypto: 29200,
    bonds: 980
  };
  
  // Asset information
  export const ASSET_INFO = {
    stocks: {
      name: "Stocks",
      description: "Shares of companies traded on stock exchanges",
      riskLevel: "Medium",
      shortDescription: "Moderate risk, moderate returns",
      volatility: "Medium",
      details: [
        "Influenced by company performance, economic conditions, and market sentiment",
        "Can provide capital appreciation and dividend income",
        "Recommended for medium to long-term investments"
      ],
      strategies: [
        "Buy during market dips if you believe in the long-term prospects",
        "Sell when stocks become overvalued or when negative company news emerges",
        "Hold through temporary market fluctuations if your investment thesis remains valid"
      ]
    },
    bonds: {
      name: "Bonds",
      description: "Debt securities issued by governments or corporations",
      riskLevel: "Low",
      shortDescription: "Low risk, stable returns",
      volatility: "Low",
      details: [
        "Provides fixed interest payments (coupons) and return of principal at maturity",
        "Generally less volatile than stocks but offers lower potential returns",
        "Prices typically move inversely to interest rates"
      ],
      strategies: [
        "Buy when interest rates are expected to fall to benefit from price appreciation",
        "Sell when interest rates are expected to rise to avoid price depreciation",
        "Hold during market turbulence as a safe haven asset"
      ]
    },
    gold: {
      name: "Gold",
      description: "Precious metal used as a store of value",
      riskLevel: "Low-Medium",
      shortDescription: "Safe haven asset",
      volatility: "Medium",
      details: [
        "Traditional safe haven asset during economic uncertainty",
        "Hedge against inflation and currency devaluation",
        "Limited industrial applications compared to other commodities"
      ],
      strategies: [
        "Buy during economic uncertainty, geopolitical tensions, or inflationary environments",
        "Sell during strong economic growth periods when other assets typically outperform",
        "Hold as a portfolio diversifier regardless of market conditions"
      ]
    },
    crypto: {
      name: "Cryptocurrency",
      description: "Digital or virtual currency secured by cryptography",
      riskLevel: "High",
      shortDescription: "High risk, high potential returns",
      volatility: "Very High",
      details: [
        "Highly volatile with potential for significant gains or losses",
        "Influenced by regulatory news, technology developments, and market sentiment",
        "Becoming more mainstream but still considered a speculative investment"
      ],
      strategies: [
        "Buy when you believe in the underlying technology and adoption is increasing",
        "Sell when regulatory concerns arise or during extreme price surges",
        "Hold only what you can afford to lose due to the high volatility"
      ]
    }
  };
  
  // Achievement definitions
  export const ACHIEVEMENTS = {
    firstProfit: { 
      unlocked: false, 
      title: "First Profit", 
      description: "Make your first profitable trade",
      icon: "dollar-sign"
    },
    riskTaker: { 
      unlocked: false, 
      title: "Risk Taker", 
      description: "Invest over 50% in crypto",
      icon: "zap"
    },
    diversified: { 
      unlocked: false, 
      title: "Diversified Portfolio", 
      description: "Own all available assets",
      icon: "pie-chart"
    },
    goldHoarder: { 
      unlocked: false, 
      title: "Gold Hoarder", 
      description: "Accumulate 5 units of gold",
      icon: "circle"
    },
    marketCrash: { 
      unlocked: false, 
      title: "Crash Survivor", 
      description: "End with profit despite a market crash",
      icon: "trending-up"
    },
    tenPercent: { 
      unlocked: false, 
      title: "Double Digits", 
      description: "Achieve a 10% return",
      icon: "award"
    },
    wealthyInvestor: { 
      unlocked: false, 
      title: "Wealthy Investor", 
      description: "Reach a portfolio value of $15,000",
      icon: "briefcase"
    },
    perfectTiming: { 
      unlocked: false, 
      title: "Perfect Timing", 
      description: "Buy an asset just before a major price increase",
      icon: "clock"
    },
    dayTrader: { 
      unlocked: false, 
      title: "Day Trader", 
      description: "Execute 10 trades in a single round",
      icon: "repeat"
    },
    bondKing: { 
      unlocked: false, 
      title: "Bond King", 
      description: "Earn 5% return from bonds only",
      icon: "shield"
    }
  };