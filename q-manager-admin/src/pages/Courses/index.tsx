import { useState, useEffect } from 'react';
import { useAppSelector } from 'store/hooks';

interface Course {
  id: number;
  title: string;
  slug: string;
  description: string;
  content: string;
  price: number;
  type: 'online' | 'self_learning' | 'offline';
  category: string;
  featured_image?: string;
  certificate_template?: string;
  max_students?: number;
  current_students: number;
  duration_hours?: number;
  requirements?: string;
  learning_outcomes?: string;
  zoom_link?: string;
  schedule?: any;
  is_published: boolean;
  is_featured: boolean;
  views_count: number;
  enrollments_count: number;
  completion_rate: number;
  created_by: number;
  author: {
    id: number;
    first_name: string;
    last_name: string;
  };
  created_at: string;
  updated_at: string;
}

const Courses = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: '',
    price: 0,
    type: 'online' as 'online' | 'self_learning' | 'offline',
    category: '',
    max_students: '',
    duration_hours: '',
    requirements: '',
    learning_outcomes: '',
    zoom_link: '',
    is_published: false,
    is_featured: false,
  });
  const [featuredImageFile, setFeaturedImageFile] = useState<File | null>(null);
  const [certificateTemplateFile, setCertificateTemplateFile] = useState<File | null>(null);

  const { user } = useAppSelector((state: any) => state.auth);

  useEffect(() => {
    fetchCourses();
    fetchCategories();
  }, []);

  const fetchCourses = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch('http://localhost:8000/api/admin/courses', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setCourses(data.data || data);
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch('http://localhost:8000/api/admin/categories', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setCategories(data.map((cat: any) => cat.name));
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
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
      if (featuredImageFile) {
        formDataToSend.append('featured_image', featuredImageFile);
      }
      if (certificateTemplateFile) {
        formDataToSend.append('certificate_template', certificateTemplateFile);
      }

      const url = editingCourse 
        ? `http://localhost:8000/api/admin/courses/${editingCourse.id}`
        : 'http://localhost:8000/api/admin/courses';
      
      const method = editingCourse ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formDataToSend,
      });

      if (response.ok) {
        await fetchCourses();
        setShowModal(false);
        setEditingCourse(null);
        resetForm();
      }
    } catch (error) {
      console.error('Error saving course:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      content: '',
      price: 0,
      type: 'online',
      category: '',
      max_students: '',
      duration_hours: '',
      requirements: '',
      learning_outcomes: '',
      zoom_link: '',
      is_published: false,
      is_featured: false,
    });
    setFeaturedImageFile(null);
    setCertificateTemplateFile(null);
  };

  const handleEdit = (course: Course) => {
    setEditingCourse(course);
    setFormData({
      title: course.title,
      description: course.description,
      content: course.content,
      price: course.price,
      type: course.type,
      category: course.category,
      max_students: course.max_students?.toString() || '',
      duration_hours: course.duration_hours?.toString() || '',
      requirements: course.requirements || '',
      learning_outcomes: course.learning_outcomes || '',
      zoom_link: course.zoom_link || '',
      is_published: course.is_published,
      is_featured: course.is_featured,
    });
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this course?')) return;

    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`http://localhost:8000/api/admin/courses/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        await fetchCourses();
      } else {
        const error = await response.json();
        alert(error.message || 'Error deleting course');
      }
    } catch (error) {
      console.error('Error deleting course:', error);
    }
  };

  const openModal = () => {
    setEditingCourse(null);
    resetForm();
    setShowModal(true);
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'online': return '🌐 Online';
      case 'self_learning': return '📚 Self Learning';
      case 'offline': return '🏢 Offline';
      default: return type;
    }
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
          <h2 className="text-2xl font-semibold text-gray-800">Courses Management</h2>
          <button
            onClick={openModal}
            className="admin-button admin-button-primary"
          >
            Add New Course
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Course
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type & Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price & Students
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {courses.map((course) => (
                <tr key={course.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-start">
                      {course.featured_image && (
                        <img
                          src={`/storage/${course.featured_image}`}
                          alt={course.title}
                          className="w-16 h-16 object-cover rounded-lg mr-4"
                        />
                      )}
                      <div>
                        <div className="text-sm font-medium text-gray-900 mb-1">
                          {course.title}
                        </div>
                        <div className="text-sm text-gray-500 line-clamp-2">
                          {course.description}
                        </div>
                        <div className="text-xs text-gray-400 mt-1">
                          {course.duration_hours && `${course.duration_hours}h`} • 
                          👁️ {course.views_count} • 
                          📈 {course.completion_rate}% completion
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="space-y-1">
                      <div className="text-sm text-gray-900">
                        {getTypeLabel(course.type)}
                      </div>
                      <div className="text-sm text-gray-500">
                        {course.category}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="space-y-1">
                      <div className="text-sm font-medium text-gray-900">
                        ${course.price}
                      </div>
                      <div className="text-sm text-gray-500">
                        {course.current_students}{course.max_students ? `/${course.max_students}` : ''} students
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="space-y-1">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          course.is_published
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {course.is_published ? 'Published' : 'Draft'}
                      </span>
                      {course.is_featured && (
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                          Featured
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleEdit(course)}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => window.location.href = `/tests?course=${course.id}`}
                      className="text-green-600 hover:text-green-900 mr-3"
                    >
                      Tests
                    </button>
                    <button
                      onClick={() => handleDelete(course.id)}
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
                {editingCourse ? 'Edit Course' : 'Add New Course'}
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
                      Price *
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      required
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Type *
                    </label>
                    <select
                      required
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="online">🌐 Online</option>
                      <option value="self_learning">📚 Self Learning</option>
                      <option value="offline">🏢 Offline</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category *
                    </label>
                    <select
                      required
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select Category</option>
                      {categories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
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

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Content *
                  </label>
                  <textarea
                    required
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    rows={6}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Max Students
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={formData.max_students}
                      onChange={(e) => setFormData({ ...formData, max_students: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Duration (Hours)
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={formData.duration_hours}
                      onChange={(e) => setFormData({ ...formData, duration_hours: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Zoom Link (for online courses)
                    </label>
                    <input
                      type="url"
                      value={formData.zoom_link}
                      onChange={(e) => setFormData({ ...formData, zoom_link: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Requirements
                  </label>
                  <textarea
                    value={formData.requirements}
                    onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Learning Outcomes
                  </label>
                  <textarea
                    value={formData.learning_outcomes}
                    onChange={(e) => setFormData({ ...formData, learning_outcomes: e.target.value })}
                    rows={2}
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
                      Certificate Template
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setCertificateTemplateFile(e.target.files?.[0] || null)}
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
                    {editingCourse ? 'Update' : 'Create'}
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

export default Courses;
