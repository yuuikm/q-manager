export const API_BASE_URL = 'http://localhost:8000/api';

export const AUTH_ENDPOINTS = {
  LOGIN: `${API_BASE_URL}/auth/login`,
  REGISTER: `${API_BASE_URL}/auth/register`,
  LOGOUT: `${API_BASE_URL}/auth/logout`,
  USER: `${API_BASE_URL}/auth/user`,
};

export const ADMIN_ENDPOINTS = {
  UPLOAD_DOCUMENT: `${API_BASE_URL}/admin/documents`,
  GET_DOCUMENTS: `${API_BASE_URL}/admin/documents`,
  GET_DOCUMENT: `${API_BASE_URL}/admin/documents`,
  UPDATE_DOCUMENT: `${API_BASE_URL}/admin/documents`,
  DELETE_DOCUMENT: `${API_BASE_URL}/admin/documents`,
  NEWS: `${API_BASE_URL}/admin/news`,
  COURSES: `${API_BASE_URL}/admin/courses`,
  TESTS: `${API_BASE_URL}/admin/tests`,
};

export const API_ENDPOINTS = {
  ...AUTH_ENDPOINTS,
  ...ADMIN_ENDPOINTS,
};
