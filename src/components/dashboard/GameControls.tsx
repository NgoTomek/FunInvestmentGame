import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PauseIcon, PlayIcon, StopCircle } from 'lucide-react';

interface GameControlsProps {
  onEndGame?: () => void;
  isPaused: boolean;
  onTogglePause: () => void;
  round: number;
  totalRounds: number;
}

const GameControls = ({ 
  onEndGame, 
  isPaused, 
  onTogglePause,
  round,
  totalRounds
}: GameControlsProps) => {
  const progressPercentage = (round / totalRounds) * 100;
  
  return (
    <Card className="bg-[#132237] border-none rounded-xl overflow-hidden">
      <CardContent className="p-6">
        <div className="flex flex-col space-y-4">
          <div className="bg-[#0A1629] rounded-lg p-4">
            <h3 className="text-[#A3B1C6] text-sm mb-1">Game Progress</h3>
            <div className="flex items-center justify-between">
              <span className="text-white font-bold">Round {round} of {totalRounds}</span>
              <div className="flex gap-2">
                {[...Array(5)].map((_, index) => (
                  <div 
                    key={index} 
                    className={`w-2 h-2 rounded-full ${
                      index < Math.ceil((round / totalRounds) * 5) 
                        ? 'bg-[#FF6B00]' 
                        : 'bg-[#1A2B45]'
                    }`}
                  ></div>
                ))}
              </div>
            </div>
            <div className="w-full bg-[#1A2B45] h-1.5 rounded-full mt-2 overflow-hidden">
              <div 
                className="bg-[#FF6B00] h-full rounded-full" 
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Button 
              variant="outline" 
              className="bg-[#0A1629] border-[#1A2B45] text-white hover:bg-[#1A2B45] hover:text-white"
              onClick={onTogglePause}
            >
              {isPaused ? (
                <><PlayIcon size={16} className="mr-2" /> Resume</>
              ) : (
                <><PauseIcon size={16} className="mr-2" /> Pause</>
              )}
            </Button>
            <Button 
              variant="outline" 
              className="bg-[#0A1629] border-[#1A2B45] text-[#FF5A5A] hover:bg-[#FF5A5A] hover:text-white hover:border-[#FF5A5A]"
              onClick={onEndGame}
            >
              <StopCircle size={16} className="mr-2" /> End Game
            </Button>
          </div>
          
          <div className="bg-[#FF6B00]/10 border border-[#FF6B00]/30 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="p-1.5 rounded-full bg-[#FF6B00]/20 mt-0.5">
                <div className="w-3 h-3 rounded-full bg-[#FF6B00]"></div>
              </div>
              <div>
                <h3 className="text-white font-medium text-sm">Market volatility increasing</h3>
                <p className="text-[#A3B1C6] text-xs mt-1">
                  Be prepared for potential price swings in the next round!
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GameControls;