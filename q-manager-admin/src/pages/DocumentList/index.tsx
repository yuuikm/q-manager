import { type FC, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ADMIN_ENDPOINTS } from 'constants/endpoints';
import DataTable from '@/components/shared/DataTable';
import { documentColumns, documentActions } from './config.tsx';
import { LINKS } from '@/constants/routes';

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
  const navigate = useNavigate();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDocuments();
    
    // Event listeners for actions
    const handleEditDocument = (event: CustomEvent) => {
      handleEditDocumentAction(event.detail);
    };
    
    const handleToggleStatus = (event: CustomEvent) => {
      handleToggleStatusAction(event.detail.id, event.detail.currentStatus);
    };
    
    const handleDeleteDocument = (event: CustomEvent) => {
      handleDeleteDocumentAction(event.detail);
    };

    window.addEventListener('editDocument', handleEditDocument as EventListener);
    window.addEventListener('toggleDocumentStatus', handleToggleStatus as EventListener);
    window.addEventListener('deleteDocument', handleDeleteDocument as EventListener);

    return () => {
      window.removeEventListener('editDocument', handleEditDocument as EventListener);
      window.removeEventListener('toggleDocumentStatus', handleToggleStatus as EventListener);
      window.removeEventListener('deleteDocument', handleDeleteDocument as EventListener);
    };
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

  const handleDeleteDocumentAction = async (id: number) => {
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

  const handleToggleStatusAction = async (id: number, currentStatus: boolean) => {
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

  const handleEditDocumentAction = (document: Document) => {
    // Navigate to upload page with document data for editing
    navigate(LINKS.documentsUploadLink, { 
      state: { 
        editMode: true, 
        documentData: document 
      } 
    });
  };

  const headerActions = (
    <>
      <button
        onClick={() => navigate(LINKS.documentsUploadLink)}
        className="admin-button admin-button-primary cursor-pointer"
      >
        Загрузить документ
      </button>
      <button
        onClick={() => navigate(LINKS.documentsCategoryLink)}
        className="admin-button admin-button-secondary cursor-pointer"
      >
        Управление категориями
      </button>
    </>
  );

  return (
    <DataTable
      title="Управление документами"
      description="Список всех загруженных документов"
      data={documents}
      columns={documentColumns}
      actions={documentActions}
      loading={loading}
      error={error}
      emptyMessage="Документы не найдены"
      emptyDescription="Загрузите первый документ для начала работы"
      totalCount={documents.length}
      headerActions={headerActions}
    />
  );
};

export default DocumentList;
