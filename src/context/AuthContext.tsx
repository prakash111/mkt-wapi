import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { CurrentUser } from '@/types';
import { clearSession, getSession, saveSession } from '@/services/storage';
import { login as loginApi } from '@/services/api/modules';

type AuthContextValue = {
  ready: boolean;
  token: string | null;
  user: CurrentUser | null;
  signIn: (identifier: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<CurrentUser | null>(null);

  useEffect(() => {
    getSession()
      .then((session) => {
        if (session) {
          setToken(session.token);
          setUser(session.user);
        }
      })
      .finally(() => setReady(true));
  }, []);

  const signIn = useCallback(async (identifier: string, password: string) => {
    const response = await loginApi(identifier, password);
    if (!response.success || !response.token) {
      throw new Error(response.message || 'Login failed');
    }
    await saveSession(response.token, response.user);
    setToken(response.token);
    setUser(response.user);
  }, []);

  const signOut = useCallback(async () => {
    await clearSession();
    setToken(null);
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ ready, token, user, signIn, signOut }),
    [ready, token, user, signIn, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const value = useContext(AuthContext);
  if (!value) throw new Error('useAuth must be used within AuthProvider');
  return value;
}
