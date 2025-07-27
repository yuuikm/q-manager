// libraries
import { type FC } from 'react';

const Slider: FC = () => {
  return (
    <section className="container hero-section text-white py-20 mx-auto my-5 rounded-2xl">
      <div className="text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">Учебный центр Q-Manager</h1>
        <p className="text-xl md:text-2xl mb-8">Профессиональное обучение менеджменту качества</p>
        <div className="flex flex-col md:flex-row justify-center gap-4">
          <a
            href="#"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition duration-300"
          >
            Наши курсы
          </a>
          <a
            href="#"
            className="bg-transparent border-2 border-white hover:bg-white hover:text-gray-900 text-white px-6 py-3 rounded-lg font-medium transition duration-300"
          >
            Консультация
          </a>
        </div>
      </div>
    </section>
  );
};

export default Slider;
