import { type FC, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { newsAPI, type NewsItem } from 'api/news';
import { routeHelpers } from 'constants/routes';
import ContentCard, { type ContentCardData } from 'components/shared/ContentCard';

const News: FC = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        const response = await newsAPI.getNews({
          featured: true,
          page: 1,
        });
        setNews(response.data.slice(0, 6)); // Show only 6 featured news items
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Ошибка загрузки новостей');
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  const handleViewDetails = (item: ContentCardData) => {
    navigate(routeHelpers.newsDetail(item.id));
  };

  const handlePurchase = (item: ContentCardData) => {
    // News doesn't require purchase, just view details
    navigate(routeHelpers.newsDetail(item.id));
  };

  if (loading) {
    return (
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Последние новости</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="bg-gray-200 animate-pulse rounded-lg h-64"></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Последние новости</h2>
          <div className="text-center text-red-600">
            <p>{error}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Последние новости</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Будьте в курсе последних событий в области менеджмента качества и сертификации
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {news.map((item) => (
            <ContentCard
              key={item.id}
              item={item as ContentCardData}
              type="news"
              onViewDetails={handleViewDetails}
              onPurchase={handlePurchase}
            />
          ))}
        </div>

        {news.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Новости пока не добавлены</p>
          </div>
        )}

        <div className="text-center mt-12">
          <button 
            onClick={() => navigate('/news')}
            className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Все новости
          </button>
        </div>
      </div>
    </section>
  );
};

export default News;
