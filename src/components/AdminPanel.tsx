
import React, { useState } from 'react';
import { useGameContext } from '@/lib/GameContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Image, RefreshCw, Gamepad2 } from 'lucide-react';

const AdminPanel: React.FC = () => {
  const { teams, buzzedTeam, resetBuzzer, setCurrentImage, gameState } = useGameContext();
  const [availableImages, setAvailableImages] = useState<string[]>([
    '/images/question1.jpg',
    '/images/question2.jpg',
    '/images/question3.jpg'
  ]);

  const handleImageSelect = (imagePath: string) => {
    setCurrentImage(imagePath);
    // In a real implementation, this would emit a socket event
  };

  const handleReset = () => {
    resetBuzzer();
    // In a real implementation, this would emit a socket event
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="arcade-panel overflow-hidden">
        <h2 className="text-xl text-center mb-4 neon-text">Game Control Panel</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Team Status Panel */}
          <div className="bg-arcade-dark-purple p-4 rounded-lg">
            <h3 className="text-lg mb-3 text-arcade-light-purple">Connected Teams</h3>
            
            {teams.length === 0 ? (
              <p className="text-sm text-gray-400">Waiting for teams to connect...</p>
            ) : (
              <ul className="space-y-2">
                {teams.map(team => (
                  <li 
                    key={team.id} 
                    className={`flex items-center p-2 rounded-md ${
                      buzzedTeam?.id === team.id 
                        ? 'bg-arcade-purple text-white animate-pulse-arcade' 
                        : 'bg-muted'
                    }`}
                  >
                    <Gamepad2 size={16} className="mr-2" />
                    <span>{team.name}</span>
                    {buzzedTeam?.id === team.id && (
                      <span className="ml-auto text-xs font-bold px-2 py-1 bg-arcade-red rounded-md">
                        BUZZED!
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Controls Panel */}
          <div className="bg-arcade-dark-purple p-4 rounded-lg">
            <h3 className="text-lg mb-3 text-arcade-light-purple">Game Controls</h3>
            
            <div className="space-y-3">
              <div>
                <h4 className="text-sm mb-2">Images:</h4>
                <div className="grid grid-cols-3 gap-2">
                  {availableImages.map((img, index) => (
                    <Card 
                      key={index} 
                      className="cursor-pointer border-2 hover:border-arcade-purple transition-all"
                      onClick={() => handleImageSelect(img)}
                    >
                      <div className="h-12 flex items-center justify-center">
                        <Image size={20} />
                        <span className="ml-1 text-xs">Q{index + 1}</span>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
              
              <div className="pt-3">
                <Button 
                  onClick={handleReset}
                  className="arcade-btn w-full py-2"
                  disabled={gameState === 'playing'}
                >
                  <RefreshCw size={16} className="mr-2" />
                  Reset Buzzer
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Buzzed Team Display */}
      {buzzedTeam && (
        <div className="arcade-panel text-center py-8">
          <h3 className="text-xl mb-2">Buzzed In:</h3>
          <div className="bg-arcade-purple text-white text-2xl md:text-4xl py-4 px-6 rounded-lg animate-pulse-arcade">
            {buzzedTeam.name}
          </div>
        </div>
      )}

      {/* Current Question Display Area */}
      <div className="arcade-panel min-h-[200px] md:min-h-[300px] flex flex-col items-center justify-center">
        <h2 className="text-xl mb-4 neon-text">Current Question</h2>
        {/* This would display the current image/question */}
        <div className="w-full h-full flex items-center justify-center">
          {/* Placeholder for question content */}
          <div className="text-center text-gray-400">
            <Image size={48} className="mx-auto mb-2" />
            <p>Select an image to display the question</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
