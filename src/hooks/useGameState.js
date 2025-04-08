import { useState, useEffect, useRef } from 'react';
import { DIFFICULTY_SETTINGS, GAME_MODE_SETTINGS, INITIAL_ASSET_PRICES } from '../utils/gameData';
import { saveGameState, loadGameState } from '../utils/localStorage';
import { generateNewsEvent } from '../utils/marketLogic';

/**
 * Custom hook for managing overall game state
 * @param {string} initialDifficulty - Starting difficulty level
 * @param {string} initialGameMode - Starting game mode
 * @param {boolean} shouldLoadSavedState - Whether to load from localStorage
 * @returns {Object} Game state and management functions
 */
const useGameState = (initialDifficulty = 'normal', initialGameMode = 'standard', shouldLoadSavedState = true) => {
  // Main game state
  const [gameScreen, setGameScreen] = useState('menu');
  const [gameMode, setGameMode] = useState(initialGameMode);
  const [difficulty, setDifficulty] = useState(initialDifficulty);
  const [round, setRound] = useState(1);
  const [totalRounds, setTotalRounds] = useState(DIFFICULTY_SETTINGS[initialDifficulty].rounds);
  const [timer, setTimer] = useState(60);
  const [paused, setPaused] = useState(false);
  const [marketUpdateCountdown, setMarketUpdateCountdown] = useState(10);
  
  // User settings
  const [settings, setSettings] = useState({
    sound: true,
    music: true,
    tutorialComplete: false,
    darkMode: true,
    saveProgress: true
  });
  
  // Game statistics
  const [gameStats, setGameStats] = useState({
    tradesExecuted: 0,
    profitableTrades: 0,
    tradesPerRound: 0,
    biggestGain: 0,
    biggestLoss: 0,
    marketCrashesWeathered: 0
  });
  
  // Timer references
  const gameTimerRef = useRef(null);
  const marketUpdateRef = useRef(null);
  
  // Load saved state on initial render
  useEffect(() => {
    if (shouldLoadSavedState) {
      const savedState = loadGameState();
      if (savedState && savedState.settings?.saveProgress) {
        setSettings(savedState.settings || settings);
        
        // If we were in the middle of a game, optionally restore it
        if (savedState.gameInProgress && savedState.gameScreen === 'game') {
          // Could prompt the user to continue or just go to menu
          setGameScreen('menu');
        } else {
          setGameScreen(savedState.gameScreen || 'menu');
        }
        
        // Restore other game state if needed
        if (savedState.difficulty) setDifficulty(savedState.difficulty);
        if (savedState.gameMode) setGameMode(savedState.gameMode);
      }
    }
  }, [shouldLoadSavedState]);
  
  // Save game state when relevant parts change
  useEffect(() => {
    if (settings.saveProgress) {
      saveGameState({
        settings,
        gameScreen,
        difficulty,
        gameMode,
        gameInProgress: gameScreen === 'game'
      });
    }
  }, [settings, gameScreen, difficulty, gameMode]);
  
  // Toggle a setting
  const toggleSetting = (setting) => {
    setSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };
  
  // Start timers
  const startGameTimer = () => {
    if (gameTimerRef.current) clearInterval(gameTimerRef.current);
    
    gameTimerRef.current = setInterval(() => {
      if (!paused) {
        setTimer(prev => {
          if (prev <= 1) {
            // End of round
            clearInterval(gameTimerRef.current);
            
            if (round < totalRounds) {
              // Move to next round
              setRound(prev => prev + 1);
              // Reset trade per round counter
              setGameStats(prev => ({
                ...prev,
                tradesPerRound: 0
              }));
              return 60; // Reset timer for next round
            } else {
              // End game
              return 0;
            }
          }
          return prev - 1;
        });
      }
    }, 1000);
  };
  
  // Start market updates
  const startMarketUpdates = () => {
    if (marketUpdateRef.current) clearInterval(marketUpdateRef.current);
    
    const updateInterval = DIFFICULTY_SETTINGS[difficulty].updateInterval;
    setMarketUpdateCountdown(updateInterval);
    
    marketUpdateRef.current = setInterval(() => {
      if (!paused) {
        setMarketUpdateCountdown(prev => {
          if (prev <= 1) {
            return updateInterval;
          }
          return prev - 1;
        });
      }
    }, 1000);
  };
  
  // Initialize new game
  const initializeGame = () => {
    // Set total rounds based on difficulty
    setTotalRounds(DIFFICULTY_SETTINGS[difficulty].rounds);
    setRound(1);
    
    // Reset timer
    setTimer(60);
    setPaused(false);
    
    // Reset market update countdown
    const updateInterval = DIFFICULTY_SETTINGS[difficulty].updateInterval;
    setMarketUpdateCountdown(updateInterval);
    
    // Reset game stats
    setGameStats({
      tradesExecuted: 0,
      profitableTrades: 0,
      tradesPerRound: 0,
      biggestGain: 0,
      biggestLoss: 0,
      marketCrashesWeathered: 0
    });
    
    // Start game timers
    startGameTimer();
    startMarketUpdates();
  };
  
  // Start game (wrapper for initialize)
  const startGame = () => {
    initializeGame();
    setGameScreen('game');
  };
  
  // Toggle pause state
  const togglePause = () => {
    setPaused(prev => !prev);
  };
  
  // Clean up timers when component unmounts
  useEffect(() => {
    return () => {
      if (gameTimerRef.current) clearInterval(gameTimerRef.current);
      if (marketUpdateRef.current) clearInterval(marketUpdateRef.current);
    };
  }, []);
  
  // Generate initial news event
  const generateInitialNews = () => {
    return generateNewsEvent(gameMode, difficulty, DIFFICULTY_SETTINGS);
  };
  
  return {
    // Game state
    gameScreen,
    setGameScreen,
    gameMode,
    setGameMode,
    difficulty,
    setDifficulty,
    round,
    setRound,
    totalRounds,
    timer,
    setTimer,
    paused,
    setPaused,
    marketUpdateCountdown,
    setMarketUpdateCountdown,
    
    // Settings
    settings,
    setSettings,
    toggleSetting,
    
    // Game statistics
    gameStats,
    setGameStats,
    
    // Functions
    startGame,
    initializeGame,
    togglePause,
    startGameTimer,
    startMarketUpdates,
    generateInitialNews,
    
    // Timer references
    gameTimerRef,
    marketUpdateRef
  };
};

export default useGameState;