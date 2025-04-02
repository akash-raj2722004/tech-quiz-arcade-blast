
import React, { createContext, useContext, useState, ReactNode } from 'react';

// Game state types
type Team = {
  id: string;
  name: string;
};

type QuestionImage = {
  url: string;
  answer: string;
};

type GameState = 'waiting' | 'playing' | 'buzzed';

interface GameContextType {
  teams: Team[];
  currentImage: string | null;
  currentImageAnswer: string | null;
  buzzedTeam: Team | null;
  gameState: GameState;
  userTeam: Team | null;
  isAdmin: boolean | null;
  showAnswer: boolean;
  isFullscreen: boolean;
  isAuthenticated: boolean;
  
  // Admin actions
  addTeam: (name: string) => void;
  resetBuzzer: () => void;
  setCurrentImage: (imageUrl: string, answer: string) => void;
  toggleShowAnswer: () => void;
  toggleFullscreen: () => void;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  
  // Player actions
  joinGame: (teamName: string) => void;
  pressBuzzer: (teamId: string) => void;
  
  // View toggle
  setIsAdmin: (isAdmin: boolean) => void;
}

// Default context state
const defaultGameContext: GameContextType = {
  teams: [],
  currentImage: null,
  currentImageAnswer: null,
  buzzedTeam: null,
  gameState: 'waiting',
  userTeam: null,
  isAdmin: null,
  showAnswer: false,
  isFullscreen: false,
  isAuthenticated: false,
  
  // These will be implemented in the provider
  addTeam: () => {},
  resetBuzzer: () => {},
  setCurrentImage: () => {},
  toggleShowAnswer: () => {},
  toggleFullscreen: () => {},
  login: () => false,
  logout: () => {},
  joinGame: () => {},
  pressBuzzer: () => {},
  setIsAdmin: () => {},
};

// Create the context
const GameContext = createContext<GameContextType>(defaultGameContext);

// Custom hook to use the context
export const useGameContext = () => useContext(GameContext);

// Provider component
export const GameProvider = ({ children }: { children: ReactNode }) => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [currentImage, setCurrentImageUrl] = useState<string | null>(null);
  const [currentImageAnswer, setCurrentImageAnswer] = useState<string | null>(null);
  const [buzzedTeam, setBuzzedTeam] = useState<Team | null>(null);
  const [gameState, setGameState] = useState<GameState>('waiting');
  const [userTeam, setUserTeam] = useState<Team | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [showAnswer, setShowAnswer] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // Sound effects (to be implemented with Socket.io later)
  const playBuzzerSound = () => {
    // Play buzzer sound effect
    const audio = new Audio('/sounds/buzzer.mp3');
    audio.volume = 0.5;
    audio.play().catch(err => console.log('Audio play failed:', err));
  };

  const addTeam = (name: string) => {
    const newTeam = {
      id: Date.now().toString(),
      name,
    };
    setTeams([...teams, newTeam]);
  };

  const resetBuzzer = () => {
    setBuzzedTeam(null);
    setGameState('playing');
    setShowAnswer(false);
  };

  const setCurrentImage = (imageUrl: string, answer: string) => {
    setCurrentImageUrl(imageUrl);
    setCurrentImageAnswer(answer);
    setShowAnswer(false);
  };

  const toggleShowAnswer = () => {
    setShowAnswer(prev => !prev);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(prev => !prev);
  };

  const login = (username: string, password: string): boolean => {
    // Simple authentication
    if (username === 'admin' && password === '12345') {
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
  };

  const joinGame = (teamName: string) => {
    const newTeam = {
      id: Date.now().toString(),
      name: teamName,
    };
    setTeams([...teams, newTeam]);
    setUserTeam(newTeam);
  };

  const pressBuzzer = (teamId: string) => {
    if (gameState !== 'playing') return;
    
    const team = teams.find((t) => t.id === teamId);
    if (team) {
      setBuzzedTeam(team);
      setGameState('buzzed');
      playBuzzerSound();
    }
  };

  const value = {
    teams,
    currentImage,
    currentImageAnswer,
    buzzedTeam,
    gameState,
    userTeam,
    isAdmin,
    showAnswer,
    isFullscreen,
    isAuthenticated,
    
    // Admin actions
    addTeam,
    resetBuzzer,
    setCurrentImage,
    toggleShowAnswer,
    toggleFullscreen,
    login,
    logout,
    
    // Player actions
    joinGame,
    pressBuzzer,
    
    // View toggle
    setIsAdmin,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};
