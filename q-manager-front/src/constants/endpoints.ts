export const API_BASE_URL = 'http://127.0.0.1:8000/api';

export const AUTH_ENDPOINTS = {
  LOGIN: `${API_BASE_URL}/auth/login`,
  REGISTER: `${API_BASE_URL}/auth/register`,
  LOGOUT: `${API_BASE_URL}/auth/logout`,
  USER: `${API_BASE_URL}/auth/user`,
  REFRESH: `${API_BASE_URL}/auth/refresh`,
} as const;

export const USER_ENDPOINTS = {
  PROFILE: `${API_BASE_URL}/users/profile`,
  UPDATE: `${API_BASE_URL}/users/update`,
} as const;

export const API_ENDPOINTS = {
  PING: `${API_BASE_URL}/ping`,
  USERS: `${API_BASE_URL}/users`,
} as const;
