import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
  creator: {
    id: number;
    name: string;
    email: string;
  };
}

const DocumentDetail = () => {
  const [document, setDocument] = useState<Document | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      fetchDocument();
    }
  }, [id]);

  const fetchDocument = async () => {
    try {
      const response = await fetch(`${DOCUMENT_ENDPOINTS.GET_DOCUMENT}/${id}`);
      if (response.ok) {
        const data = await response.json();
        setDocument(data);
      } else {
        setError('Document not found');
      }
    } catch (error) {
      console.error('Error fetching document:', error);
      setError('Failed to load document');
    } finally {
      setLoading(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handlePurchase = () => {
    // TODO: Implement purchase functionality
    alert('Purchase functionality will be implemented here');
  };

  const handlePreview = async () => {
    if (!document) return;
    
    setPreviewLoading(true);
    try {
      const response = await fetch(`${DOCUMENT_ENDPOINTS.PREVIEW_DOCUMENT}/${document.id}/preview`);
      
      if (response.ok) {
        const contentType = response.headers.get('content-type');
        
        if (contentType && contentType.includes('application/json')) {
          // Non-PDF file, show message
          const data = await response.json();
          alert(data.message || 'Preview not available for this file type');
        } else {
          // PDF file, create blob URL for preview
          const blob = await response.blob();
          const url = window.URL.createObjectURL(blob);
          setPreviewUrl(url);
          setShowPreview(true);
        }
      } else {
        alert('Failed to load preview');
      }
    } catch (error) {
      console.error('Preview error:', error);
      alert('An error occurred while loading the preview');
    } finally {
      setPreviewLoading(false);
    }
  };

  const closePreview = () => {
    setShowPreview(false);
    if (previewUrl) {
      window.URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
  };

  const handleDownload = async () => {
    if (!document) return;
    
    // Check if document is free or user has purchased it
    if (document.price > 0) {
      // TODO: Check if user has purchased this document
      // For now, we'll show a message to purchase first
      alert('Please purchase this document to download the full version');
      return;
    }
    
    try {
      const response = await fetch(`${DOCUMENT_ENDPOINTS.DOWNLOAD_DOCUMENT}/${document.id}/download`);
      
      if (response.ok) {
        // Create a blob from the response
        const blob = await response.blob();
        
        // Create a download link
        const url = window.URL.createObjectURL(blob);
        const a = window.document.createElement('a');
        a.href = url;
        a.download = document.file_name;
        window.document.body.appendChild(a);
        a.click();
        
        // Clean up
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading document...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !document) {
    return (
      <div className="min-h-screen bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Document Not Found</h1>
            <p className="text-gray-600 mb-6">{error || 'The document you are looking for does not exist.'}</p>
            <button
              onClick={() => navigate('/documents')}
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Back to Documents
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Breadcrumb */}
          <nav className="mb-8">
            <ol className="flex items-center space-x-2 text-sm text-gray-600">
              <li>
                <button
                  onClick={() => navigate('/')}
                  className="hover:text-blue-600 transition-colors"
                >
                  Home
                </button>
              </li>
              <li>/</li>
              <li>
                <button
                  onClick={() => navigate('/documents')}
                  className="hover:text-blue-600 transition-colors"
                >
                  Documents
                </button>
              </li>
              <li>/</li>
              <li>
                <button
                  onClick={() => navigate(`/documents/${document.category.toLowerCase()}`)}
                  className="hover:text-blue-600 transition-colors"
                >
                  {document.category}
                </button>
              </li>
              <li>/</li>
              <li className="text-gray-900">{document.title}</li>
            </ol>
          </nav>

          {/* Document Details */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="p-8">
              {/* Header */}
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-4">
                    <span className="inline-block bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">
                      {document.category}
                    </span>
                    <span className="text-sm text-gray-500">
                      {formatDate(document.created_at)}
                    </span>
                  </div>
                  
                  <h1 className="text-3xl font-bold text-gray-900 mb-4">
                    {document.title}
                  </h1>
                  
                  <p className="text-lg text-gray-600 leading-relaxed">
                    {document.description}
                  </p>
                </div>
                
                <div className="ml-8 text-right">
                  <div className="text-3xl font-bold text-blue-600 mb-2">
                    ${document.price}
                  </div>
                  {document.price === 0 && (
                    <span className="inline-block bg-green-100 text-green-800 text-sm px-3 py-1 rounded-full mb-4">
                      Free
                    </span>
                  )}
                  <div className="text-sm text-gray-500 mb-4">
                    {document.buy_number} purchases
                  </div>
                                     <div className="space-y-2">
                     <button
                       onClick={handlePreview}
                       disabled={previewLoading}
                       className="w-full bg-gray-600 text-white px-6 py-3 rounded-md text-lg font-medium hover:bg-gray-700 transition-colors disabled:opacity-50"
                     >
                       {previewLoading ? 'Loading Preview...' : 'Preview Document'}
                     </button>
                     {document.price === 0 ? (
                       <button
                         onClick={handleDownload}
                         className="w-full bg-green-600 text-white px-6 py-3 rounded-md text-lg font-medium hover:bg-green-700 transition-colors"
                       >
                         Download Free
                       </button>
                     ) : (
                       <button
                         onClick={handlePurchase}
                         className="w-full bg-blue-600 text-white px-6 py-3 rounded-md text-lg font-medium hover:bg-blue-700 transition-colors"
                       >
                         Purchase Now
                       </button>
                     )}
                   </div>
                </div>
              </div>

              {/* File Information */}
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">File Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-sm text-gray-600 mb-1">File Name</div>
                    <div className="font-medium">{document.file_name}</div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-sm text-gray-600 mb-1">File Type</div>
                    <div className="font-medium">{document.file_type}</div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-sm text-gray-600 mb-1">File Size</div>
                    <div className="font-medium">{formatFileSize(document.file_size)}</div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-sm text-gray-600 mb-1">Created By</div>
                    <div className="font-medium">{document.creator.name}</div>
                  </div>
                </div>
              </div>

              {/* Related Documents */}
              <div className="border-t border-gray-200 pt-6 mt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">More from {document.category}</h3>
                <button
                  onClick={() => navigate(`/documents/${document.category.toLowerCase()}`)}
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  View all {document.category} documents →
                </button>
              </div>
            </div>
                     </div>
         </div>
       </div>

       {/* Preview Modal */}
       {showPreview && previewUrl && (
         <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
           <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] flex flex-col">
             <div className="flex items-center justify-between p-4 border-b">
               <h3 className="text-lg font-semibold text-gray-900">
                 Document Preview - {document?.title}
               </h3>
               <button
                 onClick={closePreview}
                 className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
               >
                 ×
               </button>
             </div>
             <div className="flex-1 p-4 overflow-hidden">
               <iframe
                 src={previewUrl}
                 className="w-full h-full border-0"
                 title="Document Preview"
               />
             </div>
             <div className="p-4 border-t bg-gray-50">
               <div className="flex justify-between items-center">
                 <p className="text-sm text-gray-600">
                   This is a preview. {document?.price > 0 ? 'Purchase the document to download the full version.' : 'Click "Download Free" to get the complete document.'}
                 </p>
                 <button
                   onClick={closePreview}
                   className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
                 >
                   Close Preview
                 </button>
               </div>
             </div>
           </div>
         </div>
       )}
     </div>
   );
 };

export default DocumentDetail;
