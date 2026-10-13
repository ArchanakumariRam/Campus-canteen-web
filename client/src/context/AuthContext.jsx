import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('rit_auth_user');
      if (!saved || saved === 'null' || saved === 'undefined') return null;
      return JSON.parse(saved);
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('rit_auth_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('rit_auth_user');
    }
  }, [currentUser]);

  const switchUser = (account) => {
    setCurrentUser(account);
  };

  const topupWallet = async (amount = 100) => {
    if (!currentUser?.userId) return;
    try {
      const res = await api.topupWallet(currentUser.userId, amount);
      if (res.success && res.walletBalance !== undefined) {
        setCurrentUser(prev => ({ ...prev, walletBalance: res.walletBalance }));
      } else {
        setCurrentUser(prev => ({ ...prev, walletBalance: (prev?.walletBalance || 0) + amount }));
      }
    } catch {
      setCurrentUser(prev => ({ ...prev, walletBalance: (prev?.walletBalance || 0) + amount }));
    }
  };

  const deductWallet = (amount) => {
    setCurrentUser(prev => {
      if (!prev) return null;
      return {
        ...prev,
        walletBalance: Math.max(0, (prev?.walletBalance || 0) - amount)
      };
    });
  };

  const login = async (email, password) => {
    try {
      const res = await api.login(email, password);
      if (res.success && res.data) {
        setCurrentUser(res.data);
        return { success: true, user: res.data };
      }
      return { success: false, message: res.message || 'Invalid email or password' };
    } catch {
      return { success: false, message: 'Could not connect to authentication server' };
    }
  };

  const register = async (userData) => {
    try {
      const res = await api.register(userData);
      if (res.success && res.data) {
        setCurrentUser(res.data);
        return { success: true, user: res.data };
      }
      return { success: false, message: res.message || 'Registration failed' };
    } catch {
      return { success: false, message: 'Could not connect to authentication server' };
    }
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('rit_auth_user');
  };

  return (
    <AuthContext.Provider value={{ currentUser, switchUser, topupWallet, deductWallet, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
