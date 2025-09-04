import { AUTH_ENDPOINTS } from 'constants/endpoints';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export interface User {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  role: 'admin' | 'subscriber';
  created_at: string;
  updated_at: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
}

export const authAPI = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await fetch('http://localhost:8000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const error: ApiError = await response.json();
      throw new Error(error.message || 'Login failed');
    }

    return response.json();
  },

  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await fetch('http://localhost:8000/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error: ApiError = await response.json();
      throw new Error(error.message || 'Registration failed');
    }

    return response.json();
  },

  async logout(): Promise<void> {
    const token = localStorage.getItem('auth_token');
    if (!token) return;

    const response = await fetch('http://localhost:8000/api/auth/logout', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Logout failed');
    }
  },

  async getCurrentUser(): Promise<User> {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      throw new Error('No token found');
    }

    const response = await fetch('http://localhost:8000/api/auth/user', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to get user data');
    }

    return response.json();
  },
};
