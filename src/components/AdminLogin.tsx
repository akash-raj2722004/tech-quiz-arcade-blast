
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useGameContext } from '@/lib/GameContext';
import { Lock, User } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const AdminLogin: React.FC = () => {
  const { login } = useGameContext();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const success = login(username, password);
    
    if (!success) {
      toast({
        title: "Authentication Failed",
        description: "Invalid username or password",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-md mx-auto">
      <div className="arcade-panel w-full p-6">
        <h2 className="text-xl md:text-2xl mb-6 text-center neon-text">Admin Login</h2>
        
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="username" className="block text-sm mb-2">Username:</label>
            <div className="relative">
              <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <Input
                id="username"
                className="bg-arcade-dark-purple border-arcade-purple text-white pl-10"
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm mb-2">Password:</label>
            <div className="relative">
              <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <Input
                id="password"
                type="password"
                className="bg-arcade-dark-purple border-arcade-purple text-white pl-10"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>
          
          <Button 
            type="submit"
            className="arcade-btn w-full py-4"
            disabled={!username || !password}
          >
            Login
          </Button>
          
          <div className="text-center text-xs text-gray-400 mt-4">
            <p>Default credentials: admin / 12345</p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
