export const API_BASE_URL = 'http://127.0.0.1:8000/api';

export const AUTH_ENDPOINTS = {
  LOGIN: `${API_BASE_URL}/auth/login`,
  REGISTER: `${API_BASE_URL}/auth/register`,
  LOGOUT: `${API_BASE_URL}/auth/logout`,
  USER: `${API_BASE_URL}/auth/user`,
};

export const ADMIN_ENDPOINTS = {
  UPLOAD_DOCUMENT: `${API_BASE_URL}/admin/documents/upload`,
  GET_DOCUMENTS: `${API_BASE_URL}/admin/documents`,
  GET_DOCUMENT: `${API_BASE_URL}/admin/documents`,
  UPDATE_DOCUMENT: `${API_BASE_URL}/admin/documents`,
  DELETE_DOCUMENT: `${API_BASE_URL}/admin/documents`,
  GET_CATEGORIES: `${API_BASE_URL}/admin/categories`,
};

export const API_ENDPOINTS = {
  ...AUTH_ENDPOINTS,
  ...ADMIN_ENDPOINTS,
};
