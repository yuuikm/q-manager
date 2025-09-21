import { type FC, useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { newsAPI, type NewsItem } from 'api/news';

const NewsDetail: FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [news, setNews] = useState<NewsItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNews = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const newsItem = await newsAPI.getNewsItem(parseInt(id));
        setNews(newsItem);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Ошибка загрузки новости');
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [id]);

  const formatDate = (dateString: string) => {
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
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-md p-8">
              <div className="animate-pulse">
                <div className="h-8 bg-gray-200 rounded mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded mb-8"></div>
                <div className="h-64 bg-gray-200 rounded mb-8"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !news) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <h1 className="text-2xl font-bold text-red-600 mb-4">
                {error || 'Новость не найдена'}
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
        <div className="max-w-4xl mx-auto">
          {/* Back button */}
          <button
            onClick={() => navigate(-1)}
            className="mb-6 text-blue-600 hover:text-blue-800 font-medium flex items-center"
          >
            ← Назад
          </button>

          <article className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* Header */}
            <div className="p-8 border-b">
              <div className="flex items-center justify-between mb-4">
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                  {news.category?.name || 'Новости'}
                </span>
                <span className="text-gray-500 text-sm">
                  {formatDate(news.published_at || news.created_at)}
                </span>
              </div>
              
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {news.title}
              </h1>
              
              <p className="text-lg text-gray-600 leading-relaxed">
                {news.description}
              </p>
            </div>

            {/* Image */}
            {news.image_path && (
              <div className="w-full h-96 bg-gray-200 overflow-hidden">
                <img
                  src={`http://localhost:8000/storage/${news.image_path}`}
                  alt={news.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Content */}
            <div className="p-8">
              <div 
                className="prose prose-lg max-w-none"
                dangerouslySetInnerHTML={{ __html: news.content }}
              />
            </div>

            {/* Author info */}
            {news.author && (
              <div className="p-8 border-t bg-gray-50">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                    {news.author.first_name?.[0] || news.author.username[0].toUpperCase()}
                  </div>
                  <div className="ml-4">
                    <p className="font-medium text-gray-900">
                      {news.author.first_name && news.author.last_name 
                        ? `${news.author.first_name} ${news.author.last_name}`
                        : news.author.username
                      }
                    </p>
                    <p className="text-sm text-gray-500">Автор</p>
                  </div>
                </div>
              </div>
            )}
          </article>

          {/* Related news or navigation */}
          <div className="mt-8 text-center">
            <button
              onClick={() => navigate('/')}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Все новости
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsDetail;
