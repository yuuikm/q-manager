// libraries
import { type FC } from 'react';

const Testimonials: FC = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Отзывы о нас</h2>

        <div className="max-w-3xl mx-auto bg-gray-50 p-8 rounded-lg shadow-md">
          <p className="text-gray-700 italic mb-4">
            "Курс просто замечательный. Преподаватель очень доступно и понятно все объясняет.
            Приводит различные примеры. Чувствительно все мне объяснил человеческим, не замудренным
            языком. С удовольствием, прошел бы у него еще раз обучение. Всем советую."
          </p>
          <p className="font-medium text-right">Санат Кубанов</p>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
