import { type FC } from 'react';
import { useAppSelector } from 'store/hooks';
import { useAuthModal } from 'hooks/useAuthModal';
import AuthModal from '../AuthModal/index';

export interface ContentCardData {
  id: number;
  title: string;
  description: string;
  price?: number;
  category?: {
    id: number;
    name: string;
  } | null;
  image_path?: string;
  featured_image?: string;
  created_at: string;
  published_at?: string;
  duration_hours?: number;
  file_name?: string;
  file_type?: string;
  file_size?: number;
}

interface ContentCardProps {
  item: ContentCardData;
  type: 'document' | 'course' | 'news';
  onViewDetails?: (item: ContentCardData) => void;
  onPurchase?: (item: ContentCardData) => void;
}

const ContentCard: FC<ContentCardProps> = ({ item, type, onViewDetails, onPurchase }) => {
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const { isOpen, openModal, closeModal } = useAuthModal();
  const getCategoryColor = (categoryId: number | null | undefined): string => {
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
      currency: 'RUB',
    }).format(price);
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };


  const getTypeLabel = (type: string): string => {
    switch (type) {
      case 'document':
        return 'Документ';
      case 'course':
        return 'Курс';
      case 'news':
        return 'Новость';
      default:
        return 'Контент';
    }
  };

  const handleButtonClick = () => {
    // Always allow viewing details
    onViewDetails?.(item);
  };

  const handlePurchaseClick = () => {
    if (isAuthenticated) {
      // User is logged in, proceed with purchase/enrollment
      onPurchase?.(item);
    } else {
      // User is not logged in, show auth modal
      openModal();
    }
  };

  const handleAuthSuccess = () => {
    // After successful authentication, proceed with purchase/enrollment
    onPurchase?.(item);
  };

  return (
    <div className="w-full max-w-sm mx-auto">
      <div className={`${getCategoryColor(item.category?.id)} rounded-xl shadow-xl overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl`}>
        {/* Header with Q-Manager.kz */}
        <div className="px-4 py-3 bg-black bg-opacity-25">
          <h3 className="text-white text-sm font-bold text-center tracking-wide">q-manager.kz</h3>
        </div>
        
        {/* Image for courses and news */}
        {(type === 'course' || type === 'news') && (item.featured_image || item.image_path) && (
          <div className="h-32 bg-gray-200 overflow-hidden">
            <img
              src={`http://localhost:8000/storage/${item.featured_image || item.image_path}`}
              alt={item.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        
        {/* Content */}
        <div className="px-4 py-6">
          {/* Title */}
          <h2 className="text-white text-lg font-bold mb-4 text-center leading-tight min-h-[3.5rem] flex items-center justify-center px-2">
            {item.title}
          </h2>
          
          {/* Description */}
          <p className="text-white text-sm mb-4 text-center opacity-90 line-clamp-2">
            {item.description}
          </p>
          
          {/* Item Info */}
          <div className="text-white text-sm mb-4 text-center opacity-90">
            {type === 'document' && item.file_name && (
              <p className="mb-1 text-xs">📁 {item.file_name}</p>
            )}
            {type === 'course' && item.duration_hours && (
              <p className="mb-1 text-xs">⏱️ {item.duration_hours} часов</p>
            )}
            {type === 'news' && (
              <p className="mb-1 text-xs">📅 {formatDate(item.published_at || item.created_at)}</p>
            )}
            <p className="text-xs opacity-75 bg-white bg-opacity-20 rounded-full px-2 py-1 inline-block">
              {item.category ? item.category.name : getTypeLabel(type)}
            </p>
          </div>
          
          {/* Price and Buttons */}
          <div className="flex flex-col items-center space-y-3">
            {item.price && (
              <div className="text-white text-2xl font-bold">
                {formatPrice(item.price)}
              </div>
            )}
            
            <div className="flex flex-col space-y-2 w-full">
              <button
                onClick={handleButtonClick}
                className="bg-white text-gray-800 px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Подробнее
              </button>
              
              {type !== 'news' && (
                <button
                  onClick={handlePurchaseClick}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  {type === 'course' ? 'Записаться' : 'Купить'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <AuthModal
        isOpen={isOpen}
        onClose={closeModal}
        onSuccess={handleAuthSuccess}
      />
    </div>
  );
};

export default ContentCard;
