import { type FC, useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useLocation, useNavigate } from 'react-router-dom';
import { ADMIN_ENDPOINTS } from 'constants/endpoints';

interface Category {
  id: number;
  name: string;
}

const DocumentUpload: FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });
  const [categories, setCategories] = useState<Category[]>([]);
  const [categorySearch, setCategorySearch] = useState('');
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [filteredCategories, setFilteredCategories] = useState<Category[]>([]);
  
  // Edit mode state
  const editMode = location.state?.editMode || false;
  const documentData = location.state?.documentData || null;

  useEffect(() => {
    fetchCategories();
    
    // Set initial values for edit mode
    if (editMode && documentData) {
      setCategorySearch(documentData.category?.name || '');
    }
  }, [editMode, documentData]);

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch('http://localhost:8000/api/admin/document-categories', {
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

  const handleCategorySearch = (value: string, setFieldValue: any) => {
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

  const selectCategory = (category: Category, setFieldValue: any) => {
    setFieldValue('category', category.name);
    setCategorySearch(category.name);
    setShowCategoryDropdown(false);
  };

  const createOrSelectCategory = async (setFieldValue: any) => {
    const categoryName = categorySearch.trim();
    if (!categoryName) return;

    // Check if category exists
    const existingCategory = categories.find(cat => 
      cat.name.toLowerCase() === categoryName.toLowerCase()
    );

    if (existingCategory) {
      setFieldValue('category', existingCategory.name);
      setCategorySearch(existingCategory.name);
    } else {
      // Create new category
      try {
        const token = localStorage.getItem('auth_token');
        const response = await fetch('http://localhost:8000/api/admin/document-categories', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name: categoryName }),
        });

        if (response.ok) {
          await fetchCategories();
          setFieldValue('category', categoryName);
          setCategorySearch(categoryName);
        }
      } catch (error) {
        console.error('Ошибка создания категории:', error);
      }
    }
    setShowCategoryDropdown(false);
  };

  const validationSchema = Yup.object({
    title: Yup.string()
      .min(3, 'Название должно содержать минимум 3 символа')
      .max(100, 'Название должно содержать менее 100 символов')
      .required('Название обязательно'),
    description: Yup.string()
      .min(10, 'Описание должно содержать минимум 10 символов')
      .max(500, 'Описание должно содержать менее 500 символов')
      .required('Описание обязательно'),
    category: Yup.string()
      .required('Категория обязательна'),
    price: Yup.number()
      .min(0, 'Цена должна быть 0 или больше')
      .required('Цена обязательна'),
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setUploadStatus({ type: null, message: '' });
    }
  };

  const handleSubmit = async (values: any, { setSubmitting, resetForm }: any) => {
    if (!editMode && !selectedFile) {
      setUploadStatus({ type: 'error', message: 'Пожалуйста, выберите файл' });
      setSubmitting(false);
      return;
    }

    setUploading(true);
    setUploadStatus({ type: null, message: '' });
    
    try {
      const formData = new FormData();
      formData.append('title', values.title);
      formData.append('description', values.description);
      formData.append('price', values.price.toString());
      
      // Only append file if it's a new file or we're in create mode
      if (selectedFile) {
        formData.append('file', selectedFile);
      }

      // Send the category name directly
      formData.append('category', values.category);

      const token = localStorage.getItem('auth_token');
      const url = editMode 
        ? `${ADMIN_ENDPOINTS.UPDATE_DOCUMENT}/${documentData.id}`
        : ADMIN_ENDPOINTS.UPLOAD_DOCUMENT;
      const method = editMode ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        setUploadStatus({ 
          type: 'success', 
          message: editMode ? 'Документ успешно обновлен!' : 'Документ успешно загружен!' 
        });
        
        if (!editMode) {
          resetForm();
          setSelectedFile(null);
          setCategorySearch('');
          setShowCategoryDropdown(false);
          const fileInput = document.getElementById('file') as HTMLInputElement;
          if (fileInput) fileInput.value = '';
        } else {
          // Navigate back to document list after successful edit
          setTimeout(() => {
            navigate('/admin/documents');
          }, 1500);
        }
      } else {
        const error = await response.json();
        setUploadStatus({ 
          type: 'error', 
          message: error.message || (editMode ? 'Не удалось обновить документ' : 'Не удалось загрузить документ')
        });
      }
    } catch (error) {
      console.error('Ошибка загрузки:', error);
      setUploadStatus({ 
        type: 'error', 
        message: editMode ? 'Произошла ошибка при обновлении документа' : 'Произошла ошибка при загрузке документа'
      });
    } finally {
      setUploading(false);
      setSubmitting(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        {editMode ? 'Редактировать документ' : 'Загрузить документ'}
      </h1>
      
      {/* Status Message */}
      {uploadStatus.type && (
        <div className={`mb-6 p-4 rounded-md ${
          uploadStatus.type === 'success' 
            ? 'bg-green-50 border border-green-200 text-green-800' 
            : 'bg-red-50 border border-red-200 text-red-800'
        }`}>
          {uploadStatus.message}
        </div>
      )}
      
      <div className="admin-card max-w-2xl">
        <Formik
          initialValues={{
            title: editMode && documentData ? documentData.title : '',
            description: editMode && documentData ? documentData.description : '',
            category: editMode && documentData ? documentData.category?.name || '' : '',
            price: editMode && documentData ? documentData.price.toString() : '',
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, values, setFieldValue }) => (
            <Form className="space-y-6">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                  Название *
                </label>
                <Field
                  type="text"
                  id="title"
                  name="title"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Введите название документа"
                />
                <ErrorMessage name="title" component="div" className="text-red-500 text-sm mt-1" />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                  Описание *
                </label>
                <Field
                  as="textarea"
                  id="description"
                  name="description"
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Введите описание документа"
                />
                <ErrorMessage name="description" component="div" className="text-red-500 text-sm mt-1" />
              </div>

              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                  Категория *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={categorySearch}
                    onChange={(e) => handleCategorySearch(e.target.value, setFieldValue)}
                    onFocus={() => {
                      if (categorySearch.trim()) {
                        setShowCategoryDropdown(true);
                      }
                    }}
                    onBlur={() => {
                      // Delay hiding dropdown to allow button clicks
                      setTimeout(() => setShowCategoryDropdown(false), 200);
                    }}
                    placeholder="Введите название категории"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                  {showCategoryDropdown && categorySearch.trim() && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                      {filteredCategories.length > 0 ? (
                        <>
                          {filteredCategories.map((category) => (
                            <div
                              key={category.id}
                              onClick={() => selectCategory(category, setFieldValue)}
                              className="px-3 py-2 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0"
                            >
                              {category.name}
                            </div>
                          ))}
                          <div className="px-3 py-2 border-t border-gray-200 bg-gray-50">
                            <button
                              type="button"
                              onClick={() => createOrSelectCategory(setFieldValue)}
                              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                            >
                              Создать новую: "{categorySearch}"
                            </button>
                          </div>
                        </>
                      ) : (
                        <div className="px-3 py-2">
                          <div className="text-gray-500 text-sm mb-2">
                            Категория "{categorySearch}" не найдена
                          </div>
                          <button
                            type="button"
                            onClick={() => createOrSelectCategory(setFieldValue)}
                            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                          >
                            Создать новую категорию
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                <div className="mt-2">
                  <button
                    type="button"
                    onClick={() => createOrSelectCategory(setFieldValue)}
                    disabled={!categorySearch.trim()}
                    className="text-sm text-blue-600 hover:text-blue-800 disabled:text-gray-400 disabled:cursor-not-allowed"
                  >
                    {categorySearch.trim() ? `Создать/выбрать: "${categorySearch}"` : 'Введите название категории'}
                  </button>
                </div>
                <ErrorMessage name="category" component="div" className="text-red-500 text-sm mt-1" />
              </div>

              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
                  Цена ($) *
                </label>
                <Field
                  type="number"
                  id="price"
                  name="price"
                  step="0.01"
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="0.00"
                />
                <ErrorMessage name="price" component="div" className="text-red-500 text-sm mt-1" />
              </div>

              <div>
                <label htmlFor="file" className="block text-sm font-medium text-gray-700 mb-2">
                  Файл {!editMode && '*'}
                </label>
                <input
                  type="file"
                  id="file"
                  onChange={handleFileChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  accept=".pdf,.doc,.docx,.txt,.rtf"
                />
                {editMode && documentData && (
                  <p className="text-sm text-gray-600 mt-1">
                    Текущий файл: {documentData.file_name}
                  </p>
                )}
                {selectedFile && (
                  <p className="text-sm text-gray-600 mt-1">
                    Новый файл: {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} МБ)
                  </p>
                )}
                {editMode && (
                  <p className="text-sm text-gray-500 mt-1">
                    Оставьте поле пустым, чтобы сохранить текущий файл
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between pt-4">
                <button
                  type="button"
                  onClick={() => navigate('/admin/documents')}
                  className="admin-button admin-button-secondary"
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || uploading}
                  className="admin-button admin-button-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {uploading ? (editMode ? 'Обновление...' : 'Загрузка...') : (editMode ? 'Обновить документ' : 'Загрузить документ')}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default DocumentUpload;
