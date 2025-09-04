import { type FC, ReactNode, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAppSelector } from 'store/hooks';

interface LayoutProps {
  children: ReactNode;
}

const Layout: FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const { user } = useAppSelector((state: any) => state.auth);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    window.location.href = '/login';
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const getUserDisplayName = () => {
    if (user) {
      return `${user.first_name} ${user.last_name}`;
    }
    return 'Admin';
  };

  const menuItems = [
    { path: '/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/documents', label: 'Documents', icon: '📄' },
    { path: '/news', label: 'News', icon: '📰' },
    { path: '/courses', label: 'Courses', icon: '🎓' },
    { path: '/tests', label: 'Tests', icon: '📝' },
    { path: '/upload', label: 'Upload Document', icon: '⬆️' },
  ];

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <div className={`sidebar transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-16'}`}>
        <div className="p-4">
          <div className="flex items-center justify-between mb-8">
            {sidebarOpen && (
              <h1 className="text-xl font-bold text-white">Q-Manager Admin</h1>
            )}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-lg transition-colors"
            >
              {sidebarOpen ? '←' : '→'}
            </button>
          </div>
          
          <nav className="space-y-2">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`sidebar-item flex items-center px-4 py-3 rounded-lg text-sm font-medium ${
                  isActive(item.path) ? 'active' : ''
                }`}
              >
                <span className="text-lg mr-3">{item.icon}</span>
                {sidebarOpen && <span>{item.label}</span>}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="admin-header px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-semibold text-gray-800">
                {menuItems.find(item => isActive(item.path))?.label || 'Dashboard'}
              </h2>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-gray-600">Welcome back,</p>
                <p className="text-sm font-medium text-gray-800">{getUserDisplayName()}</p>
              </div>
              <button 
                onClick={handleLogout}
                className="admin-button admin-button-secondary"
              >
                Logout
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="main-content flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
