import { type FC } from 'react';

const Dashboard: FC = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Панель управления</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="admin-card">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Документы</h3>
          <p className="text-gray-600">Управление документами системы</p>
        </div>
        <div className="admin-card">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Пользователи</h3>
          <p className="text-gray-600">Управление пользователями</p>
        </div>
        <div className="admin-card">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Статистика</h3>
          <p className="text-gray-600">Аналитика и отчеты</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
