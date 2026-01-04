import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { signIn, signUp } from '../services/authService';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<{ success: boolean; error: string | null }>;
  register: (username: string, password: string, email?: string) => Promise<{ success: boolean; error: string | null }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem('beastflow_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        localStorage.removeItem('beastflow_user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (username: string, password: string) => {
    const { user: loggedInUser, error } = await signIn(username, password);
    if (loggedInUser) {
      setUser(loggedInUser);
      localStorage.setItem('beastflow_user', JSON.stringify(loggedInUser));
      return { success: true, error: null };
    }
    return { success: false, error: error || 'Login failed' };
  };

  const register = async (username: string, password: string, email?: string) => {
    const { user: newUser, error } = await signUp(username, password, email);
    if (newUser) {
      setUser(newUser);
      localStorage.setItem('beastflow_user', JSON.stringify(newUser));
      return { success: true, error: null };
    }
    return { success: false, error: error || 'Registration failed' };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('beastflow_user');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

