import React, { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import type { User } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isTenant: boolean;
  isLandlord: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, options?: { data?: Record<string, any> }) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isTenant, setIsTenant] = useState(false);
  const [isLandlord, setIsLandlord] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const currentUser = await authService.getCurrentUser();
        setUser(currentUser);
        setIsAuthenticated(!!currentUser);
        
        if (currentUser?.user_metadata?.role) {
          setIsTenant(currentUser.user_metadata.role === 'tenant');
          setIsLandlord(currentUser.user_metadata.role === 'landlord');
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        setUser(null);
        setIsAuthenticated(false);
        setIsTenant(false);
        setIsLandlord(false);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();

    const { data: { subscription } } = authService.onAuthStateChange((user) => {
      setUser(user);
      setIsAuthenticated(!!user);
      
      if (user?.user_metadata?.role) {
        setIsTenant(user.user_metadata.role === 'tenant');
        setIsLandlord(user.user_metadata.role === 'landlord');
      } else {
        setIsTenant(false);
        setIsLandlord(false);
      }
      
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { user } = await authService.signIn(email, password);
      setUser(user);
      setIsAuthenticated(!!user);
      
      if (user?.user_metadata?.role) {
        setIsTenant(user.user_metadata.role === 'tenant');
        setIsLandlord(user.user_metadata.role === 'landlord');
        
        // Navigate based on role after successful sign in
        if (user.user_metadata.role === 'tenant') {
          navigate('/tenant/dashboard');
        } else if (user.user_metadata.role === 'landlord') {
          navigate('/dashboard');
        }
      }
    } catch (error) {
      setUser(null);
      setIsAuthenticated(false);
      setIsTenant(false);
      setIsLandlord(false);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, password: string, options?: { data?: Record<string, any> }) => {
    setIsLoading(true);
    try {
      const { user } = await authService.signUp(email, password, options);
      setUser(user);
      setIsAuthenticated(!!user);
      
      if (user?.user_metadata?.role) {
        setIsTenant(user.user_metadata.role === 'tenant');
        setIsLandlord(user.user_metadata.role === 'landlord');
      }
    } catch (error) {
      setUser(null);
      setIsAuthenticated(false);
      setIsTenant(false);
      setIsLandlord(false);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    setIsLoading(true);
    try {
      await authService.signOut();
      navigate('/');
    } finally {
      setUser(null);
      setIsAuthenticated(false);
      setIsTenant(false);
      setIsLandlord(false);
      setIsLoading(false);
    }
  };

  const value = {
    user,
    isAuthenticated,
    isLoading,
    isTenant,
    isLandlord,
    signIn,
    signUp,
    signOut
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={value}>
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