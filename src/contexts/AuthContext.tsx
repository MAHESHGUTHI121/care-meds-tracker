
import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthContextType, User } from '../types';
import { toast } from '@/hooks/use-toast';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Mock users for demonstration
const mockUsers: User[] = [
  {
    id: '1',
    email: 'patient@demo.com',
    name: 'John Patient',
    role: 'patient',
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    email: 'caretaker@demo.com',
    name: 'Sarah Caretaker',
    role: 'caretaker',
    createdAt: '2024-01-01T00:00:00Z'
  }
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const savedUser = localStorage.getItem('medication_app_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const foundUser = mockUsers.find(u => u.email === email);
      if (!foundUser) {
        throw new Error('Invalid credentials');
      }
      
      setUser(foundUser);
      localStorage.setItem('medication_app_user', JSON.stringify(foundUser));
      toast({
        title: 'Success',
        description: 'Logged in successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Invalid credentials',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, password: string, name: string, role: 'patient' | 'caretaker') => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newUser: User = {
        id: Date.now().toString(),
        email,
        name,
        role,
        createdAt: new Date().toISOString()
      };
      
      setUser(newUser);
      localStorage.setItem('medication_app_user', JSON.stringify(newUser));
      
      toast({
        title: 'Success',
        description: 'Account created successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create account',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('medication_app_user');
    toast({
      title: 'Success',
      description: 'Logged out successfully',
    });
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
