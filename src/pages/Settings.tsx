import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Volume2, Volume1, VolumeX, MonitorSmartphone, Clock, Lightbulb, Smartphone } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';

const Settings = () => {
  // In a real app, these would be stored in a state management system or localStorage
  const [soundVolume, setSoundVolume] = useState(80);
  const [musicVolume, setMusicVolume] = useState(60);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [musicEnabled, setMusicEnabled] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [saveProgress, setSaveProgress] = useState(true);
  const [username, setUsername] = useState('Trader1');
  
  return (
    <div className="min-h-screen bg-[#0A1629] text-white">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Link to="/" className="inline-flex items-center text-[#A3B1C6] hover:text-white mb-6">
          <ArrowLeft size={16} className="mr-2" />
          Back to Main Menu
        </Link>
        
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Settings</h1>
          <p className="text-[#A3B1C6]">Customize your game experience</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-[#132237] border-none rounded-xl overflow-hidden">
            <CardContent className="p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center">
                <Volume2 className="mr-2 text-[#A3B1C6]" size={20} />
                Sound Settings
              </h2>
              
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <Label htmlFor="sound-enabled" className="text-[#A3B1C6]">Sound Effects</Label>
                  <Switch 
                    id="sound-enabled" 
                    checked={soundEnabled} 
                    onCheckedChange={setSoundEnabled} 
                    className="data-[state=checked]:bg-[#FF6B00]"
                  />
                </div>
                
                {soundEnabled && (
                  <div>
                    <div className="flex justify-between mb-2">
                      <Label htmlFor="sound-volume" className="text-[#A3B1C6]">Volume</Label>
                      <span className="text-white">{soundVolume}%</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <VolumeX size={16} className="text-[#A3B1C6]" />
                      <Input
                        id="sound-volume"
                        type="range"
                        min="0"
                        max="100"
                        value={soundVolume}
                        onChange={(e) => setSoundVolume(parseInt(e.target.value))}
                        className="accent-[#FF6B00] h-2 bg-[#0A1629]"
                      />
                      <Volume2 size={16} className="text-[#A3B1C6]" />
                    </div>
                  </div>
                )}
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="music-enabled" className="text-[#A3B1C6]">Background Music</Label>
                  <Switch 
                    id="music-enabled" 
                    checked={musicEnabled} 
                    onCheckedChange={setMusicEnabled} 
                    className="data-[state=checked]:bg-[#FF6B00]"
                  />
                </div>
                
                {musicEnabled && (
                  <div>
                    <div className="flex justify-between mb-2">
                      <Label htmlFor="music-volume" className="text-[#A3B1C6]">Volume</Label>
                      <span className="text-white">{musicVolume}%</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <VolumeX size={16} className="text-[#A3B1C6]" />
                      <Input
                        id="music-volume"
                        type="range"
                        min="0"
                        max="100"
                        value={musicVolume}
                        onChange={(e) => setMusicVolume(parseInt(e.target.value))}
                        className="accent-[#FF6B00] h-2 bg-[#0A1629]"
                      />
                      <Volume1 size={16} className="text-[#A3B1C6]" />
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-[#132237] border-none rounded-xl overflow-hidden">
            <CardContent className="p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center">
                <MonitorSmartphone className="mr-2 text-[#A3B1C6]" size={20} />
                Display Settings
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="dark-mode" className="text-[#A3B1C6]">Dark Mode</Label>
                  <Switch 
                    id="dark-mode" 
                    checked={darkMode} 
                    onCheckedChange={setDarkMode} 
                    className="data-[state=checked]:bg-[#FF6B00]"
                  />
                </div>
                
                <div>
                  <Label htmlFor="username" className="text-[#A3B1C6] block mb-2">Username</Label>
                  <Input
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="bg-[#0A1629] border-[#1A2B45] text-white"
                  />
                </div>
                
                <div className="flex items-center justify-between mt-4">
                  <Label htmlFor="save-progress" className="text-[#A3B1C6]">Save Progress</Label>
                  <Switch 
                    id="save-progress" 
                    checked={saveProgress} 
                    onCheckedChange={setSaveProgress} 
                    className="data-[state=checked]:bg-[#FF6B00]"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-[#132237] border-none rounded-xl overflow-hidden md:col-span-2">
            <CardContent className="p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center">
                <Smartphone className="mr-2 text-[#A3B1C6]" size={20} />
                About & Support
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-[#0A1629] p-4 rounded-lg">
                  <p className="text-[#A3B1C6] text-sm mb-1">Version</p>
                  <p className="font-medium">Portfolio Panic v1.0.0</p>
                </div>
                
                <div className="bg-[#0A1629] p-4 rounded-lg">
                  <p className="text-[#A3B1C6] text-sm mb-1">Developer</p>
                  <p className="font-medium">Portfolio Panic Team</p>
                </div>
                
                <Button 
                  variant="outline" 
                  className="w-full bg-[#0A1629] border-[#1A2B45] text-white hover:bg-[#1A2B45]"
                >
                  Contact Support
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full bg-[#0A1629] border-[#1A2B45] text-white hover:bg-[#1A2B45]"
                >
                  Privacy Policy
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="flex justify-end mt-8">
          <Link to="/">
            <Button className="bg-[#FF6B00] hover:bg-[#FF8A33] px-8">
              Save Changes
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Settings;