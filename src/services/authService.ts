import api from './api';

// ── Types ─────────────────────────────────────────────────────────────────

export interface AuthUser {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  role: string;
  avatar?: string;
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say';
  kycStatus?: string;
  address?: {
    line1?: string;
    city?: string;
    pincode?: string;
    country?: string;
  };
  wallet?: {
    balance: number;
    currency: string;
    isActive: boolean;
  };
}

export interface AuthResponse {
  success: boolean;
  token: string;
  user: AuthUser;
}

export interface RegisterPayload {
  fullName: string;
  email: string;
  phone: string;
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface ProfileUpdatePayload {
  fullName?: string;
  avatar?: string;
  gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say';
  phone?: string;
  address?: {
    line1?: string;
    city?: string;
    pincode?: string;
    country?: string;
  };
}

export interface ProfileResponse {
  success: boolean;
  user: AuthUser;
  message?: string;
}

// ── Auth API calls ────────────────────────────────────────────────────────

export async function registerUser(payload: RegisterPayload): Promise<AuthResponse> {
  try {
    const { data } = await api.post<AuthResponse>('/ft/auth/register', payload);
    return data;
  } catch (err: any) {
    console.error('[authService] registerUser error:', err?.message);
    throw err;
  }
}

export async function loginUser(payload: LoginPayload): Promise<AuthResponse> {
  try {
    const { data } = await api.post<AuthResponse>('/ft/auth/login', payload);
    return data;
  } catch (err: any) {
    console.error('[authService] loginUser error:', err?.message);
    throw err;
  }
}

export async function getProfile(): Promise<ProfileResponse> {
  try {
    const { data } = await api.get<ProfileResponse>('/ft/users/profile');
    return data;
  } catch (err: any) {
    console.error('[authService] getProfile error:', err?.message);
    throw err;
  }
}

export async function updateProfile(payload: ProfileUpdatePayload): Promise<ProfileResponse> {
  try {
    const { data } = await api.put<ProfileResponse>('/ft/users/profile', payload);
    return data;
  } catch (err: any) {
    console.error('[authService] updateProfile error:', err?.message);
    throw err;
  }
}

