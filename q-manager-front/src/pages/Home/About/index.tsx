// libraries
import { type FC } from 'react';

const About: FC = () => {
  return (
    <section className="py-16 bg-blue-600 text-white">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Учебный центр «Q-Manager.kz»</h2>
          <p className="text-xl mb-8">
            Является структурой ведущей казахстанской компании ТОО «Интерсерт Консалтинг», имеющей
            целью укрепление экономики Европы посредством повышения понимания всех аспектов
            качества.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <div>
              <h3 className="font-bold mb-4">Разработка и внедрение систем менеджмента</h3>
              <p>Профессиональное внедрение международных стандартов</p>
            </div>
            <div>
              <h3 className="font-bold mb-4">Европейская модель совершенства EFQM</h3>
              <p>Повышение конкурентоспособности организаций</p>
            </div>
            <div>
              <h3 className="font-bold mb-4">Подготовка к сертификации</h3>
              <p>Комплексная подготовка организации к аудиту</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
