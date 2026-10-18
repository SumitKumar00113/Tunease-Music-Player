'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { User } from '../types';
import { authApi } from '../services/authApi';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (payload: { email?: string; mobileNo?: string; password?: string }) => Promise<{ success: boolean; message?: string }>;
  register: (payload: {
    fullName: { firstName: string; lastName: string } | string;
    email: string;
    password?: string;
    mobileNo?: string;
    role?: 'user' | 'artist';
  }) => Promise<{ success: boolean; message?: string }>;
  logout: () => Promise<void>;
  updateUser: (updated: Partial<User>) => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    try {
      const currentUser = await authApi.getMe();
      setUser(currentUser);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const login = async (payload: { email?: string; mobileNo?: string; password?: string }) => {
    const res = await authApi.login(payload);
    if (res.success && res.user) {
      setUser(res.user);
      return { success: true };
    }
    return { success: false, message: res.message };
  };

  const register = async (payload: {
    fullName: { firstName: string; lastName: string } | string;
    email: string;
    password?: string;
    mobileNo?: string;
    role?: 'user' | 'artist';
  }) => {
    const res = await authApi.register(payload);
    if (res.success && res.user) {
      setUser(res.user);
      return { success: true };
    }
    return { success: false, message: res.message };
  };

  const logout = async () => {
    await authApi.logout();
    setUser(null);
  };

  const updateUser = (updated: Partial<User>) => {
    setUser((prev) => (prev ? { ...prev, ...updated } : null));
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateUser, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
