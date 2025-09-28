import { type FC, useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppSelector } from 'store/hooks';
import { useAuthModal } from 'hooks/useAuthModal';
import AuthModal from 'components/shared/AuthModal';
import { coursesAPI, type Course, type CourseMaterial } from 'api/courses';

const CourseDetail: FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const { isOpen, openModal, closeModal } = useAuthModal();
  const [course, setCourse] = useState<Course | null>(null);
  const [materials, setMaterials] = useState<CourseMaterial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [enrolled] = useState(false);
  const [enrolling] = useState(false);

  useEffect(() => {
    const fetchCourse = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const [courseData, materialsData] = await Promise.all([
          coursesAPI.getCourse(parseInt(id)),
          coursesAPI.getCourseMaterials(parseInt(id))
        ]);
        setCourse(courseData);
        setMaterials(materialsData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Ошибка загрузки курса');
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [id]);

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
    }).format(price);
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleEnroll = async () => {
    if (!course) return;
    
    if (!isAuthenticated) {
      openModal();
      return;
    }
    
    // Navigate to checkout page for course enrollment
    navigate(`/checkout?type=course&id=${course.id}`);
  };

  const handleAuthSuccess = () => {
    // After successful authentication, proceed with enrollment
    handleEnroll();
  };

  const getMaterialIcon = (type: string): string => {
    switch (type) {
      case 'video':
        return '🎥';
      case 'pdf':
        return '📄';
      case 'doc':
        return '📝';
      case 'link':
        return '🔗';
      case 'text':
        return '📖';
      default:
        return '📄';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded mb-4"></div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  <div className="bg-white rounded-lg shadow-md p-8">
                    <div className="h-64 bg-gray-200 rounded mb-6"></div>
                    <div className="h-6 bg-gray-200 rounded mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded mb-8"></div>
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-200 rounded"></div>
                      <div className="h-4 bg-gray-200 rounded"></div>
                      <div className="h-4 bg-gray-200 rounded"></div>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="h-32 bg-gray-200 rounded mb-4"></div>
                    <div className="h-8 bg-gray-200 rounded mb-4"></div>
                    <div className="h-10 bg-gray-200 rounded"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <h1 className="text-2xl font-bold text-red-600 mb-4">
                {error || 'Курс не найден'}
              </h1>
              <button
                onClick={() => navigate('/')}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Вернуться на главную
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Back button */}
          <button
            onClick={() => navigate(-1)}
            className="mb-6 text-blue-600 hover:text-blue-800 font-medium flex items-center"
          >
            ← Назад
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main content */}
            <div className="lg:col-span-2">
              <article className="bg-white rounded-lg shadow-md overflow-hidden">
                {/* Header */}
                <div className="p-8 border-b">
                  <div className="flex items-center justify-between mb-4">
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                      {course.category?.name || 'Курс'}
                    </span>
                    <span className="text-gray-500 text-sm">
                      {formatDate(course.created_at)}
                    </span>
                  </div>
                  
                  <h1 className="text-3xl font-bold text-gray-900 mb-4">
                    {course.title}
                  </h1>
                  
                  <p className="text-lg text-gray-600 leading-relaxed">
                    {course.description}
                  </p>
                </div>

                {/* Image */}
                {course.featured_image && (
                  <div className="w-full h-96 bg-gray-200 overflow-hidden">
                    <img
                      src={`http://localhost:8000/storage/${course.featured_image}`}
                      alt={course.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                {/* Content */}
                <div className="p-8">
                  <div 
                    className="prose prose-lg max-w-none"
                    dangerouslySetInnerHTML={{ __html: course.content }}
                  />
                </div>

                {/* Course details */}
                <div className="p-8 border-t bg-gray-50">
                  <h3 className="text-xl font-bold mb-4">Детали курса</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {course.duration_hours && (
                      <div>
                        <span className="font-medium">Продолжительность:</span>
                        <span className="ml-2">{course.duration_hours} часов</span>
                      </div>
                    )}
                    {course.max_students && (
                      <div>
                        <span className="font-medium">Максимум студентов:</span>
                        <span className="ml-2">{course.max_students}</span>
                      </div>
                    )}
                    {course.requirements && (
                      <div className="md:col-span-2">
                        <span className="font-medium">Требования:</span>
                        <p className="mt-1 text-gray-600">{course.requirements}</p>
                      </div>
                    )}
                    {course.learning_outcomes && (
                      <div className="md:col-span-2">
                        <span className="font-medium">Результаты обучения:</span>
                        <p className="mt-1 text-gray-600">{course.learning_outcomes}</p>
                      </div>
                    )}
                  </div>
                </div>
              </article>

              {/* Materials */}
              {materials.length > 0 && (
                <div className="mt-8 bg-white rounded-lg shadow-md p-8">
                  <h3 className="text-xl font-bold mb-6">Материалы курса</h3>
                  <div className="space-y-4">
                    {materials.map((material) => (
                      <div key={material.id} className="flex items-center p-4 border rounded-lg hover:bg-gray-50">
                        <span className="text-2xl mr-4">{getMaterialIcon(material.type)}</span>
                        <div className="flex-1">
                          <h4 className="font-medium">{material.title}</h4>
                          {material.description && (
                            <p className="text-sm text-gray-600 mt-1">{material.description}</p>
                          )}
                        </div>
                        {material.is_required && (
                          <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs">
                            Обязательно
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
                <div className="text-center mb-6">
                  <div className="text-3xl font-bold text-blue-600 mb-2">
                    {formatPrice(course.price)}
                  </div>
                  <p className="text-gray-600">Стоимость курса</p>
                </div>

                {enrolled ? (
                  <div className="text-center">
                    <div className="bg-green-100 text-green-800 px-4 py-3 rounded-lg mb-4">
                      ✅ Вы записаны на курс
                    </div>
                    <button
                      onClick={() => navigate('/profile')}
                      className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Перейти к обучению
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={handleEnroll}
                    disabled={enrolling}
                    className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {enrolling ? 'Записываемся...' : 'Записаться на курс'}
                  </button>
                )}

                <div className="mt-6 pt-6 border-t">
                  <h4 className="font-medium mb-3">Что включено:</h4>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-center">
                      <span className="text-green-500 mr-2">✓</span>
                      Доступ к материалам курса
                    </li>
                    <li className="flex items-center">
                      <span className="text-green-500 mr-2">✓</span>
                      Сертификат об окончании
                    </li>
                    <li className="flex items-center">
                      <span className="text-green-500 mr-2">✓</span>
                      Поддержка преподавателя
                    </li>
                    {course.zoom_link && (
                      <li className="flex items-center">
                        <span className="text-green-500 mr-2">✓</span>
                        Онлайн-занятия
                      </li>
                    )}
                  </ul>
                </div>

                {course.author && (
                  <div className="mt-6 pt-6 border-t">
                    <h4 className="font-medium mb-3">Преподаватель</h4>
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                        {course.author.first_name?.[0] || course.author.username[0].toUpperCase()}
                      </div>
                      <div className="ml-3">
                        <p className="font-medium">
                          {course.author.first_name && course.author.last_name 
                            ? `${course.author.first_name} ${course.author.last_name}`
                            : course.author.username
                          }
                        </p>
                        <p className="text-sm text-gray-500">Эксперт</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
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

export default CourseDetail;
