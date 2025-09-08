export const API_BASE_URL = 'http://localhost:8000/api';

export const AUTH_ENDPOINTS = {
  LOGIN: `${API_BASE_URL}/auth/login`,
  USER: `${API_BASE_URL}/auth/user`,
};

export const ADMIN_ENDPOINTS = {
  UPLOAD_DOCUMENT: `${API_BASE_URL}/admin/documents`,
  GET_DOCUMENTS: `${API_BASE_URL}/admin/documents`,
  UPDATE_DOCUMENT: `${API_BASE_URL}/admin/documents`,
  TOGGLE_DOCUMENT_STATUS: `${API_BASE_URL}/admin/documents`,
  DELETE_DOCUMENT: `${API_BASE_URL}/admin/documents`,
};

