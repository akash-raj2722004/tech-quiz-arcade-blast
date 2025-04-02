
# Socket.io Integration Guide for Tech Quiz Arcade Blast

This document outlines where and how to integrate Socket.io into the Tech Quiz Arcade Blast application for real-time functionality.

## Setup Instructions

1. Install required packages:
```bash
npm install socket.io-client
npm install socket.io express @types/socket.io @types/express --save-dev
```

2. Create a server file (e.g., `server/index.js`):

```javascript
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// Serve static files from the React build
app.use(express.static(path.join(__dirname, '../dist')));

// Game state storage
const gameState = {
  teams: [],
  currentImage: null,
  currentImageAnswer: null,
  buzzedTeam: null,
  gameState: 'waiting',
  showAnswer: false
};

// Socket.io event handlers
io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);
  
  // Send current game state to newly connected client
  socket.emit('gameStateUpdate', gameState);
  
  // Handle team joining
  socket.on('joinGame', (teamName) => {
    const newTeam = {
      id: socket.id,
      name: teamName
    };
    gameState.teams.push(newTeam);
    io.emit('teamJoined', newTeam);
    io.emit('teamsUpdate', gameState.teams);
  });
  
  // Handle buzzer press
  socket.on('pressBuzzer', (teamId) => {
    if (gameState.gameState !== 'playing') return;
    
    const team = gameState.teams.find(t => t.id === teamId);
    if (team) {
      gameState.buzzedTeam = team;
      gameState.gameState = 'buzzed';
      io.emit('teamBuzzed', team);
      io.emit('gameStateUpdate', gameState);
    }
  });
  
  // Handle admin actions
  socket.on('resetBuzzer', () => {
    gameState.buzzedTeam = null;
    gameState.gameState = 'playing';
    gameState.showAnswer = false;
    io.emit('gameStateUpdate', gameState);
  });
  
  socket.on('setCurrentImage', (imageData) => {
    gameState.currentImage = imageData.url;
    gameState.currentImageAnswer = imageData.answer;
    gameState.showAnswer = false;
    io.emit('imageUpdate', {
      url: imageData.url,
      answer: imageData.answer
    });
    io.emit('gameStateUpdate', gameState);
  });
  
  socket.on('toggleShowAnswer', () => {
    gameState.showAnswer = !gameState.showAnswer;
    io.emit('gameStateUpdate', gameState);
  });
  
  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
    gameState.teams = gameState.teams.filter(team => team.id !== socket.id);
    io.emit('teamsUpdate', gameState.teams);
  });
});

// Start server
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

## Client Integration Points

### 1. Create a Socket Context Provider

Create a new file `src/lib/SocketContext.tsx` to manage Socket.io connections:

```tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useGameContext } from './GameContext';

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false
});

export const useSocketContext = () => useContext(SocketContext);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const gameContext = useGameContext();

  useEffect(() => {
    // Connect to Socket.io server
    const socketConnection = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:3001');
    setSocket(socketConnection);

    // Handle connection events
    socketConnection.on('connect', () => {
      console.log('Connected to Socket.io server');
      setIsConnected(true);
    });

    socketConnection.on('disconnect', () => {
      console.log('Disconnected from Socket.io server');
      setIsConnected(false);
    });

    // Handle game state updates
    socketConnection.on('gameStateUpdate', (updatedGameState) => {
      // Update game context with new state from server
      if (updatedGameState.teams) gameContext.updateTeams(updatedGameState.teams);
      if (updatedGameState.buzzedTeam !== undefined) gameContext.updateBuzzedTeam(updatedGameState.buzzedTeam);
      if (updatedGameState.gameState) gameContext.updateGameState(updatedGameState.gameState);
      if (updatedGameState.showAnswer !== undefined) gameContext.updateShowAnswer(updatedGameState.showAnswer);
    });

    socketConnection.on('imageUpdate', (imageData) => {
      gameContext.setCurrentImage(imageData.url, imageData.answer);
    });

    // Clean up
    return () => {
      socketConnection.disconnect();
    };
  }, [gameContext]);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};
```

### 2. Wrap Your App with the Socket Provider

Update `src/App.tsx` or `src/pages/Index.tsx` to include the Socket Provider:

```tsx
import { SocketProvider } from '@/lib/SocketContext';

// In your main component:
return (
  <SocketProvider>
    <GameProvider>
      <Game />
    </GameProvider>
  </SocketProvider>
);
```

### 3. Update GameContext.tsx

Modify your GameContext to integrate with Socket.io:

```tsx
// Inside the provider component:
const pressBuzzer = (teamId: string) => {
  if (gameState !== 'playing') return;
  
  socketContext.socket?.emit('pressBuzzer', teamId);
  // Local state will be updated when server sends gameStateUpdate
};

const resetBuzzer = () => {
  socketContext.socket?.emit('resetBuzzer');
  // Local state will be updated when server sends gameStateUpdate
};

// Add these update methods for the socket to call
const updateTeams = (newTeams: Team[]) => {
  setTeams(newTeams);
};

const updateBuzzedTeam = (team: Team | null) => {
  setBuzzedTeam(team);
};

const updateGameState = (newState: GameState) => {
  setGameState(newState);
};

const updateShowAnswer = (show: boolean) => {
  setShowAnswer(show);
};
```

## Key Integration Points

The following files need Socket.io integration:

1. **GameContext.tsx**: The central state management should be connected to Socket.io
2. **AdminPanel.tsx**: All admin actions should emit socket events
3. **PlayerPanel.tsx**: Player actions like joining and buzzing should emit socket events

### Integration Points Marked in Code

In the AdminPanel.tsx and PlayerPanel.tsx files, I've added Socket.io integration point comments where Socket.io communication would be implemented:

- Team connection/disconnection events
- Buzzer press events
- Admin control actions (reset buzzer, show answer, change questions)
- Game state synchronization

## Running the Application with Socket.io

1. Start the Socket.io server:
```bash
node server/index.js
```

2. In a separate terminal, start your React application:
```bash
npm run dev
```

3. Access the application at http://localhost:5173 (or your configured port)
