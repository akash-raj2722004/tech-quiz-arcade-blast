
import React, { useState } from 'react';
import { useGameContext } from '@/lib/GameContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ZapIcon, AlertCircle } from 'lucide-react';

const PlayerPanel: React.FC = () => {
  const { joinGame, userTeam, pressBuzzer, gameState, buzzedTeam } = useGameContext();
  const [teamName, setTeamName] = useState('');

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
    <div className="flex flex-col items-center justify-center w-full max-w-md mx-auto gap-6">
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
          
          <div className="arcade-panel p-4">
            {gameState === 'playing' ? (
              <button 
                onClick={handleBuzzerPress}
                className="buzzer-btn"
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
          
          <div className="text-center text-xs text-gray-400">
            Be ready to hit the buzzer when the next question appears!
          </div>
        </div>
      )}
    </div>
  );
};

export default PlayerPanel;
