import api from './api';

// ── Types ─────────────────────────────────────────────────────────────────

export interface AuthUser {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  role: string;
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

// ── Auth API calls ────────────────────────────────────────────────────────

export async function registerUser(payload: RegisterPayload): Promise<AuthResponse> {
  try {
    const { data } = await api.post<AuthResponse>('/ft/auth/register', payload);
    console.log('[authService] registerUser → success:', JSON.stringify(data, null, 2));
    return data;
  } catch (err: any) {
    console.error('[authService] registerUser → full URL attempted:', `${api.defaults.baseURL}/ft/auth/register`);
    throw err;
  }
}

export async function loginUser(payload: LoginPayload): Promise<AuthResponse> {
  try {
    const { data } = await api.post<AuthResponse>('/ft/auth/login', payload);
    console.log('[authService] loginUser → success:', JSON.stringify(data, null, 2));
    return data;
  } catch (err: any) {
    console.error('[authService] loginUser → full URL attempted:', `${api.defaults.baseURL}/ft/auth/login`);
    throw err;
  }
}
