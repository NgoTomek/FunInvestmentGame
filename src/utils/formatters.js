// Formatting utility functions for currency, numbers, and dates

/**
 * Format a number as currency
 * @param {number} value - The number to format
 * @param {boolean} showCents - Whether to show cents
 * @returns {string} - Formatted currency string
 */
export const formatCurrency = (value, showCents = false) => {
    if (value === undefined || value === null) return '$0';
    
    // Round to 2 decimal places
    const roundedValue = Math.round(value * 100) / 100;
    
    // Format with dollar sign and commas
    return showCents 
      ? '$' + roundedValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
      : '$' + Math.round(value).toLocaleString();
  };
  
  /**
   * Format a number as a percentage
   * @param {number} value - The decimal value to format (e.g., 0.15 for 15%)
   * @param {number} decimals - Number of decimal places to show
   * @returns {string} - Formatted percentage string
   */
  export const formatPercentage = (value, decimals = 1) => {
    if (value === undefined || value === null) return '0%';
    
    // Convert to percentage and round
    const percentage = value * 100;
    return percentage.toFixed(decimals) + '%';
  };
  
  /**
   * Format a timestamp as a date string
   * @param {number|string|Date} timestamp - The timestamp to format
   * @returns {string} - Formatted date string
   */
  export const formatDate = (timestamp) => {
    if (!timestamp) return '';
    
    const date = new Date(timestamp);
    return date.toLocaleDateString();
  };
  
  /**
   * Format a time in seconds as mm:ss
   * @param {number} seconds - Number of seconds
   * @returns {string} - Formatted time string
   */
  export const formatTime = (seconds) => {
    if (seconds === undefined || seconds === null) return '0:00';
    
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  /**
   * Format a large number with k/m/b suffixes
   * @param {number} value - The number to format
   * @returns {string} - Formatted number with suffix
   */
  export const formatCompactNumber = (value) => {
    if (value === undefined || value === null) return '0';
    
    if (value >= 1000000000) {
      return (value / 1000000000).toFixed(1) + 'B';
    }
    if (value >= 1000000) {
      return (value / 1000000).toFixed(1) + 'M';
    }
    if (value >= 1000) {
      return (value / 1000).toFixed(1) + 'K';
    }
    
    return value.toString();
  };
  
  /**
   * Format a number with a + sign if positive
   * @param {number} value - The number to format
   * @param {number} decimals - Number of decimal places
   * @returns {string} - Formatted number with sign
   */
  export const formatWithSign = (value, decimals = 1) => {
    if (value === undefined || value === null) return '0';
    
    const formatted = value.toFixed(decimals);
    return value > 0 ? '+' + formatted : formatted;
  };