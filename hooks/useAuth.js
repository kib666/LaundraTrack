'use client';

import { useSession, signIn, signOut } from 'next-auth/react';
import { useCallback } from 'react';

/**
 * Custom hook for authentication
 */
export const useAuth = () => {
  const { data: session, status } = useSession();

  const isAuthenticated = status === 'authenticated';
  const isLoading = status === 'loading';
  const user = session?.user;

  const login = useCallback(
    async (email, password) => {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });
      return result;
    },
    []
  );

  const logout = useCallback(async () => {
    await signOut({ redirect: true, callbackUrl: '/' });
  }, []);

  return {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    session,
  };
};