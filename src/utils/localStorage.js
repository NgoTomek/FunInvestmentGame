// Local storage utility functions for saving and loading game state

const STORAGE_KEY = 'portfolio_panic_data';

/**
 * Save game state to localStorage
 * @param {Object} gameState - The game state to save
 */
export const saveGameState = (gameState) => {
  try {
    const serializedState = JSON.stringify(gameState);
    localStorage.setItem(STORAGE_KEY, serializedState);
    return true;
  } catch (error) {
    console.error('Error saving game state:', error);
    return false;
  }
};

/**
 * Load game state from localStorage
 * @returns {Object|null} - The loaded game state or null if not found
 */
export const loadGameState = () => {
  try {
    const serializedState = localStorage.getItem(STORAGE_KEY);
    if (serializedState === null) {
      return null;
    }
    return JSON.parse(serializedState);
  } catch (error) {
    console.error('Error loading game state:', error);
    return null;
  }
};

/**
 * Clear saved game state from localStorage
 */
export const clearGameState = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
    return true;
  } catch (error) {
    console.error('Error clearing game state:', error);
    return false;
  }
};

/**
 * Save high score to localStorage
 * @param {Object} score - The score object to save
 */
export const saveHighScore = (score) => {
  try {
    // Get existing high scores
    const highScores = loadHighScores() || [];
    
    // Add new score
    highScores.push({
      ...score,
      date: new Date().toISOString()
    });
    
    // Sort by return percentage (highest first)
    highScores.sort((a, b) => b.returnPercentage - a.returnPercentage);
    
    // Keep only top 10
    const topScores = highScores.slice(0, 10);
    
    // Save to localStorage
    localStorage.setItem('portfolio_panic_highscores', JSON.stringify(topScores));
    return true;
  } catch (error) {
    console.error('Error saving high score:', error);
    return false;
  }
};

/**
 * Load high scores from localStorage
 * @returns {Array|null} - The loaded high scores or null if not found
 */
export const loadHighScores = () => {
  try {
    const serializedScores = localStorage.getItem('portfolio_panic_highscores');
    if (serializedScores === null) {
      return [];
    }
    return JSON.parse(serializedScores);
  } catch (error) {
    console.error('Error loading high scores:', error);
    return [];
  }
};

/**
 * Save completed achievements to localStorage
 * @param {Object} achievements - The achievements object to save
 */
export const saveAchievements = (achievements) => {
  try {
    localStorage.setItem('portfolio_panic_achievements', JSON.stringify(achievements));
    return true;
  } catch (error) {
    console.error('Error saving achievements:', error);
    return false;
  }
};

/**
 * Load achievements from localStorage
 * @returns {Object|null} - The loaded achievements or null if not found
 */
export const loadAchievements = () => {
  try {
    const serializedAchievements = localStorage.getItem('portfolio_panic_achievements');
    if (serializedAchievements === null) {
      return null;
    }
    return JSON.parse(serializedAchievements);
  } catch (error) {
    console.error('Error loading achievements:', error);
    return null;
  }
};