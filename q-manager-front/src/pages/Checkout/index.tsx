import { type FC, useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { fields, initialValues, validationSchema } from './config';
import FormWrapper from 'shared/FormWrapper';
import { ROUTES } from 'constants/routes';
import { useAppSelector } from 'store/hooks';

interface CheckoutItem {
  id: number;
  title: string;
  type: 'course' | 'document';
  price: number;
  description?: string;
}

const Checkout: FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAppSelector((state: any) => state.auth);
  const [checkoutItem, setCheckoutItem] = useState<CheckoutItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const type = searchParams.get('type');
    const id = searchParams.get('id');

    if (!type || !id) {
      setError('Неверные параметры заказа');
      setLoading(false);
      return;
    }

    if (type !== 'course' && type !== 'document') {
      setError('Неверный тип товара');
      setLoading(false);
      return;
    }

    // Fetch item details based on type and id
    fetchItemDetails(type as 'course' | 'document', parseInt(id));
  }, [searchParams]);

  const fetchItemDetails = async (type: 'course' | 'document', id: number) => {
    try {
      setLoading(true);
      setError(null);

      const endpoint = type === 'course' 
        ? `${process.env.REACT_APP_API_URL}/api/courses/${id}`
        : `${process.env.REACT_APP_API_URL}/api/documents/${id}`;

      const response = await fetch(endpoint);
      
      if (!response.ok) {
        throw new Error('Товар не найден');
      }

      const data = await response.json();
      
      setCheckoutItem({
        id: data.id,
        title: data.title,
        type,
        price: data.price || 0,
        description: data.description,
      });
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Ошибка загрузки товара');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values: typeof initialValues) => {
    if (!checkoutItem) return;

    try {
      setError(null);

      // Create purchase/enrollment request
      const endpoint = checkoutItem.type === 'course'
        ? `${process.env.REACT_APP_API_URL}/api/courses/${checkoutItem.id}/enroll`
        : `${process.env.REACT_APP_API_URL}/api/documents/${checkoutItem.id}/purchase`;

      const token = localStorage.getItem('auth_token');
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          first_name: values.firstName,
          last_name: values.lastName,
          phone: values.phone,
          email: values.email,
          company: values.company || null,
          notes: values.notes || null,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Ошибка при оформлении заказа');
      }

      // Show success message and redirect to profile
      alert('Заказ успешно оформлен! Вы можете найти его в своем профиле.');
      navigate(ROUTES.PROFILE);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Произошла ошибка при оформлении заказа');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !checkoutItem) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="bg-white py-8 px-6 shadow-xl rounded-xl border border-gray-100">
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center justify-center">
                <svg className="w-8 h-8 text-red-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <span className="text-red-800 font-medium">{error}</span>
              </div>
            </div>
            <button
              onClick={() => navigate(ROUTES.HOME)}
              className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Вернуться на главную
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
            Оформление заказа
          </h1>
          <p className="text-lg text-gray-600">
            Заполните данные для {checkoutItem.type === 'course' ? 'записи на курс' : 'покупки документа'}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Summary */}
          <div className="bg-white shadow-xl rounded-xl border border-gray-100 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Детали заказа</h2>
            
            <div className="border border-gray-200 rounded-lg p-4 mb-6">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                    {checkoutItem.type === 'course' ? (
                      <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    ) : (
                      <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    )}
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {checkoutItem.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">
                    {checkoutItem.type === 'course' ? 'Курс' : 'Документ'}
                  </p>
                  {checkoutItem.description && (
                    <p className="text-sm text-gray-500 line-clamp-2">
                      {checkoutItem.description}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4">
              <div className="flex justify-between items-center text-lg font-semibold">
                <span className="text-gray-900">Итого:</span>
                <span className="text-indigo-600">
                  {checkoutItem.price > 0 ? `${checkoutItem.price} ₽` : 'Бесплатно'}
                </span>
              </div>
            </div>

            {user && (
              <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-green-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-green-800 text-sm font-medium">
                    Вы авторизованы как: {user.first_name} {user.last_name}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Checkout Form */}
          <div className="bg-white shadow-xl rounded-xl border border-gray-100 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Данные для заказа</h2>
            
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-red-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <span className="text-red-800 text-sm font-medium">{error}</span>
                </div>
              </div>
            )}

            <FormWrapper
              fields={fields}
              initialValues={user ? {
                ...initialValues,
                firstName: user.first_name || '',
                lastName: user.last_name || '',
                email: user.email || '',
              } : initialValues}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
              submitText={checkoutItem.type === 'course' ? 'Записаться на курс' : 'Купить документ'}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
