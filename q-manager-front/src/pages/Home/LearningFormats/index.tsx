// libraries
import { type FC } from 'react';

const LearningFormats: FC = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-blue-600 text-white p-8 rounded-lg text-center">
            <h3 className="text-xl font-bold mb-4">Дистанционное обучение</h3>
            <p className="mb-6">Обучайтесь в удобное для вас время из любой точки мира</p>
            <a
              href="#"
              className="bg-white text-blue-600 px-6 py-2 rounded-lg font-medium inline-block hover:bg-gray-100 transition duration-300"
            >
              Подробнее
            </a>
          </div>

          <div className="bg-blue-600 text-white p-8 rounded-lg text-center">
            <h3 className="text-xl font-bold mb-4">Офлайн обучение</h3>
            <p className="mb-6">Традиционные занятия в наших учебных классах</p>
            <a
              href="#"
              className="bg-white text-blue-600 px-6 py-2 rounded-lg font-medium inline-block hover:bg-gray-100 transition duration-300"
            >
              Подробнее
            </a>
          </div>

          <div className="bg-blue-600 text-white p-8 rounded-lg text-center">
            <h3 className="text-xl font-bold mb-4">Онлайн обучение</h3>
            <p className="mb-6">Живые занятия с преподавателем через интернет</p>
            <a
              href="#"
              className="bg-white text-blue-600 px-6 py-2 rounded-lg font-medium inline-block hover:bg-gray-100 transition duration-300"
            >
              Подробнее
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LearningFormats;
