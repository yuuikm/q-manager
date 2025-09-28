import { type FC } from 'react';

interface Document {
  id: number;
  title: string;
  description: string;
  price: number;
  category: {
    id: number;
    name: string;
  } | null;
  file_name: string;
  file_type: string;
  file_size: number;
  created_at: string;
}

interface DocumentCardProps {
  document: Document;
  onViewDetails?: (document: Document) => void;
}

const DocumentCard: FC<DocumentCardProps> = ({ document, onViewDetails }) => {
  const getCategoryColor = (categoryId: number | null): string => {
    if (!categoryId) return 'bg-blue-500';
    
    switch (categoryId) {
      case 1:
        return 'bg-blue-500';
      case 2:
        return 'bg-green-500';
      case 3:
        return 'bg-purple-500';
      case 4:
        return 'bg-orange-500';
      case 5:
        return 'bg-red-500';
      case 6:
        return 'bg-indigo-500';
      case 7:
        return 'bg-pink-500';
      default:
        return 'bg-blue-500';
    }
  };

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  return (
    <div className="w-full max-w-sm mx-auto">
      <div className={`${getCategoryColor(document.category?.id ?? null)} rounded-xl shadow-xl overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl`}>
        {/* Header with Q-Manager.kz */}
        <div className="px-4 py-3 bg-black bg-opacity-25">
          <h3 className="text-white text-sm font-bold text-center tracking-wide">q-manager.kz</h3>
        </div>
        
        {/* Content */}
        <div className="px-4 py-6">
          {/* Document Title */}
          <h2 className="text-white text-lg font-bold mb-4 text-center leading-tight min-h-[3.5rem] flex items-center justify-center px-2">
            {document.title}
          </h2>
          
          {/* Document Info */}
          <div className="text-white text-sm mb-4 text-center opacity-90">
            <p className="mb-1 text-xs">📁 {document.file_name}</p>
            <p className="text-xs opacity-75 bg-white bg-opacity-20 rounded-full px-2 py-1 inline-block">
              {document.category ? document.category.name : 'Без категории'}
            </p>
          </div>
          
          {/* Price and Button */}
          <div className="flex flex-col items-center space-y-3">
            <div className="text-white text-2xl font-bold">
              {formatPrice(document.price)}
            </div>
            
            <button
              onClick={() => onViewDetails?.(document)}
              className="bg-white text-gray-800 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Подробнее
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentCard;
