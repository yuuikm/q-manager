import { COURSE_ENDPOINTS } from 'constants/endpoints';

export interface Course {
  id: number;
  title: string;
  slug: string;
  description: string;
  content: string;
  price: number;
  featured_image?: string;
  max_students?: number;
  duration_hours?: number;
  requirements?: string;
  learning_outcomes?: string;
  zoom_link?: string;
  is_published: boolean;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
  category?: {
    id: number;
    name: string;
    slug: string;
  };
  author?: {
    id: number;
    username: string;
    first_name?: string;
    last_name?: string;
  };
  materials?: CourseMaterial[];
}

export interface CourseMaterial {
  id: number;
  title: string;
  description: string;
  type: 'video' | 'pdf' | 'doc' | 'link' | 'text';
  file_path?: string;
  file_name?: string;
  file_type?: string;
  file_size?: number;
  external_url?: string;
  content?: string;
  course_id: number;
  created_by: number;
  duration_minutes?: number;
  sort_order: number;
  is_required: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CourseCategory {
  id: number;
  name: string;
  slug: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface CourseResponse {
  data: Course[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export const coursesAPI = {
  async getCourses(params?: {
    page?: number;
    category?: string;
    search?: string;
    featured?: boolean;
  }): Promise<CourseResponse> {
    const url = new URL(COURSE_ENDPOINTS.GET_COURSES);
    
    if (params?.page) url.searchParams.append('page', params.page.toString());
    if (params?.category) url.searchParams.append('category', params.category);
    if (params?.search) url.searchParams.append('search', params.search);
    if (params?.featured !== undefined) url.searchParams.append('featured', params.featured.toString());

    const response = await fetch(url.toString(), {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch courses');
    }

    return response.json();
  },

  async getCourse(id: number): Promise<Course> {
    const response = await fetch(`${COURSE_ENDPOINTS.GET_COURSE}/${id}`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch course');
    }

    return response.json();
  },

  async getCourseCategories(): Promise<CourseCategory[]> {
    const response = await fetch(COURSE_ENDPOINTS.GET_COURSE_CATEGORIES, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch course categories');
    }

    return response.json();
  },

  async getCourseMaterials(courseId: number): Promise<CourseMaterial[]> {
    const response = await fetch(`${COURSE_ENDPOINTS.GET_COURSE_MATERIALS}/${courseId}/materials`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch course materials');
    }

    return response.json();
  },
};
