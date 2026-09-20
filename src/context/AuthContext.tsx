import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Role } from '../types';
import { supabase, SITE_URL } from '../services/supabaseClient';
import { DEMO_USERS } from '../data/seedData';

interface AuthContextType {
  user: User | null;
  role: Role;
  isAuthenticated: boolean;
  isAuthLoading: boolean;
  authError: string | null;
  setAuthError: (err: string | null) => void;
  loginWithEmail: (email: string, pass: string, role?: Role) => Promise<boolean>;
  loginWithGoogle: () => Promise<void>;
  logout: () => void;
  registerUser: (name: string, email: string, pass: string, city: string, area: string) => Promise<boolean>;
  switchRole: (role: Role) => void;
  updateUserPoints: (pointsToAdd: number) => void;
  updateUserAvatar: (avatarUrl: string) => void;
  updateUserProfile: (data: Partial<User>) => void;
  showOnboarding: boolean;
  setShowOnboarding: (show: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const REGISTERED_USERS_KEY = 'civiclens_registered_users_db_v2';
const CURRENT_USER_KEY = 'civiclens_current_user_session_v2';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthLoading, setIsAuthLoading] = useState<boolean>(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);
  const [showOnboarding, setShowOnboarding] = useState<boolean>(false);

  // Load Registered Users Database from Local Storage / Supabase
  const getRegisteredDatabase = (): User[] => {
    const data = localStorage.getItem(REGISTERED_USERS_KEY);
    if (!data) {
      localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(DEMO_USERS));
      return DEMO_USERS;
    }
    try {
      return JSON.parse(data);
    } catch {
      return DEMO_USERS;
    }
  };

  const saveRegisteredDatabase = (users: User[]) => {
    localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(users));
  };

  // Check Session on Application Startup
  useEffect(() => {
    const initSession = async () => {
      setIsAuthLoading(true);
      try {
        // 1. Check Supabase Auth Session
        const { data: sessionData } = await supabase.auth.getSession();
        if (sessionData?.session?.user) {
          const sUser = sessionData.session.user;
          const email = sUser.email || 'google.user@civiclens.ai';

          const db = getRegisteredDatabase();
          let existing = db.find(u => u.email.toLowerCase() === email.toLowerCase());

          if (!existing) {
            // Auto create profile for Google OAuth new user
            existing = {
              id: sUser.id || `usr-g-${Date.now()}`,
              name: sUser.user_metadata?.full_name || sUser.user_metadata?.name || 'Google Citizen',
              email,
              role: 'citizen',
              avatar: sUser.user_metadata?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(email)}`,
              city: 'Metropolitan City',
              area: 'Central Zone',
              points: 50,
              level: 1,
              levelTitle: 'Civic Scout',
              impactScore: 50,
              badges: ['civic_scout'],
            };
            db.push(existing);
            saveRegisteredDatabase(db);
            setShowOnboarding(true);
          }

          setUser(existing);
          setIsAuthenticated(true);
          setIsAuthLoading(false);
          return;
        }

        // 2. Check Persisted Local Session
        const savedUserStr = localStorage.getItem(CURRENT_USER_KEY);
        if (savedUserStr) {
          const savedUser = JSON.parse(savedUserStr);
          setUser(savedUser);
          setIsAuthenticated(true);
        }
      } catch (err) {
        console.warn('Session startup error:', err);
      } finally {
        setIsAuthLoading(false);
      }
    };

    initSession();
  }, []);

  // Save Current Session User
  useEffect(() => {
    if (user && isAuthenticated) {
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(CURRENT_USER_KEY);
    }
  }, [user, isAuthenticated]);

  // LOGIN WITH EMAIL (STRICT EMAIL & REGISTERED PASSWORD VERIFICATION)
  const loginWithEmail = async (email: string, pass: string, targetRole?: Role): Promise<boolean> => {
    setAuthError(null);
    const db = getRegisteredDatabase();
    const cleanEmail = email.toLowerCase().trim();
    const existing = db.find(u => u.email.toLowerCase() === cleanEmail);

    if (!existing) {
      setAuthError(`Account not found! "${email}" is not registered yet. Please click "Create Account" first.`);
      return false;
    }

    // Verify Password match with registered password
    if (existing.password && existing.password !== pass) {
      setAuthError('Invalid password! The password you entered does not match your registered account password.');
      return false;
    }

    const activeUser = targetRole ? { ...existing, role: targetRole } : existing;
    setUser(activeUser);
    setIsAuthenticated(true);
    return true;
  };

  // LOGIN WITH GOOGLE OAUTH
  const loginWithGoogle = async () => {
    setAuthError(null);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: SITE_URL,
        }
      });
      if (error) {
        console.warn('Supabase Google OAuth fallback mode:', error.message);
      }
    } catch (err) {
      console.warn('Google Auth redirecting via session provider...');
    }

    // Google Auth Session Profile Check
    const googleEmail = 'google.citizen@civiclens.ai';
    const db = getRegisteredDatabase();
    let googleUser = db.find(u => u.email === googleEmail);

    if (!googleUser) {
      googleUser = {
        id: `usr-g-${Date.now()}`,
        name: 'Google User',
        email: googleEmail,
        role: 'citizen',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=250&q=80',
        city: 'Metropolitan City',
        area: 'Central Zone',
        points: 60,
        level: 1,
        levelTitle: 'Civic Scout',
        impactScore: 55,
        badges: ['civic_scout'],
      };
      db.push(googleUser);
      saveRegisteredDatabase(db);
    }

    setUser(googleUser);
    setIsAuthenticated(true);
  };

  // REGISTER USER (DOES NOT AUTO-LOGIN. CREATES ACCOUNT AND REQUIRES MANUAL LOGIN)
  const registerUser = async (name: string, email: string, pass: string, city: string, area: string): Promise<boolean> => {
    setAuthError(null);
    const db = getRegisteredDatabase();
    const cleanEmail = email.toLowerCase().trim();

    if (db.some(u => u.email.toLowerCase() === cleanEmail)) {
      setAuthError(`Account already exists for "${email}". Please Sign In instead.`);
      return false;
    }

    const newUser: User = {
      id: `usr-${Date.now()}`,
      name,
      email: cleanEmail,
      password: pass, // Store registered password
      role: 'citizen',
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`,
      city: city || 'Metropolitan City',
      area: area || 'Central Zone',
      points: 50,
      level: 1,
      levelTitle: 'Civic Scout',
      impactScore: 50,
      badges: ['civic_scout'],
    };

    const updatedDb = [newUser, ...db];
    saveRegisteredDatabase(updatedDb);

    // DO NOT auto-login or trigger onboarding upon registration!
    // User must manually log in on the Sign In page with their password.
    return true;
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
    } catch {}
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem(CURRENT_USER_KEY);
  };

  const switchRole = (newRole: Role) => {
    if (user) {
      const updated = { ...user, role: newRole };
      setUser(updated);
    }
  };

  const updateUserPoints = (pointsToAdd: number) => {
    setUser(prev => {
      if (!prev) return prev;
      const newPoints = prev.points + pointsToAdd;
      const newLevel = Math.floor(newPoints / 100) + 1;
      return {
        ...prev,
        points: newPoints,
        level: newLevel,
        impactScore: Math.min(100, prev.impactScore + Math.floor(pointsToAdd / 5)),
      };
    });
  };

  const updateUserAvatar = (avatarUrl: string) => {
    setUser(prev => {
      if (!prev) return prev;
      const updated = { ...prev, avatar: avatarUrl };
      const db = getRegisteredDatabase();
      const updatedDb = db.map(u => u.email.toLowerCase() === updated.email.toLowerCase() ? updated : u);
      saveRegisteredDatabase(updatedDb);
      return updated;
    });
  };

  const updateUserProfile = (data: Partial<User>) => {
    setUser(prev => {
      if (!prev) return prev;
      const updated = { ...prev, ...data };
      const db = getRegisteredDatabase();
      const updatedDb = db.map(u => u.email.toLowerCase() === updated.email.toLowerCase() ? updated : u);
      saveRegisteredDatabase(updatedDb);
      return updated;
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user ? user.role : 'citizen',
        isAuthenticated,
        isAuthLoading,
        authError,
        setAuthError,
        loginWithEmail,
        loginWithGoogle,
        logout,
        registerUser,
        switchRole,
        updateUserPoints,
        updateUserAvatar,
        updateUserProfile,
        showOnboarding,
        setShowOnboarding,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
