// libraries
import { type FC } from 'react';

const Courses: FC = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Курсы по менеджменту</h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <h3 className="font-bold mb-2">СМК (ISO 9001)</h3>
            <p className="text-gray-600 text-sm">Система менеджмента качества</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <h3 className="font-bold mb-2">СМОТ (ISO 45001)</h3>
            <p className="text-gray-600 text-sm">Охрана труда и безопасность</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <h3 className="font-bold mb-2">СМИ (ISO 27001)</h3>
            <p className="text-gray-600 text-sm">Информационная безопасность</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <h3 className="font-bold mb-2">СМАК (ISO 37001)</h3>
            <p className="text-gray-600 text-sm">Антикоррупционный менеджмент</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <h3 className="font-bold mb-2">СЭМ (ISO 14001)</h3>
            <p className="text-gray-600 text-sm">Экологический менеджмент</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <h3 className="font-bold mb-2">СЭН (ISO 50001)</h3>
            <p className="text-gray-600 text-sm">Энергоменеджмент</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <h3 className="font-bold mb-2">СМБПП (ISO 22000)</h3>
            <p className="text-gray-600 text-sm">Безопасность пищевых продуктов</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md text-center">
            <h3 className="font-bold mb-2">GMP (ISO 22716)</h3>
            <p className="text-gray-600 text-sm">Надлежащая производственная практика</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Courses;
