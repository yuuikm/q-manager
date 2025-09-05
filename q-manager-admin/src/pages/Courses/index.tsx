import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from 'store/hooks';

interface Course {
  id: number;
  title: string;
  slug: string;
  description: string;
  content: string;
  price: number;
  type: 'online' | 'self_learning' | 'offline';
  category: {
    id: number;
    name: string;
  } | null;
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

interface Category {
  id: number;
  name: string;
}

const Courses = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [featuredImageFile, setFeaturedImageFile] = useState<File | null>(null);
  const [certificateTemplateFile, setCertificateTemplateFile] = useState<File | null>(null);
  const [categorySearch, setCategorySearch] = useState('');
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [filteredCategories, setFilteredCategories] = useState<Category[]>([]);

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
      console.error('Ошибка загрузки курсов:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch('http://localhost:8000/api/admin/course-categories', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      }
    } catch (error) {
      console.error('Ошибка загрузки категорий:', error);
    }
  };

  const handleCategorySearch = (value: string) => {
    setCategorySearch(value);
    
    if (value.trim() === '') {
      setFilteredCategories([]);
      setShowCategoryDropdown(false);
      return;
    }

    const filtered = categories.filter(cat => 
      cat.name.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredCategories(filtered);
    setShowCategoryDropdown(true);
  };

  const selectCategory = (category: Category) => {
    setFormData({ ...formData, category: category.name });
    setCategorySearch(category.name);
    setShowCategoryDropdown(false);
  };

  const createOrSelectCategory = async () => {
    const categoryName = categorySearch.trim();
    if (!categoryName) return;

    // Check if category exists
    const existingCategory = categories.find(cat => 
      cat.name.toLowerCase() === categoryName.toLowerCase()
    );

    if (existingCategory) {
      setFormData({ ...formData, category: existingCategory.name });
      setCategorySearch(existingCategory.name);
    } else {
      // Create new category
      try {
        const token = localStorage.getItem('auth_token');
        const response = await fetch('http://localhost:8000/api/admin/course-categories', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name: categoryName }),
        });

        if (response.ok) {
          await fetchCategories();
          setFormData({ ...formData, category: categoryName });
          setCategorySearch(categoryName);
        }
      } catch (error) {
        console.error('Ошибка создания категории:', error);
      }
    }
    setShowCategoryDropdown(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem('auth_token');
      const url = editingCourse 
        ? `http://localhost:8000/api/admin/courses/${editingCourse.id}`
        : 'http://localhost:8000/api/admin/courses';
      
      const method = editingCourse ? 'PUT' : 'POST';
      
      const formDataToSend = new FormData();
      Object.keys(formData).forEach(key => {
        if (formData[key as keyof typeof formData] !== undefined) {
          formDataToSend.append(key, formData[key as keyof typeof formData].toString());
        }
      });

      // Send the category name directly
      formDataToSend.append('category', formData.category);

      if (featuredImageFile) {
        formDataToSend.append('featured_image', featuredImageFile);
      }
      if (certificateTemplateFile) {
        formDataToSend.append('certificate_template', certificateTemplateFile);
      }

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
      } else {
        const error = await response.json();
        alert(error.message || 'Ошибка сохранения курса');
      }
    } catch (error) {
      console.error('Ошибка сохранения курса:', error);
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
    setCategorySearch('');
    setShowCategoryDropdown(false);
  };

  const handleEdit = (course: Course) => {
    setEditingCourse(course);
    setFormData({
      title: course.title,
      description: course.description,
      content: course.content,
      price: course.price,
      type: course.type,
      category: course.categories && course.categories.length > 0 ? course.categories[0].name : '',
      max_students: course.max_students?.toString() || '',
      duration_hours: course.duration_hours?.toString() || '',
      requirements: course.requirements || '',
      learning_outcomes: course.learning_outcomes || '',
      zoom_link: course.zoom_link || '',
      is_published: course.is_published,
      is_featured: course.is_featured,
    });
    setCategorySearch(course.category ? course.category.name : '');
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Вы уверены, что хотите удалить этот курс?')) return;

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
        alert(error.message || 'Ошибка удаления курса');
      }
    } catch (error) {
      console.error('Ошибка удаления курса:', error);
    }
  };

  const openModal = () => {
    setEditingCourse(null);
    resetForm();
    setShowModal(true);
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'online': return '🌐 Онлайн';
      case 'self_learning': return '📚 Самообучение';
      case 'offline': return '🏢 Офлайн';
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
          <h2 className="text-2xl font-semibold text-gray-800">Управление курсами</h2>
          <button
            onClick={openModal}
            className="admin-button admin-button-primary"
          >
            Добавить новый курс
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Курс
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Тип и категория
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Цена и студенты
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Статус
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Действия
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
                          {course.duration_hours && `${course.duration_hours}ч`} • 
                          👁️ {course.views_count} • 
                          📈 {course.completion_rate}% завершения
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
                        {course.category ? course.category.name : 'Без категории'}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="space-y-1">
                      <div className="text-sm font-medium text-gray-900">
                        ${course.price}
                      </div>
                      <div className="text-sm text-gray-500">
                        {course.current_students}{course.max_students ? `/${course.max_students}` : ''} студентов
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
                        {course.is_published ? 'Опубликован' : 'Черновик'}
                      </span>
                      {course.is_featured && (
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                          Рекомендуемый
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleEdit(course)}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                    >
                      Редактировать
                    </button>
                    <button
                      onClick={() => window.location.href = `/tests?course=${course.id}`}
                      className="text-green-600 hover:text-green-900 mr-3"
                    >
                      Тесты
                    </button>
                    <button
                      onClick={() => handleDelete(course.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Удалить
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
                {editingCourse ? 'Редактировать курс' : 'Добавить новый курс'}
              </h3>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Название *
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
                      Цена *
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

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Описание *
                  </label>
                  <textarea
                    required
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Тип курса
                    </label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value as 'online' | 'self_learning' | 'offline' })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="online">🌐 Онлайн</option>
                      <option value="self_learning">📚 Самообучение</option>
                      <option value="offline">🏢 Офлайн</option>
                    </select>
                  </div>

                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Категория
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={categorySearch}
                        onChange={(e) => handleCategorySearch(e.target.value)}
                        onFocus={() => {
                          if (categorySearch.trim()) {
                            setShowCategoryDropdown(true);
                          }
                        }}
                        placeholder="Введите название категории или выберите существующую"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      {showCategoryDropdown && (
                        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                          {filteredCategories.length > 0 ? (
                            filteredCategories.map((category) => (
                              <div
                                key={category.id}
                                onClick={() => selectCategory(category)}
                                className="px-3 py-2 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0"
                              >
                                {category.name}
                              </div>
                            ))
                          ) : (
                            <div className="px-3 py-2 text-gray-500">
                              Категория не найдена. Нажмите кнопку для создания новой.
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={createOrSelectCategory}
                      className="mt-2 text-sm text-blue-600 hover:text-blue-800"
                    >
                      {filteredCategories.length > 0 ? 'Выбрать существующую' : 'Создать новую категорию'}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Максимум студентов
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
                      Продолжительность (часы)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={formData.duration_hours}
                      onChange={(e) => setFormData({ ...formData, duration_hours: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Требования
                  </label>
                  <textarea
                    value={formData.requirements}
                    onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                    rows={3}
                    placeholder="Какие знания нужны для прохождения курса?"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Результаты обучения
                  </label>
                  <textarea
                    value={formData.learning_outcomes}
                    onChange={(e) => setFormData({ ...formData, learning_outcomes: e.target.value })}
                    rows={3}
                    placeholder="Что студент узнает после прохождения курса?"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ссылка на Zoom (для онлайн курсов)
                  </label>
                  <input
                    type="url"
                    value={formData.zoom_link}
                    onChange={(e) => setFormData({ ...formData, zoom_link: e.target.value })}
                    placeholder="https://zoom.us/j/..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Содержание курса *
                  </label>
                  <textarea
                    required
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    rows={6}
                    placeholder="Подробное описание содержания курса..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Главное изображение
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
                      Шаблон сертификата
                    </label>
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
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
                      Опубликован
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
                      Рекомендуемый
                    </label>
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="admin-button admin-button-secondary"
                  >
                    Отмена
                  </button>
                  <button
                    type="submit"
                    className="admin-button admin-button-primary"
                  >
                    {editingCourse ? 'Обновить' : 'Создать'}
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
