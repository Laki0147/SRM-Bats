/**
 * useAuth Hook
 * Provides authentication operations and state
 */

import { useAuthStore } from '@/store';
import { useUIStore } from '@/store';
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

export const useAuth = () => {
  const {
    user,
    token,
    isAuthenticated,
    isLoading,
    error,
    login,
    logout,
    updateProfile,
    clearError,
  } = useAuthStore();

  const { addToast } = useUIStore();
  const navigate = useNavigate();

  // Login with error handling
  const handleLogin = useCallback(
    async (email: string, password: string) => {
      try {
        await login(email, password);
        addToast({
          type: 'success',
          message: 'Welcome back!',
          duration: 3000,
        });
        navigate('/');
      } catch (error) {
        addToast({
          type: 'error',
          message: error instanceof Error ? error.message : 'Login failed',
          duration: 5000,
        });
      }
    },
    [login, addToast, navigate]
  );

  // Logout with confirmation
  const handleLogout = useCallback(() => {
    logout();
    addToast({
      type: 'info',
      message: 'You have been logged out',
      duration: 3000,
    });
    navigate('/login');
  }, [logout, addToast, navigate]);

  // Update profile with toast
  const handleUpdateProfile = useCallback(
    async (updates: Parameters<typeof updateProfile>[0]) => {
      try {
        updateProfile(updates);
        addToast({
          type: 'success',
          message: 'Profile updated successfully',
          duration: 3000,
        });
      } catch (error) {
        addToast({
          type: 'error',
          message: error instanceof Error ? error.message : 'Update failed',
          duration: 5000,
        });
      }
    },
    [updateProfile, addToast]
  );

  return {
    // State
    user,
    token,
    isAuthenticated,
    isLoading,
    error,

    // Actions
    login: handleLogin,
    logout: handleLogout,
    updateProfile: handleUpdateProfile,
    clearError,

    // Helpers
    isAdmin: user?.role === 'admin',
  };
};
