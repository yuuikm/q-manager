import { type FC, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { coursesAPI, type Course } from 'api/courses';
import { routeHelpers } from 'constants/routes';
import ContentCard, { type ContentCardData } from 'components/shared/ContentCard';

const Courses: FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const response = await coursesAPI.getCourses({ 
          featured: true, 
          page: 1 
        });
        setCourses(response.data.slice(0, 8)); // Show only 8 featured courses
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Ошибка загрузки курсов');
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const handleViewDetails = (item: ContentCardData) => {
    navigate(routeHelpers.courseDetail(item.id));
  };

  const handlePurchase = (item: ContentCardData) => {
    // TODO: Navigate to checkout for course enrollment
    console.log('Purchase course:', item);
  };

  if (loading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Популярные курсы</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, index) => (
              <div key={index} className="bg-white animate-pulse rounded-lg shadow-md h-64"></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Популярные курсы</h2>
          <div className="text-center text-red-600">
            <p>{error}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Популярные курсы</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Изучайте современные стандарты менеджмента с нашими экспертами
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {courses.map((course) => (
            <ContentCard
              key={course.id}
              item={course as ContentCardData}
              type="course"
              onViewDetails={handleViewDetails}
              onPurchase={handlePurchase}
            />
          ))}
        </div>

        {courses.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Курсы пока не добавлены</p>
          </div>
        )}

        <div className="text-center mt-12">
          <button 
            onClick={() => navigate('/courses')}
            className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Все курсы
          </button>
        </div>
      </div>
    </section>
  );
};

export default Courses;
