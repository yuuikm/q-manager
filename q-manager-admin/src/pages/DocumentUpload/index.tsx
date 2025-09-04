import { type FC, useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { ADMIN_ENDPOINTS } from 'constants/endpoints';

const DocumentUpload: FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });

  const categories = [
    'Programming',
    'Design',
    'Marketing',
    'Business',
    'Technology',
    'Education',
    'Health',
    'Finance',
    'Other'
  ];

  const validationSchema = Yup.object({
    title: Yup.string()
      .min(3, 'Title must be at least 3 characters')
      .max(100, 'Title must be less than 100 characters')
      .required('Title is required'),
    description: Yup.string()
      .min(10, 'Description must be at least 10 characters')
      .max(500, 'Description must be less than 500 characters')
      .required('Description is required'),
    category: Yup.string()
      .required('Category is required'),
    price: Yup.number()
      .min(0, 'Price must be 0 or greater')
      .required('Price is required'),
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setUploadStatus({ type: null, message: '' });
    }
  };

  const handleSubmit = async (values: any, { setSubmitting, resetForm }: any) => {
    if (!selectedFile) {
      setUploadStatus({ type: 'error', message: 'Please select a file' });
      setSubmitting(false);
      return;
    }

    setUploading(true);
    setUploadStatus({ type: null, message: '' });
    
    try {
      const formData = new FormData();
      formData.append('title', values.title);
      formData.append('description', values.description);
      formData.append('category', values.category);
      formData.append('price', values.price.toString());
      formData.append('file', selectedFile);

      const token = localStorage.getItem('auth_token');
      const response = await fetch(ADMIN_ENDPOINTS.UPLOAD_DOCUMENT, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        setUploadStatus({ 
          type: 'success', 
          message: 'Document uploaded successfully!' 
        });
        resetForm();
        setSelectedFile(null);
        const fileInput = document.getElementById('file') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
      } else {
        const error = await response.json();
        setUploadStatus({ 
          type: 'error', 
          message: error.message || 'Failed to upload document' 
        });
      }
    } catch (error) {
      console.error('Upload error:', error);
      setUploadStatus({ 
        type: 'error', 
        message: 'An error occurred while uploading the document' 
      });
    } finally {
      setUploading(false);
      setSubmitting(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Upload Document</h1>
      
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
            title: '',
            description: '',
            category: '',
            price: '',
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, values }) => (
            <Form className="space-y-6">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                  Title *
                </label>
                <Field
                  type="text"
                  id="title"
                  name="title"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter document title"
                />
                <ErrorMessage name="title" component="div" className="text-red-500 text-sm mt-1" />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <Field
                  as="textarea"
                  id="description"
                  name="description"
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter document description"
                />
                <ErrorMessage name="description" component="div" className="text-red-500 text-sm mt-1" />
              </div>

              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <Field
                  as="select"
                  id="category"
                  name="category"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </Field>
                <ErrorMessage name="category" component="div" className="text-red-500 text-sm mt-1" />
              </div>

              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
                  Price ($) *
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
                  File *
                </label>
                <input
                  type="file"
                  id="file"
                  onChange={handleFileChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  accept=".pdf,.doc,.docx,.txt,.rtf"
                />
                {selectedFile && (
                  <p className="text-sm text-gray-600 mt-1">
                    Selected file: {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting || uploading}
                  className="admin-button admin-button-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {uploading ? 'Uploading...' : 'Upload Document'}
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
