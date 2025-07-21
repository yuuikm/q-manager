// libraries
import { type FC } from 'react';

const Faq: FC = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Часто задаваемые вопросы</h2>

        <div className="max-w-3xl mx-auto space-y-6">
          <div className="border-b border-gray-200 pb-4">
            <h3 className="text-xl font-bold mb-2">
              Что такое интегрированная система менеджмента?
            </h3>
            <p className="text-gray-700">
              Интегрированная система менеджмента (ИСМ) - это система, которая объединяет несколько
              систем менеджмента (качества, экологии, охраны труда и т.д.) в единую систему для
              более эффективного управления организацией.
            </p>
          </div>

          <div className="border-b border-gray-200 pb-4">
            <h3 className="text-xl font-bold mb-2">
              Каким образом происходит сертификация интегрированной системы менеджмента?
            </h3>
            <p className="text-gray-700">
              Сертификация проводится аккредитованными органами по сертификации и включает аудит
              документации и практического внедрения системы в организации.
            </p>
          </div>

          <div className="border-b border-gray-200 pb-4">
            <h3 className="text-xl font-bold mb-2">Что такое SWOT-анализ организации?</h3>
            <p className="text-gray-700">
              SWOT-анализ - это метод стратегического планирования, используемый для оценки
              внутренних (сильные и слабые стороны) и внешних (возможности и угрозы) факторов,
              влияющих на организацию.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Faq;
