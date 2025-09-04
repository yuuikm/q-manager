import { useState, useEffect } from 'react';
import { useAppSelector } from 'store/hooks';
import CategorySelector from 'components/CategorySelector';

interface News {
  id: number;
  title: string;
  slug: string;
  description: string;
  content: string;
  image_path?: string;
  featured_image?: string;
  news_category_id?: number;
  is_published: boolean;
  is_featured: boolean;
  published_at?: string;
  views_count: number;
  likes_count: number;
  comments_count: number;
  created_by: number;
  author: {
    id: number;
    first_name: string;
    last_name: string;
  };
  category?: {
    id: number;
    name: string;
    color: string;
    icon?: string;
  };
  created_at: string;
  updated_at: string;
}

const News = () => {
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingNews, setEditingNews] = useState<News | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: '',
    news_category_id: null as number | null,
    is_published: false,
    is_featured: false,
    published_at: '',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [featuredImageFile, setFeaturedImageFile] = useState<File | null>(null);

  const { user } = useAppSelector((state: any) => state.auth);

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch('http://localhost:8000/api/admin/news', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setNews(data.data || data);
      }
    } catch (error) {
      console.error('Error fetching news:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem('auth_token');
      const formDataToSend = new FormData();
      
      // Add form fields
      Object.entries(formData).forEach(([key, value]) => {
        formDataToSend.append(key, value.toString());
      });

      // Add image files
      if (imageFile) {
        formDataToSend.append('image', imageFile);
      }
      if (featuredImageFile) {
        formDataToSend.append('featured_image', featuredImageFile);
      }

      const url = editingNews 
        ? `http://localhost:8000/api/admin/news/${editingNews.id}`
        : 'http://localhost:8000/api/admin/news';
      
      const method = editingNews ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formDataToSend,
      });

      if (response.ok) {
        await fetchNews();
        setShowModal(false);
        setEditingNews(null);
        resetForm();
      }
    } catch (error) {
      console.error('Error saving news:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      content: '',
      news_category_id: null,
      is_published: false,
      is_featured: false,
      published_at: '',
    });
    setImageFile(null);
    setFeaturedImageFile(null);
  };

  const handleEdit = (newsItem: News) => {
    setEditingNews(newsItem);
    setFormData({
      title: newsItem.title,
      description: newsItem.description,
      content: newsItem.content,
      news_category_id: newsItem.news_category_id || null,
      is_published: newsItem.is_published,
      is_featured: newsItem.is_featured,
      published_at: newsItem.published_at ? newsItem.published_at.split('T')[0] : '',
    });
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this news article?')) return;

    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`http://localhost:8000/api/admin/news/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        await fetchNews();
      } else {
        const error = await response.json();
        alert(error.message || 'Error deleting news article');
      }
    } catch (error) {
      console.error('Error deleting news article:', error);
    }
  };

  const openModal = () => {
    setEditingNews(null);
    resetForm();
    setShowModal(true);
  };

  if (loading) {
    return (
      <div className="admin-card">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="admin-card">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">News Management</h2>
          <button
            onClick={openModal}
            className="admin-button admin-button-primary"
          >
            Add New Article
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                   Article
                 </th>
                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                   Category
                 </th>
                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                   Status
                 </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stats
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Author
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {news.map((newsItem) => (
                <tr key={newsItem.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-start">
                      {newsItem.featured_image && (
                        <img
                          src={`/storage/${newsItem.featured_image}`}
                          alt={newsItem.title}
                          className="w-16 h-16 object-cover rounded-lg mr-4"
                        />
                      )}
                      <div>
                        <div className="text-sm font-medium text-gray-900 mb-1">
                          {newsItem.title}
                        </div>
                        <div className="text-sm text-gray-500 line-clamp-2">
                          {newsItem.description}
                        </div>
                        <div className="text-xs text-gray-400 mt-1">
                          {new Date(newsItem.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                                     </td>
                   <td className="px-6 py-4 whitespace-nowrap">
                     {newsItem.category ? (
                       <div className="flex items-center">
                         {newsItem.category.icon && (
                           <span className="text-lg mr-2">{newsItem.category.icon}</span>
                         )}
                         <span 
                           className="inline-flex px-2 py-1 text-xs font-semibold rounded-full text-white"
                           style={{ backgroundColor: newsItem.category.color }}
                         >
                           {newsItem.category.name}
                         </span>
                       </div>
                     ) : (
                       <span className="text-gray-400 text-sm">No category</span>
                     )}
                   </td>
                   <td className="px-6 py-4 whitespace-nowrap">
                     <div className="space-y-1">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          newsItem.is_published
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {newsItem.is_published ? 'Published' : 'Draft'}
                      </span>
                      {newsItem.is_featured && (
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                          Featured
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="space-y-1">
                      <div>👁️ {newsItem.views_count} views</div>
                      <div>❤️ {newsItem.likes_count} likes</div>
                      <div>💬 {newsItem.comments_count} comments</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {newsItem.author.first_name} {newsItem.author.last_name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleEdit(newsItem)}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(newsItem.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-5 border w-4/5 max-w-4xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {editingNews ? 'Edit News Article' : 'Add New News Article'}
              </h3>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Published Date
                    </label>
                    <input
                      type="date"
                      value={formData.published_at}
                      onChange={(e) => setFormData({ ...formData, published_at: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">
                     Description *
                   </label>
                   <textarea
                     required
                     value={formData.description}
                     onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                     rows={3}
                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                   />
                 </div>

                 <CategorySelector
                   type="news"
                   selectedCategoryId={formData.news_category_id}
                   onCategoryChange={(categoryId) => setFormData({ ...formData, news_category_id: categoryId })}
                 />

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Content *
                  </label>
                  <textarea
                    required
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    rows={8}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Featured Image
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setFeaturedImageFile(e.target.files?.[0] || null)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Article Image
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-6">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="is_published"
                      checked={formData.is_published}
                      onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="is_published" className="ml-2 block text-sm text-gray-900">
                      Published
                    </label>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="is_featured"
                      checked={formData.is_featured}
                      onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="is_featured" className="ml-2 block text-sm text-gray-900">
                      Featured
                    </label>
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="admin-button admin-button-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="admin-button admin-button-primary"
                  >
                    {editingNews ? 'Update' : 'Create'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default News;
