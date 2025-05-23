import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Trophy, Lock, CheckCircle, Star, TrendingUp, Wallet, Target, Zap } from 'lucide-react';

type Achievement = {
  id: number;
  title: string;
  description: string;
  icon: React.ElementType;
  progress: number;
  unlocked: boolean;
  unlockedDate?: string;
};

// In a real application, this would come from a state management system or API
const achievementsData: Achievement[] = [
  {
    id: 1,
    title: 'First Million',
    description: 'Reach a portfolio value of $1,000,000',
    icon: Wallet,
    progress: 45,
    unlocked: false,
  },
  {
    id: 2,
    title: 'Market Master',
    description: 'Achieve 50% return in a single game',
    icon: TrendingUp,
    progress: 100,
    unlocked: true,
    unlockedDate: '2025-04-05',
  },
  {
    id: 3,
    title: 'Diversification Pro',
    description: 'Own at least 6 different asset types simultaneously',
    icon: Target,
    progress: 67,
    unlocked: false,
  },
  {
    id: 4,
    title: 'Perfect Timing',
    description: 'Buy an asset just before it increases 20% in value',
    icon: Zap,
    progress: 100,
    unlocked: true,
    unlockedDate: '2025-04-08',
  },
  {
    id: 5,
    title: 'Comeback King',
    description: 'Recover from a 30% portfolio loss to end with positive returns',
    icon: Star,
    progress: 0,
    unlocked: false,
  },
  {
    id: 6,
    title: 'Diamond Hands',
    description: 'Hold an asset through 3 consecutive rounds of negative returns',
    icon: Star,
    progress: 33,
    unlocked: false,
  },
];

const Achievements = () => {
  // Calculate unlocked achievements
  const unlockedCount = achievementsData.filter(a => a.unlocked).length;
  const totalCount = achievementsData.length;

  return (
    <div className="min-h-screen bg-[#0A1629] text-white">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Link to="/" className="inline-flex items-center text-[#A3B1C6] hover:text-white mb-6">
          <ArrowLeft size={16} className="mr-2" />
          Back to Main Menu
        </Link>
        
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Achievements</h1>
          <p className="text-[#A3B1C6]">Track your accomplishments</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {achievementsData.map((achievement) => (
            <Card 
              key={achievement.id} 
              className={`bg-[#132237] border-none rounded-xl overflow-hidden transition-all duration-200 ${
                achievement.unlocked ? 'hover:shadow-accent' : ''
              }`}
            >
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className={`rounded-full p-3 ${
                    achievement.unlocked 
                      ? 'bg-[#FF6B00]/20 text-[#FF6B00]' 
                      : 'bg-[#0A1629] text-[#A3B1C6]'
                  }`}>
                    <achievement.icon size={24} />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h2 className="text-lg font-bold">{achievement.title}</h2>
                      {achievement.unlocked ? (
                        <CheckCircle className="text-[#FF6B00]" size={18} />
                      ) : (
                        <Lock className="text-[#A3B1C6]" size={18} />
                      )}
                    </div>
                    
                    <p className="text-[#A3B1C6] text-sm mt-1">
                      {achievement.description}
                    </p>
                    
                    <div className="mt-4">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-[#A3B1C6]">
                          {achievement.unlocked ? 'Completed' : `Progress: ${achievement.progress}%`}
                        </span>
                        {achievement.unlocked && achievement.unlockedDate && (
                          <span className="text-[#A3B1C6]">
                            {achievement.unlockedDate}
                          </span>
                        )}
                      </div>
                      <div className="w-full bg-[#0A1629] h-1.5 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${achievement.unlocked ? 'bg-[#FF6B00]' : 'bg-[#3A7BFF]'}`}
                          style={{ width: `${achievement.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="mt-8 text-center">
          <div className="bg-[#132237] inline-block rounded-lg px-6 py-3">
            <div className="flex items-center gap-2">
              <Trophy className="text-[#FF6B00]" size={20} />
              <span>
                <span className="text-[#FF6B00] font-bold">{unlockedCount}</span>
                <span className="text-[#A3B1C6]"> of </span>
                <span className="text-white font-bold">{totalCount}</span>
                <span className="text-[#A3B1C6]"> achievements unlocked</span>
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex justify-center mt-8">
          <Link to="/dashboard">
            <Button className="bg-[#FF6B00] hover:bg-[#FF8A33] px-8">
              Play to Earn More
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Achievements;