
import React, { useState, useEffect } from 'react';
import { GameProvider, useGameContext } from '@/lib/GameContext';
import AdminPanel from '@/components/AdminPanel';
import PlayerPanel from '@/components/PlayerPanel';
import GameSetup from '@/components/GameSetup';
import AdminLogin from '@/components/AdminLogin';

// Main Game component
const Game: React.FC = () => {
  const { isAdmin, isAuthenticated } = useGameContext();
  const [showSetup, setShowSetup] = useState(true);
  
  // Listen for role selection
  useEffect(() => {
    if (isAdmin !== null) {
      setShowSetup(false);
    }
  }, [isAdmin]);
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="game-title">Tech Quiz Arcade Blast</h1>
      
      <div className="mt-6">
        {showSetup ? (
          <GameSetup />
        ) : isAdmin ? (
          // Show admin login or panel based on authentication
          isAuthenticated ? <AdminPanel /> : <AdminLogin />
        ) : (
          <PlayerPanel />
        )}
      </div>
      
      <footer className="text-center text-xs text-gray-500 mt-12 py-4">
        <p>Tech Quiz Arcade Blast &copy; {new Date().getFullYear()}</p>
        {/* Only show change role button for players or authenticated admins */}
        {(!isAdmin || isAuthenticated) && (
          <p className="mt-2">
            <button 
              onClick={() => setShowSetup(true)}
              className="text-arcade-blue hover:underline"
            >
              Change Role
            </button>
          </p>
        )}
      </footer>
    </div>
  );
};

// Wrap the game with our GameProvider
const Index = () => {
  return (
    <GameProvider>
      <Game />
    </GameProvider>
  );
};

export default Index;
