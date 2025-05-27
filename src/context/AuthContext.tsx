import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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

// Demo user data
const DEMO_USERS = {
  tenant: {
    id: '22222222-2222-2222-2222-222222222222',
    email: 'tenant@test.com',
    user_metadata: { role: 'tenant' }
  } as unknown as User,
  landlord: {
    id: '11111111-1111-1111-1111-111111111111',
    email: 'landlord@test.com',
    user_metadata: { role: 'landlord' }
  } as unknown as User,
  admin: {
    id: '99999999-9999-9999-9999-999999999999',
    email: 'admin@test.com',
    user_metadata: { role: 'admin' }
  } as unknown as User
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isTenant, setIsTenant] = useState(false);
  const [isLandlord, setIsLandlord] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const storedSession = localStorage.getItem('demoUserSession');
    if (storedSession) {
      try {
        const sessionData = JSON.parse(storedSession);
        setUser(sessionData.user as User);
        setIsAuthenticated(true);
        setIsTenant(sessionData.isTenant);
        setIsLandlord(sessionData.isLandlord);
      } catch (error) {
        console.error('Error restoring session:', error);
        localStorage.removeItem('demoUserSession');
      }
    }
    setIsLoading(false);
  }, []);

  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      let demoUser;
      let isTenantUser = false;
      let isLandlordUser = false;

      if (email === 'tenant@test.com') {
        demoUser = DEMO_USERS.tenant;
        isTenantUser = true;

        // Update state with demo user data
        setUser(demoUser);
        setIsAuthenticated(true);
        setIsTenant(true);
        setIsLandlord(false);

        // Store session in localStorage
        localStorage.setItem('demoUserSession', JSON.stringify({
          user: demoUser,
          isTenant: true,
          isLandlord: false
        }));

        navigate('/tenant/dashboard');
      } else if (email === 'landlord@test.com') {
        demoUser = DEMO_USERS.landlord;
        isLandlordUser = true;

        // Update state with demo user data
        setUser(demoUser);
        setIsAuthenticated(true);
        setIsTenant(false);
        setIsLandlord(true);

        // Store session in localStorage
        localStorage.setItem('demoUserSession', JSON.stringify({
          user: demoUser,
          isTenant: false,
          isLandlord: true
        }));

        navigate('/dashboard');
      } else if (email === 'admin@test.com') {
        demoUser = DEMO_USERS.admin;

        // Admin can access both tenant and landlord views
        setUser(demoUser);
        setIsAuthenticated(true);
        setIsTenant(true);
        setIsLandlord(true);

        // Store session in localStorage
        localStorage.setItem('demoUserSession', JSON.stringify({
          user: demoUser,
          isTenant: true,
          isLandlord: true
        }));

        navigate('/dashboard'); // Admin goes to landlord dashboard by default
      } else {
        // Handle invalid login
        console.error('Invalid demo credentials');
        alert('Please use one of the demo accounts: tenant@test.com, landlord@test.com, or admin@test.com');
      }
    } catch (error) {
      console.error('Error signing in:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, password: string, options?: { data?: Record<string, any> }) => {
    // Demo mode - no actual signup needed
    console.log('Sign up called with', email, 'in demo mode');
  };

  const signOut = async () => {
    localStorage.removeItem('demoUserSession');
    setUser(null);
    setIsAuthenticated(false);
    setIsTenant(false);
    setIsLandlord(false);
    navigate('/');
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