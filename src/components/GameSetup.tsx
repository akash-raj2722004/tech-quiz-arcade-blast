
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useGameContext } from '@/lib/GameContext';
import { Monitor, Smartphone } from 'lucide-react';

const GameSetup: React.FC = () => {
  const { setIsAdmin } = useGameContext();
  
  const handleSetupAdmin = () => {
    setIsAdmin(true);
  };
  
  const handleSetupPlayer = () => {
    setIsAdmin(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] w-full max-w-md mx-auto">
      <h2 className="text-2xl mb-8 text-center neon-text">Choose Your Role</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
        <Button 
          onClick={handleSetupAdmin}
          className="arcade-btn flex-col py-8 md:py-12"
        >
          <Monitor size={48} className="mb-4" />
          <div className="text-center">
            <div className="font-bold mb-2">ADMIN</div>
            <div className="text-xs opacity-80">Host the Quiz</div>
          </div>
        </Button>
        
        <Button 
          onClick={handleSetupPlayer}
          className="arcade-btn flex-col py-8 md:py-12"
        >
          <Smartphone size={48} className="mb-4" />
          <div className="text-center">
            <div className="font-bold mb-2">PLAYER</div>
            <div className="text-xs opacity-80">Join the Game</div>
          </div>
        </Button>
      </div>
    </div>
  );
};

export default GameSetup;
