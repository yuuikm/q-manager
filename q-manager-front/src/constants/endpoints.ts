export const API_BASE_URL = 'http://localhost:8000/api';

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

export const DOCUMENT_ENDPOINTS = {
  GET_DOCUMENTS: `${API_BASE_URL}/documents`,
  GET_DOCUMENT: `${API_BASE_URL}/documents`,
  GET_CATEGORIES: `${API_BASE_URL}/categories`,
  DOWNLOAD_DOCUMENT: `${API_BASE_URL}/documents`,
  PREVIEW_DOCUMENT: `${API_BASE_URL}/documents`,
  PURCHASE_DOCUMENT: `${API_BASE_URL}/documents`,
  USER_PURCHASED_DOCUMENTS: `${API_BASE_URL}/user/purchased-documents`,
} as const;

export const NEWS_ENDPOINTS = {
  GET_NEWS: `${API_BASE_URL}/news`,
  GET_NEWS_ITEM: `${API_BASE_URL}/news`,
  GET_NEWS_CATEGORIES: `${API_BASE_URL}/news-categories`,
} as const;

export const COURSE_ENDPOINTS = {
  GET_COURSES: `${API_BASE_URL}/courses`,
  GET_COURSE: `${API_BASE_URL}/courses`,
  GET_COURSE_CATEGORIES: `${API_BASE_URL}/course-categories`,
  GET_COURSE_MATERIALS: `${API_BASE_URL}/courses`,
} as const;

export const API_ENDPOINTS = {
  PING: `${API_BASE_URL}/ping`,
  USERS: `${API_BASE_URL}/users`,
  ...DOCUMENT_ENDPOINTS,
  ...NEWS_ENDPOINTS,
  ...COURSE_ENDPOINTS,
} as const;
