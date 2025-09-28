import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DOCUMENT_ENDPOINTS } from 'constants/endpoints';
import DocumentCard from 'components/DocumentCard';

interface Document {
  id: number;
  title: string;
  description: string;
  category: {
    id: number;
    name: string;
  } | null;
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
        const categoryData = await response.json();
        const categoryCounts = categoryData.map((cat: any) => ({
          name: cat.name,
          count: documents.filter(doc => doc.category?.name === cat.name).length
        }));
        setCategories(categoryCounts);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const filteredDocuments = selectedCategory === 'all' 
    ? documents 
    : documents.filter(doc => doc.category?.name === selectedCategory);

  const handleCategoryClick = (category: string) => {
    if (category === 'all') {
      setSelectedCategory('all');
    } else {
      navigate(`/documents/${category.toLowerCase()}`);
    }
  };


  if (loading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Загрузка документов...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Наши документы</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Изучите нашу коллекцию качественных документов по различным категориям
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
              Все документы ({documents.length})
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
            <p className="text-gray-600 text-lg">В этой категории документы не найдены.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredDocuments.map((document) => (
              <DocumentCard
                key={document.id}
                document={document}
                onViewDetails={(doc) => {
                  // Navigate to document details or show modal
                  navigate(`/documents/view/${doc.id}`);
                }}
              />
            ))}
          </div>
        )}

        {/* View All Button */}
        <div className="text-center mt-12">
          <button
            onClick={() => navigate('/documents')}
            className="bg-blue-600 text-white px-8 py-3 rounded-md text-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Все документы
          </button>
        </div>
      </div>
    </section>
  );
};

export default Documents;
