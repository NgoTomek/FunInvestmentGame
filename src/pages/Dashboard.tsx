import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/dashboard/Header';
import PortfolioOverview from '@/components/dashboard/PortfolioOverview';
import Holdings from '@/components/dashboard/Holdings';
import NetWorthChart from '@/components/dashboard/NetWorthChart';
import MarketNews from '@/components/dashboard/MarketNews';
import GameControls from '@/components/dashboard/GameControls';
import { Separator } from '@/components/ui/separator';
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogAction } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';

interface DashboardProps {
  onEndGame?: () => void;
}

const Dashboard = ({ onEndGame }: DashboardProps) => {
  const [showEndGameConfirm, setShowEndGameConfirm] = useState(false);

  // Simulating a timer for demonstration purposes
  const [timer, setTimer] = useState(60);
  const [isPaused, setIsPaused] = useState(false);
  const [round, setRound] = useState(1);
  const [totalRounds, setTotalRounds] = useState(10);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (!isPaused) {
      interval = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            // Move to next round or end game
            if (round < totalRounds) {
              setRound(prev => prev + 1);
              return 60;
            } else {
              // End game when all rounds complete
              if (onEndGame) onEndGame();
              return 0;
            }
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPaused, round, totalRounds, onEndGame]);

  // Format time as mm:ss
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleTogglePause = () => {
    setIsPaused(prev => !prev);
  };

  const handleEndGameRequest = () => {
    setShowEndGameConfirm(true);
  };

  const confirmEndGame = () => {
    setShowEndGameConfirm(false);
    if (onEndGame) onEndGame();
  };

  const cancelEndGame = () => {
    setShowEndGameConfirm(false);
  };

  return (
    <div className="bg-[#0A1629] min-h-screen text-white">
      <div className="container mx-auto px-4 py-4 max-w-7xl">
        <Header timer={formatTime(timer)} round={round} totalRounds={totalRounds} />
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mt-6">
          <div className="md:col-span-8 space-y-6">
            <PortfolioOverview />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Holdings />
              <MarketNews />
            </div>
          </div>
          <div className="md:col-span-4 space-y-6">
            <NetWorthChart />
            <GameControls 
              onEndGame={handleEndGameRequest} 
              isPaused={isPaused}
              onTogglePause={handleTogglePause}
              round={round}
              totalRounds={totalRounds}
            />
          </div>
        </div>
        <div className="mt-6 py-6">
          <Separator className="bg-[#1A2B45]" />
          <div className="flex justify-between items-center pt-4 text-[#A3B1C6] text-sm">
            <div>© 2025 Portfolio Panic</div>
            <div>v1.0.0</div>
          </div>
        </div>
      </div>

      <AlertDialog open={showEndGameConfirm} onOpenChange={setShowEndGameConfirm}>
        <AlertDialogContent className="bg-[#132237] border-[#1A2B45] text-white">
          <AlertDialogHeader>
            <AlertDialogTitle>End Current Game?</AlertDialogTitle>
            <AlertDialogDescription className="text-[#A3B1C6]">
              Are you sure you want to end this game? Your progress will be tallied and you'll be taken to the results screen.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Button 
              variant="outline" 
              className="bg-[#0A1629] border-[#1A2B45] text-white hover:bg-[#1A2B45]"
              onClick={cancelEndGame}
            >
              Cancel
            </Button>
            <Button 
              className="bg-[#FF6B00] hover:bg-[#FF8A33] text-white"
              onClick={confirmEndGame}
            >
              End Game
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Dashboard;