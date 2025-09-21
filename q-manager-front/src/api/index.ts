// Export all API services
export * from './auth';
export * from './news';
export * from './courses';

// Re-export types for convenience
export type { LoginCredentials, RegisterData, AuthResponse, ApiError } from './auth';
export type { NewsItem, NewsCategory, NewsResponse } from './news';
export type { Course, CourseMaterial, CourseCategory, CourseResponse } from './courses';
