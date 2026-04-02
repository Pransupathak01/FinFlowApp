import React, {
  createContext, useContext, useState,
  useEffect, useCallback, ReactNode,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { registerUser, loginUser, getProfile, updateProfile } from '../services/authService';
import type { AuthUser, RegisterPayload, LoginPayload, ProfileUpdatePayload } from '../services/authService';

// ── Shape ────────────────────────────────────────────────────────────────
interface AuthState {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (payload: LoginPayload) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<AuthUser>;
  updateUserInfo: (payload: ProfileUpdatePayload) => Promise<void>;
}

const AuthContext = createContext<AuthState | undefined>(undefined);

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';

// ── Provider ─────────────────────────────────────────────────────────────
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Restore session on app boot
  useEffect(() => {
    (async () => {
      try {
        const t = await AsyncStorage.getItem(TOKEN_KEY);
        const u = await AsyncStorage.getItem(USER_KEY);
        if (t && u) {
          setToken(t);
          setUser(JSON.parse(u));
        }
      } catch {
        // corrupted storage – stay logged out
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  // Persist token + user
  const persist = useCallback(async (t: string, u: AuthUser) => {
    await AsyncStorage.setItem(TOKEN_KEY, t);
    await AsyncStorage.setItem(USER_KEY, JSON.stringify(u));
    setToken(t);
    setUser(u);
  }, []);

  const login = useCallback(async (payload: LoginPayload) => {
    const res = await loginUser(payload);
    await persist(res.token, res.user);
  }, [persist]);

  const register = useCallback(async (payload: RegisterPayload) => {
    const res = await registerUser(payload);
    await persist(res.token, res.user);
  }, [persist]);

  const logout = useCallback(async () => {
    await AsyncStorage.removeItem(TOKEN_KEY);
    await AsyncStorage.removeItem(USER_KEY);
    setToken(null);
    setUser(null);
  }, []);

  const refreshProfile = useCallback(async () => {
    const res = await getProfile();
    await AsyncStorage.setItem(USER_KEY, JSON.stringify(res.user));
    setUser(res.user);
    return res.user;
  }, []);

  const updateUserInfo = useCallback(async (payload: ProfileUpdatePayload) => {
    const res = await updateProfile(payload);
    await AsyncStorage.setItem(USER_KEY, JSON.stringify(res.user));
    setUser(res.user);
  }, []);

  return (
    <AuthContext.Provider value={{
      user, token,
      isAuthenticated: !!token,
      isLoading,
      login, register, logout,
      refreshProfile, updateUserInfo,
    }}>
      {children}
    </AuthContext.Provider>
  );
}


// ── Hook ─────────────────────────────────────────────────────────────────
export function useAuth(): AuthState {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
