import { type FC, useState } from 'react';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import { clearError } from 'store/authSlice';
import Login from 'pages/Login';
import Register from 'pages/Register';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const AuthModal: FC<AuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  const handleClose = () => {
    dispatch(clearError());
    onClose();
  };

  // Close modal and call success callback when user becomes authenticated
  if (isAuthenticated && isOpen) {
    onSuccess?.();
    handleClose();
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {isLogin ? 'Вход' : 'Регистрация'}
            </h2>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Toggle between login and register */}
          <div className="mb-6 text-center">
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                dispatch(clearError());
              }}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              {isLogin ? 'Нет аккаунта? Зарегистрироваться' : 'Уже есть аккаунт? Войти'}
            </button>
          </div>

          {/* Render the appropriate component */}
          <div className="modal-content">
            {isLogin ? (
              <Login />
            ) : (
              <Register />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
