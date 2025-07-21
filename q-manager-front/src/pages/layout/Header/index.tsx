// libraries
import { type FC } from 'react';

const Header: FC = () => {
  return (
      <header className="bg-white shadow-md">
          <div className="container mx-auto px-4 py-3">
              <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                  <div className="flex items-center w-full md:w-auto">
                      <div className="text-2xl font-bold text-blue-600">q-manager.kz</div>
                  </div>

                  <div className="relative w-full md:w-1/3">
                      <input type="text" placeholder="Поиск..."
                             className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                      <button className="absolute right-3 top-2 text-gray-500 hover:text-gray-700">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24"
                               stroke="currentColor">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                          </svg>
                      </button>
                  </div>

                  <div className="flex items-center space-x-4 w-full md:w-auto justify-end">
                      <a href="#"
                         className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition duration-300">Войти</a>
                      <a href="#"
                         className="bg-white border border-blue-600 text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-lg text-sm font-medium transition duration-300">Регистрация</a>
                      <a href="#"
                         className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-lg text-sm font-medium transition duration-300 flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none"
                               viewBox="0 0 24 24" stroke="currentColor">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                          </svg>
                          Мои документы
                      </a>
                  </div>
              </div>

              <div className="hidden md:flex items-center justify-between mt-4">
                  <div className="flex space-x-6">
                      <a href="#" className="text-gray-700 hover:text-blue-600">Главная</a>
                      <a href="#" className="text-gray-700 hover:text-blue-600">Учебный центр</a>
                      <a href="#" className="text-gray-700 hover:text-blue-600">Документация</a>
                      <a href="#" className="text-gray-700 hover:text-blue-600">Семинары</a>
                      <a href="#" className="text-gray-700 hover:text-blue-600">Помощь менеджеру</a>
                      <a href="#" className="text-gray-700 hover:text-blue-600">Платная документация</a>
                      <a href="#" className="text-gray-700 hover:text-blue-600">Контакты</a>
                  </div>
              </div>

              <div className="md:hidden mt-4">
                  <button className="text-gray-700 focus:outline-none">
                      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M4 6h16M4 12h16M4 18h16"></path>
                      </svg>
                  </button>
              </div>
          </div>
      </header>
  );
};

export default Header;