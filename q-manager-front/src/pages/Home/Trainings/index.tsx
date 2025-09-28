// libraries
import { type FC } from 'react';

const Trainings: FC = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Новости учебного центра</h2>

        <div className="mb-12">
          <h3 className="text-2xl font-bold mb-4">
            Путь обучения лидера бизнес-трансформации EFQM
          </h3>
          <p className="text-gray-700 mb-6">Обучение по модели EFQM-2025</p>

          <div className="flex flex-wrap gap-4 mb-6">
            <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-lg">Уровень 1 ОСНОВЫ</div>
            <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-lg">
              Уровень 2 ПРАКТИК
            </div>
            <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-lg">Уровень 3 ЭКСПЕРТ</div>
            <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-lg">Уровень 4 МАСТЕР</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-white rounded-lg overflow-hidden shadow-md course-card transition duration-300">
            <div className="p-6">
              <h3 className="text-xl font-bold mb-2">
                Ассистент менеджера по системе экологического менеджмента (junior)
              </h3>
              <div className="flex flex-wrap gap-2 mb-4 text-sm">
                <span className="bg-gray-100 px-2 py-1 rounded">3 дня</span>
                <span className="bg-gray-100 px-2 py-1 rounded">Все уровни</span>
                <span className="bg-gray-100 px-2 py-1 rounded">10 уроков</span>
              </div>
              <p className="text-gray-700 mb-4">
                Краткое содержание тренинга. Внимание!!! Для молодежи! Для учащихся, студентов
                лицеев, колледжей и университетов! Впервые! Данный курс...
              </p>
              <div className="flex justify-between items-center">
                <span className="text-gray-500 text-sm">0 студентов</span>
                <a href="#" className="text-blue-600 hover:underline font-medium">
                  Подробнее
                </a>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg overflow-hidden shadow-md course-card transition duration-300">
            <div className="p-6">
              <h3 className="text-xl font-bold mb-2">
                Ассистент менеджера по менеджменту качества (junior)
              </h3>
              <div className="flex flex-wrap gap-2 mb-4 text-sm">
                <span className="bg-gray-100 px-2 py-1 rounded">3 дня</span>
                <span className="bg-gray-100 px-2 py-1 rounded">Все уровни</span>
                <span className="bg-gray-100 px-2 py-1 rounded">10 уроков</span>
              </div>
              <p className="text-gray-700 mb-4">
                Впервые! Данный курс предназначен для молодых специалистов, желающих начать карьеру
                в области менеджмента качества.
              </p>
              <div className="flex justify-between items-center">
                <span className="text-gray-500 text-sm">0 студентов</span>
                <a href="#" className="text-blue-600 hover:underline font-medium">
                  Подробнее
                </a>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg overflow-hidden shadow-md course-card transition duration-300">
            <div className="p-6">
              <h3 className="text-xl font-bold mb-2">
                Менеджер СМК для образовательных организаций ISO 9001:2015
              </h3>
              <div className="flex flex-wrap gap-2 mb-4 text-sm">
                <span className="bg-gray-100 px-2 py-1 rounded">3 недели</span>
                <span className="bg-gray-100 px-2 py-1 rounded">Все уровни</span>
                <span className="bg-gray-100 px-2 py-1 rounded">10 уроков</span>
              </div>
              <p className="text-gray-700 mb-4">
                Слушатель, прошедший курс «Менеджер СМК для образовательных организаций», получит
                знания и навыки, необходимые для дальнейшего...
              </p>
              <div className="flex justify-between items-center">
                <span className="text-gray-500 text-sm">0 студентов</span>
                <a href="#" className="text-blue-600 hover:underline font-medium">
                  Подробнее
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Trainings;
