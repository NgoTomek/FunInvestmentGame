import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainMenu from "./components/screens/MainMenu";
import GameScreen from "./components/screens/GameScreen";
import ResultsScreen from "./components/screens/ResultsScreen";
import InstructionsScreen from "./components/screens/InstructionsScreen";
import SettingsScreen from "./components/screens/SettingsScreen";
import AchievementsScreen from "./components/screens/AchievementsScreen";
import NotFound from "./pages/NotFound";
import { GameProvider } from './context/GameContext';

const App = () => {
  return (
    <GameProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainMenu />} />
          <Route path="/game" element={<GameScreen />} />
          <Route path="/results" element={<ResultsScreen />} />
          <Route path="/instructions" element={<InstructionsScreen />} />
          <Route path="/settings" element={<SettingsScreen />} />
          <Route path="/achievements" element={<AchievementsScreen />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </GameProvider>
  );
};

export default App;
