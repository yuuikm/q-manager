// libraries
import { type FC, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import FormWrapper from 'shared/FormWrapper';
import { fields, initialValues, validationSchema } from 'pages/Register/config';
import { links } from 'constants/links';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import { register, clearError } from 'store/authSlice';

const Register: FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isAuthenticated, error } = useAppSelector((state: any) => state.auth);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthenticated) {
      navigate(links.login);
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    dispatch(clearError());
    setSubmitError(null);
  }, [dispatch]);

  const handleSubmit = async (values: typeof initialValues) => {
    try {
      setSubmitError(null);
      await dispatch(register({
        username: values.username,
        email: values.email,
        password: values.password,
        password_confirmation: values.password_confirmation,
      })).unwrap();
      navigate(links.login);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Произошла ошибка при регистрации');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Создать аккаунт
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Заполните форму для регистрации
          </p>
        </div>

        <div className="bg-white py-8 px-6 shadow-xl rounded-xl border border-gray-100">
          {(error || submitError) && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-red-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <span className="text-red-800 text-sm font-medium">
                  {submitError || error}
                </span>
              </div>
            </div>
          )}

          <FormWrapper
            fields={fields}
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
            submitText="Зарегистрироваться"
          />
          
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">или</span>
              </div>
            </div>
          </div>

          <div className="mt-6 text-center">
            <Link 
              to={links.login}
              className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors duration-200"
            >
              Уже зарегистрированы? Войдите в аккаунт
            </Link>
          </div>
        </div>

        <div className="text-center">
          <p className="text-xs text-gray-500">
            Регистрируясь, вы соглашаетесь с{' '}
            <a href="#" className="text-indigo-600 hover:text-indigo-500 transition-colors duration-200">
              условиями использования
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
