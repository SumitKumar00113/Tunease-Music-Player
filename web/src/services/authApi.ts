import { User, AuthResponse } from '../types';

export const AUTH_BASE_URL =
  process.env.NEXT_PUBLIC_AUTH_API_URL || 'http://localhost:3000/api/auth';

export function getAuthHeaders(): Record<string, string> {
  if (typeof window === 'undefined') return {};
  const token = localStorage.getItem('accessToken') || localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export const authApi = {
  async getMe(): Promise<User | null> {
    try {
      const response = await fetch(`${AUTH_BASE_URL}/me`, {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
        },
      });
      if (response.ok) {
        const data = await response.json();
        return data.user || null;
      }
      return null;
    } catch (err) {
      console.warn('Auth backend unreachable:', err);
      return null;
    }
  },

  async login(payload: { email?: string; mobileNo?: string; password?: string }): Promise<{
    success: boolean;
    user?: User;
    message?: string;
  }> {
    try {
      const res = await fetch(`${AUTH_BASE_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload),
      });
      const data: AuthResponse = await res.json();
      if (!res.ok) {
        return { success: false, message: data.message || 'Login failed' };
      }
      if (data.accessToken && typeof window !== 'undefined') {
        localStorage.setItem('accessToken', data.accessToken);
      }
      return { success: true, user: data.user };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Login failed';
      return { success: false, message: msg };
    }
  },

  async register(payload: {
    fullName: { firstName: string; lastName: string } | string;
    email: string;
    password?: string;
    mobileNo?: string;
    role?: 'user' | 'artist';
  }): Promise<{
    success: boolean;
    user?: User;
    message?: string;
  }> {
    try {
      const res = await fetch(`${AUTH_BASE_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload),
      });
      const data: AuthResponse = await res.json();
      if (!res.ok) {
        return { success: false, message: data.message || 'Registration failed' };
      }
      if (data.accessToken && typeof window !== 'undefined') {
        localStorage.setItem('accessToken', data.accessToken);
      }
      return { success: true, user: data.user };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Registration failed';
      return { success: false, message: msg };
    }
  },

  async updateProfile(payload: {
    firstName?: string;
    lastName?: string;
    mobileNo?: string | null;
    profilePhoto?: string;
    role?: string;
  }): Promise<{ success: boolean; user?: User; message?: string }> {
    try {
      const res = await fetch(`${AUTH_BASE_URL}/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
        },
        credentials: 'include',
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, message: data.message || 'Profile update failed' };
      }
      return { success: true, user: data.user };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Profile update error';
      return { success: false, message: msg };
    }
  },

  async logout(): Promise<void> {
    try {
      await fetch(`${AUTH_BASE_URL}/logout`, {
        method: 'POST',
        credentials: 'include',
        headers: getAuthHeaders(),
      });
    } catch (err) {
      console.warn('Logout error:', err);
    } finally {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('token');
      }
    }
  },

  async requestEmailOTP(): Promise<{ success: boolean; message: string }> {
    try {
      const res = await fetch(`${AUTH_BASE_URL}/requestEmailOTP`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
        },
      });
      const data = await res.json();
      return { success: res.ok, message: data.message || '' };
    } catch (err: unknown) {
      return { success: false, message: err instanceof Error ? err.message : 'Failed to request OTP' };
    }
  },

  async verifyEmailOtp(otp: string): Promise<{ success: boolean; message: string; user?: User }> {
    try {
      const res = await fetch(`${AUTH_BASE_URL}/verifyEmailOtp`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
        },
        body: JSON.stringify({ otp }),
      });
      const data = await res.json();
      return { success: res.ok, message: data.message || '', user: data.user };
    } catch (err: unknown) {
      return { success: false, message: err instanceof Error ? err.message : 'Failed to verify OTP' };
    }
  },
};
