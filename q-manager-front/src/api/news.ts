import { NEWS_ENDPOINTS } from 'constants/endpoints';

export interface NewsItem {
  id: number;
  title: string;
  slug: string;
  description: string;
  content: string;
  image_path?: string;
  is_published: boolean;
  is_featured: boolean;
  published_at?: string;
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
}

export interface NewsCategory {
  id: number;
  name: string;
  slug: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface NewsResponse {
  data: NewsItem[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export const newsAPI = {
  async getNews(params?: {
    page?: number;
    category?: string;
    search?: string;
    featured?: boolean;
  }): Promise<NewsResponse> {
    const url = new URL(NEWS_ENDPOINTS.GET_NEWS);
    
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
      throw new Error('Failed to fetch news');
    }

    return response.json();
  },

  async getNewsItem(id: number): Promise<NewsItem> {
    const response = await fetch(`${NEWS_ENDPOINTS.GET_NEWS_ITEM}/${id}`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch news item');
    }

    return response.json();
  },

  async getNewsCategories(): Promise<NewsCategory[]> {
    const response = await fetch(NEWS_ENDPOINTS.GET_NEWS_CATEGORIES, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch news categories');
    }

    return response.json();
  },
};
