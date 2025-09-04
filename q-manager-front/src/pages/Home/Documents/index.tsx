import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DOCUMENT_ENDPOINTS } from 'constants/endpoints';

interface Document {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  file_name: string;
  file_type: string;
  file_size: number;
  buy_number: number;
  created_at: string;
}

interface Category {
  name: string;
  count: number;
}

const Documents = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const navigate = useNavigate();

  useEffect(() => {
    fetchDocuments();
    fetchCategories();
  }, []);

  const fetchDocuments = async () => {
    try {
      const response = await fetch(DOCUMENT_ENDPOINTS.GET_DOCUMENTS);
      if (response.ok) {
        const data = await response.json();
        setDocuments(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching documents:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch(DOCUMENT_ENDPOINTS.GET_CATEGORIES);
      if (response.ok) {
        const categoryNames = await response.json();
        const categoryCounts = categoryNames.map((name: string) => ({
          name,
          count: documents.filter(doc => doc.category === name).length
        }));
        setCategories(categoryCounts);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const filteredDocuments = selectedCategory === 'all' 
    ? documents 
    : documents.filter(doc => doc.category === selectedCategory);

  const handleCategoryClick = (category: string) => {
    if (category === 'all') {
      setSelectedCategory('all');
    } else {
      navigate(`/documents/${category.toLowerCase()}`);
    }
  };

  const handleDownload = async (documentId: number, fileName: string) => {
    try {
      const response = await fetch(`${DOCUMENT_ENDPOINTS.DOWNLOAD_DOCUMENT}/${documentId}/download`);
      
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = window.document.createElement('a');
        a.href = url;
        a.download = fileName;
        window.document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        window.document.body.removeChild(a);
      } else {
        alert('Failed to download document');
      }
    } catch (error) {
      console.error('Download error:', error);
      alert('An error occurred while downloading the document');
    }
  };

  const handlePreview = async (documentId: number, fileName: string) => {
    try {
      const response = await fetch(`${DOCUMENT_ENDPOINTS.PREVIEW_DOCUMENT}/${documentId}/preview`);
      
      if (response.ok) {
        const contentType = response.headers.get('content-type');
        
        if (contentType && contentType.includes('application/json')) {
          // Non-PDF file, show message
          const data = await response.json();
          alert(data.message || 'Preview not available for this file type');
        } else {
          // PDF file, open in new tab
          const blob = await response.blob();
          const url = window.URL.createObjectURL(blob);
          window.open(url, '_blank');
          // Clean up after a delay
          setTimeout(() => window.URL.revokeObjectURL(url), 1000);
        }
      } else {
        alert('Failed to load preview');
      }
    } catch (error) {
      console.error('Preview error:', error);
      alert('An error occurred while loading the preview');
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (loading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading documents...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Documents</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Explore our collection of high-quality documents across various categories
          </p>
        </div>

        {/* Category Filter */}
        <div className="mb-8">
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => handleCategoryClick('all')}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
              }`}
            >
              All Documents ({documents.length})
            </button>
            {categories.map((category) => (
              <button
                key={category.name}
                onClick={() => handleCategoryClick(category.name)}
                className="px-6 py-2 rounded-full text-sm font-medium bg-white text-gray-700 hover:bg-gray-100 border border-gray-300 transition-colors"
              >
                {category.name} ({category.count})
              </button>
            ))}
          </div>
        </div>

        {/* Documents Grid */}
        {filteredDocuments.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No documents found in this category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredDocuments.map((document) => (
              <div
                key={document.id}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                      {document.category}
                    </span>
                    <span className="text-sm text-gray-500">
                      {formatFileSize(document.file_size)}
                    </span>
                  </div>
                  
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                    {document.title}
                  </h3>
                  
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {document.description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl font-bold text-blue-600">
                        ${document.price}
                      </span>
                      {document.price === 0 && (
                        <span className="text-green-600 text-sm font-medium">Free</span>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-gray-500">
                        {document.buy_number} purchases
                      </span>
                      <div className="flex space-x-1">
                        <button
                          onClick={() => handleDownload(document.id, document.file_name)}
                          className="bg-green-600 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-green-700 transition-colors"
                          title="Download"
                        >
                          ↓
                        </button>
                                                 <button
                           onClick={() => handlePreview(document.id, document.file_name)}
                           className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
                         >
                           Preview
                         </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* View All Button */}
        <div className="text-center mt-12">
          <button
            onClick={() => navigate('/documents')}
            className="bg-blue-600 text-white px-8 py-3 rounded-md text-lg font-medium hover:bg-blue-700 transition-colors"
          >
            View All Documents
          </button>
        </div>
      </div>
    </section>
  );
};

export default Documents;
