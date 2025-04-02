import React, { useState } from 'react';
import { useGameContext } from '@/lib/GameContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ZapIcon, AlertCircle, Image, Maximize, Minimize } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

const PlayerPanel: React.FC = () => {
  const { joinGame, userTeam, pressBuzzer, gameState, buzzedTeam, currentImage, isFullscreen, toggleFullscreen } = useGameContext();
  const [teamName, setTeamName] = useState('');
  const isMobile = useIsMobile();

  const handleJoinGame = () => {
    if (teamName.trim()) {
      joinGame(teamName.trim());
    }
  };

  const handleBuzzerPress = () => {
    if (userTeam) {
      pressBuzzer(userTeam.id);
    }
  };

  return (
    <div className={`flex flex-col items-center justify-center w-full max-w-md mx-auto gap-6 ${
      isFullscreen ? 'fixed top-0 left-0 w-full h-full z-50 bg-black p-4 max-w-none' : ''
    }`}>
      {!userTeam ? (
        // Join Game Screen
        <div className="arcade-panel w-full p-6">
          <h2 className="text-xl md:text-2xl mb-6 text-center neon-text">Join Game</h2>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="teamName" className="block text-sm mb-2">Team Name:</label>
              <Input
                id="teamName"
                className="bg-arcade-dark-purple border-arcade-purple text-white"
                placeholder="Enter your team name"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
              />
            </div>
            
            <Button 
              onClick={handleJoinGame}
              className="arcade-btn w-full py-4"
              disabled={!teamName.trim()}
            >
              Join Game
            </Button>
          </div>
        </div>
      ) : (
        // Buzzer Screen
        <div className="w-full space-y-6">
          <div className="arcade-panel p-4 text-center">
            <h2 className="text-xl neon-text mb-2">Team</h2>
            <div className="text-white text-2xl">{userTeam.name}</div>
          </div>
          
          {/* Current Question Display */}
          {currentImage && (
            <div className={`arcade-panel p-4 ${isFullscreen ? 'flex-grow flex flex-col' : ''}`}>
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg text-arcade-light-purple">Current Question</h3>
                <button 
                  onClick={toggleFullscreen} 
                  className="p-1 bg-arcade-dark-purple rounded-md text-white hover:bg-arcade-purple"
                >
                  {isFullscreen ? <Minimize size={18} /> : <Maximize size={18} />}
                </button>
              </div>
              <div className={`flex justify-center ${isFullscreen ? 'flex-grow' : ''}`}>
                <img 
                  src={currentImage} 
                  alt="Question" 
                  className={`rounded-lg object-contain ${isFullscreen ? 'max-h-[80vh]' : 'max-h-[200px]'}`}
                  onError={(e) => {
                    console.error(`Failed to load image: ${currentImage}`);
                    e.currentTarget.src = '/placeholder.svg';
                  }}
                />
              </div>
            </div>
          )}
          
          {!isFullscreen && (
            <div className="arcade-panel p-4">
              {gameState === 'playing' ? (
                <button 
                  onClick={handleBuzzerPress}
                  className={`buzzer-btn w-full ${isMobile ? 'h-40' : 'h-32'} flex items-center justify-center rounded-full bg-gradient-to-r from-arcade-red to-arcade-orange text-white font-press-start text-xl md:text-3xl uppercase tracking-wider border-4 border-white shadow-[0_0_20px_rgba(234,56,76,0.8)] hover:shadow-[0_0_35px_rgba(234,56,76,1)] active:scale-95 transition-all`}
                >
                  <ZapIcon size={32} className="mr-2" />
                  BUZZ
                </button>
              ) : (
                <div className="text-center py-6">
                  {gameState === 'buzzed' && (
                    <div className="space-y-4">
                      <AlertCircle size={48} className="text-arcade-red mx-auto" />
                      <p className="text-lg text-arcade-orange">
                        {buzzedTeam?.id === userTeam.id 
                          ? 'You buzzed in first!'
                          : 'Another team buzzed in!'}
                      </p>
                      <p className="text-sm text-gray-400">
                        Wait for the host to reset the buzzer for the next question
                      </p>
                    </div>
                  )}
                  
                  {gameState === 'waiting' && (
                    <div className="space-y-4">
                      <div className="animate-pulse text-arcade-blue">
                        <p className="text-lg">Waiting for the next question...</p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
          
          {!isFullscreen && (
            <div className="text-center text-xs text-gray-400">
              Be ready to hit the buzzer when the next question appears!
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PlayerPanel;
