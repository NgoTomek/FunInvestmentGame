 /**
 * Portfolio management utility functions
 */

/**
 * Buy an asset with fractional support
 * @param {Object} portfolio - Current portfolio
 * @param {Object} assetData - Asset quantities and positions
 * @param {Object} assetPrices - Current asset prices
 * @param {string} asset - Asset to buy
 * @param {number|string} amount - Amount to buy (can be percentage of cash or 'double')
 * @returns {Object} Updated portfolio and asset data
 */
export const buyAsset = (portfolio, assetData, assetPrices, asset, amount) => {
    // Clone current data to avoid mutations
    const updatedPortfolio = { ...portfolio };
    const updatedAssetData = { 
      quantities: { ...assetData.quantities },
      dollarValues: { ...assetData.dollarValues },
      shorts: { ...assetData.shorts }
    };
    
    let cashToSpend = 0;
    
    // Calculate amount to spend based on input type
    if (amount === 'double') {
      // Double Down: Invest the same amount already invested, or 50% of cash if none
      const currentValue = updatedAssetData.dollarValues[asset] || 0;
      cashToSpend = currentValue > 0 ? currentValue : updatedPortfolio.cash * 0.5;
    } else if (amount <= 1) {
      // Percentage of cash (0.25 = 25% of available cash)
      cashToSpend = updatedPortfolio.cash * amount;
    } else {
      // Specific dollar amount
      cashToSpend = amount;
    }
    
    // Don't spend more than available cash
    cashToSpend = Math.min(cashToSpend, updatedPortfolio.cash);
    
    if (cashToSpend <= 0) return { portfolio: updatedPortfolio, assetData: updatedAssetData };
    
    // Calculate fractional quantity based on current price
    const additionalQuantity = cashToSpend / assetPrices[asset];
    
    // Update asset quantities and dollar values
    updatedAssetData.quantities[asset] = (updatedAssetData.quantities[asset] || 0) + additionalQuantity;
    updatedAssetData.dollarValues[asset] = (updatedAssetData.dollarValues[asset] || 0) + cashToSpend;
    
    // Deduct from cash
    updatedPortfolio.cash -= cashToSpend;
    
    return {
      portfolio: updatedPortfolio,
      assetData: updatedAssetData
    };
  };
  
  /**
   * Sell an asset with fractional support
   * @param {Object} portfolio - Current portfolio
   * @param {Object} assetData - Asset quantities and positions
   * @param {Object} assetPrices - Current asset prices
   * @param {string} asset - Asset to sell
   * @param {number} amount - Percentage to sell (0.5 = sell 50% of holdings)
   * @returns {Object} Updated portfolio and asset data
   */
  export const sellAsset = (portfolio, assetData, assetPrices, asset, amount) => {
    // Clone current data to avoid mutations
    const updatedPortfolio = { ...portfolio };
    const updatedAssetData = { 
      quantities: { ...assetData.quantities },
      dollarValues: { ...assetData.dollarValues },
      shorts: { ...assetData.shorts }
    };
    
    // Get current quantity and value
    const currentQuantity = updatedAssetData.quantities[asset] || 0;
    
    // Calculate quantity to sell
    const quantityToSell = currentQuantity * amount;
    
    if (quantityToSell <= 0) return { portfolio: updatedPortfolio, assetData: updatedAssetData };
    
    // Calculate sale value
    const saleValue = quantityToSell * assetPrices[asset];
    
    // Update asset quantities and values
    updatedAssetData.quantities[asset] = currentQuantity - quantityToSell;
    
    // Update dollar value proportionally
    const currentDollarValue = updatedAssetData.dollarValues[asset] || 0;
    updatedAssetData.dollarValues[asset] = currentDollarValue * (1 - amount);
    
    // Add to cash
    updatedPortfolio.cash += saleValue;
    
    return {
      portfolio: updatedPortfolio,
      assetData: updatedAssetData
    };
  };
  
  /**
   * Create a short position for an asset
   * @param {Object} portfolio - Current portfolio
   * @param {Object} assetData - Asset quantities and positions
   * @param {Object} assetPrices - Current asset prices
   * @param {string} asset - Asset to short
   * @param {number} amount - Percentage of cash to allocate to the short (0.25 = 25% of cash)
   * @returns {Object} Updated portfolio and asset data
   */
  export const shortAsset = (portfolio, assetData, assetPrices, asset, amount) => {
    // Clone current data to avoid mutations
    const updatedPortfolio = { ...portfolio };
    const updatedAssetData = { 
      quantities: { ...assetData.quantities },
      dollarValues: { ...assetData.dollarValues },
      shorts: { ...assetData.shorts }
    };
    
    // Calculate cash amount to allocate to short
    const cashAmount = updatedPortfolio.cash * amount;
    
    if (cashAmount <= 0) return { portfolio: updatedPortfolio, assetData: updatedAssetData };
    
    // Create or update short position
    updatedAssetData.shorts[asset] = {
      value: cashAmount,
      price: assetPrices[asset], // Entry price
      active: true
    };
    
    // Reserve cash for the short
    updatedPortfolio.cash -= cashAmount;
    
    return {
      portfolio: updatedPortfolio,
      assetData: updatedAssetData
    };
  };
  
  /**
   * Close a short position
   * @param {Object} portfolio - Current portfolio
   * @param {Object} assetData - Asset quantities and positions
   * @param {Object} assetPrices - Current asset prices
   * @param {string} asset - Asset to close short position
   * @returns {Object} Updated portfolio and asset data
   */
  export const closeShort = (portfolio, assetData, assetPrices, asset) => {
    // Clone current data to avoid mutations
    const updatedPortfolio = { ...portfolio };
    const updatedAssetData = { 
      quantities: { ...assetData.quantities },
      dollarValues: { ...assetData.dollarValues },
      shorts: { ...assetData.shorts }
    };
    
    // Check if there's an active short position
    if (!updatedAssetData.shorts[asset]?.active) {
      return { portfolio: updatedPortfolio, assetData: updatedAssetData };
    }
    
    const shortPosition = updatedAssetData.shorts[asset];
    const entryPrice = shortPosition.price;
    const currentPrice = assetPrices[asset];
    const value = shortPosition.value;
    
    // Calculate profit/loss (percent change in price * short value)
    // Price decreases = profit, price increases = loss
    const priceChange = (entryPrice - currentPrice) / entryPrice;
    const profitLoss = value * priceChange * 2; // 2x leverage on shorts
    
    // Return original value plus profit/loss
    updatedPortfolio.cash += value + profitLoss;
    
    // Clear the short position
    updatedAssetData.shorts[asset] = {
      value: 0,
      price: 0,
      active: false
    };
    
    return {
      portfolio: updatedPortfolio,
      assetData: updatedAssetData
    };
  };
  
  /**
   * Apply auto-rebalancing to portfolio
   * @param {Object} portfolio - Current portfolio
   * @param {Object} assetData - Asset quantities and positions
   * @param {Object} assetPrices - Current asset prices
   * @param {Object} targetAllocation - Target allocation percentages
   * @returns {Object} Updated portfolio and asset data
   */
  export const rebalancePortfolio = (portfolio, assetData, assetPrices, targetAllocation) => {
    // Clone current data
    const updatedPortfolio = { ...portfolio };
    const updatedAssetData = { 
      quantities: { ...assetData.quantities },
      dollarValues: { ...assetData.dollarValues },
      shorts: { ...assetData.shorts }
    };
    
    // Calculate total portfolio value
    const totalValue = calculatePortfolioValue(updatedPortfolio, updatedAssetData, assetPrices);
    
    // Sell all assets first to get cash
    Object.keys(updatedAssetData.quantities).forEach(asset => {
      if (updatedAssetData.quantities[asset] > 0) {
        const result = sellAsset(updatedPortfolio, updatedAssetData, assetPrices, asset, 1);
        updatedPortfolio.cash = result.portfolio.cash;
        updatedAssetData.quantities[asset] = 0;
        updatedAssetData.dollarValues[asset] = 0;
      }
    });
    
    // Close all short positions
    Object.keys(updatedAssetData.shorts).forEach(asset => {
      if (updatedAssetData.shorts[asset]?.active) {
        const result = closeShort(updatedPortfolio, updatedAssetData, assetPrices, asset);
        updatedPortfolio.cash = result.portfolio.cash;
        updatedAssetData.shorts[asset] = { value: 0, price: 0, active: false };
      }
    });
    
    // Now allocate according to target percentages
    Object.entries(targetAllocation).forEach(([asset, percentage]) => {
      if (percentage > 0) {
        const targetValue = totalValue * percentage;
        const amountToInvest = Math.min(targetValue, updatedPortfolio.cash);
        
        // Skip if the amount is too small
        if (amountToInvest < 1) return;
        
        const result = buyAsset(updatedPortfolio, updatedAssetData, assetPrices, asset, amountToInvest);
        updatedPortfolio.cash = result.portfolio.cash;
        updatedAssetData.quantities[asset] = result.assetData.quantities[asset];
        updatedAssetData.dollarValues[asset] = result.assetData.dollarValues[asset];
      }
    });
    
    return {
      portfolio: updatedPortfolio,
      assetData: updatedAssetData
    };
  };
  
  /**
   * Calculate total portfolio value
   * @param {Object} portfolio - Current portfolio
   * @param {Object} assetData - Asset quantities and positions
   * @param {Object} assetPrices - Current asset prices
   * @returns {number} Total portfolio value
   */
  export const calculatePortfolioValue = (portfolio, assetData, assetPrices) => {
    let total = portfolio.cash;
    
    // Add value of all owned assets
    Object.entries(assetData.quantities).forEach(([asset, quantity]) => {
      if (quantity > 0 && assetPrices[asset]) {
        total += quantity * assetPrices[asset];
      }
    });
    
    // Add value of short positions (including potential profit/loss)
    Object.entries(assetData.shorts).forEach(([asset, position]) => {
      if (position.active && assetPrices[asset]) {
        const entryPrice = position.price;
        const currentPrice = assetPrices[asset];
        const value = position.value;
        
        // Calculate profit/loss
        const priceChange = (entryPrice - currentPrice) / entryPrice;
        const profitLoss = value * priceChange * 2; // 2x leverage on shorts
        
        total += value + profitLoss;
      }
    });
    
    return total;
  };