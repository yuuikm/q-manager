import { type FC, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ADMIN_ENDPOINTS } from 'constants/endpoints';

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
  is_active: boolean;
  created_at: string;
  creator: {
    id: number;
    username: string;
    email: string;
  };
}

const DocumentList: FC = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(ADMIN_ENDPOINTS.GET_DOCUMENTS, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setDocuments(data.data || []);
      } else {
        setError('Не удалось загрузить документы');
      }
    } catch (error) {
      console.error('Ошибка загрузки документов:', error);
      setError('Произошла ошибка при загрузке документов');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteDocument = async (id: number) => {
    if (!confirm('Вы уверены, что хотите удалить этот документ?')) {
      return;
    }

    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`${ADMIN_ENDPOINTS.DELETE_DOCUMENT}/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        setDocuments(documents.filter(doc => doc.id !== id));
        alert('Документ успешно удален');
      } else {
        alert('Не удалось удалить документ');
      }
    } catch (error) {
      console.error('Ошибка удаления документа:', error);
      alert('Произошла ошибка при удалении документа');
    }
  };

  const handleToggleStatus = async (id: number, currentStatus: boolean) => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`${ADMIN_ENDPOINTS.TOGGLE_DOCUMENT_STATUS}/${id}/toggle-status`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        setDocuments(documents.map(doc => 
          doc.id === id ? { ...doc, is_active: !currentStatus } : doc
        ));
        alert(`Документ ${!currentStatus ? 'активирован' : 'деактивирован'} успешно`);
      } else {
        alert('Не удалось изменить статус документа');
      }
    } catch (error) {
      console.error('Ошибка изменения статуса документа:', error);
      alert('Произошла ошибка при изменении статуса документа');
    }
  };

  const handleEditDocument = (document: Document) => {
    // Navigate to upload page with document data for editing
    navigate('/admin/documents/upload', { 
      state: { 
        editMode: true, 
        documentData: document 
      } 
    });
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Байт';
    const sizes = ['Байт', 'КБ', 'МБ', 'ГБ'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
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

  if (error) {
    return (
      <div className="admin-card">
        <div className="text-center py-8">
          <p className="text-red-600 text-lg">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="admin-card">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Управление документами</h1>
            <p className="text-gray-600 mt-1">Список всех загруженных документов</p>
          </div>
          <div className="flex space-x-3">
            <div className="text-sm text-gray-600 flex items-center">
              Всего: {documents.length} документов
            </div>
            <button
              onClick={() => navigate('/admin/documents/upload')}
              className="admin-button admin-button-primary cursor-pointer"
            >
              Загрузить документ
            </button>
            <button
              onClick={() => navigate('/admin/documents/categories')}
              className="admin-button admin-button-secondary cursor-pointer"
            >
              Управление категориями
            </button>
          </div>
        </div>

        {documents.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600 text-lg mb-4">Документы не найдены</p>
            <p className="text-gray-500">Загрузите первый документ для начала работы</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Документ
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Категория
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Цена
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Статус
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Создан
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Действия
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {documents.map((document) => (
                  <tr key={document.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900 mb-1">
                          {document.title}
                        </div>
                        <div className="text-sm text-gray-500 mb-2">
                          {document.description}
                        </div>
                        <div className="text-xs text-gray-400">
                          📁 {document.file_name} • {formatFileSize(document.file_size)}
                        </div>
                        <div className="text-xs text-gray-400 mt-1">
                          💰 {document.buy_number} покупок • от {document.creator.username}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {document.category ? document.category.name : 'Без категории'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      ${document.price}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          document.is_active
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {document.is_active ? 'Активен' : 'Неактивен'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(document.created_at)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        {/* Edit Button */}
                        <button
                          onClick={() => handleEditDocument(document)}
                          className="p-2 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Редактировать документ"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>

                        {/* Toggle Status Button */}
                        <button
                          onClick={() => handleToggleStatus(document.id, document.is_active)}
                          className={`p-2 rounded-lg transition-colors ${
                            document.is_active 
                              ? 'text-orange-600 hover:text-orange-900 hover:bg-orange-50' 
                              : 'text-green-600 hover:text-green-900 hover:bg-green-50'
                          }`}
                          title={document.is_active ? 'Деактивировать документ' : 'Активировать документ'}
                        >
                          {document.is_active ? (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728" />
                            </svg>
                          ) : (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </button>

                        {/* Delete Button */}
                        <button
                          onClick={() => handleDeleteDocument(document.id)}
                          className="p-2 text-red-600 hover:text-red-900 hover:bg-red-50 rounded-lg transition-colors"
                          title="Удалить документ"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default DocumentList;
