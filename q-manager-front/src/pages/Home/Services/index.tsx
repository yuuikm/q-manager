// libraries
import { type FC } from 'react';

const Services: FC = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Наши услуги</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-gray-50 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition duration-300">
            <div className="p-6">
              <h3 className="text-xl font-bold mb-4 text-blue-600">Q-manager Обучение</h3>
              <p className="text-gray-700 mb-4">
                Дистанционное / Офлайн / Онлайн обучение по стандартам менеджмента качества
              </p>
              <a href="#" className="text-blue-600 hover:underline font-medium">
                Подробнее
              </a>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition duration-300">
            <div className="p-6">
              <h3 className="text-xl font-bold mb-4 text-blue-600">Q-manager Консультации</h3>
              <p className="text-gray-700 mb-4">
                Информационно-консультативные услуги по внедрению систем менеджмента
              </p>
              <a href="#" className="text-blue-600 hover:underline font-medium">
                Подробнее
              </a>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition duration-300">
            <div className="p-6">
              <h3 className="text-xl font-bold mb-4 text-blue-600">Q-manager Документация</h3>
              <p className="text-gray-700 mb-4">
                Платная документация по различным стандартам менеджмента качества
              </p>
              <a href="#" className="text-blue-600 hover:underline font-medium">
                Подробнее
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;
