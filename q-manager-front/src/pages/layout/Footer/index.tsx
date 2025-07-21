// libraries
import { type FC } from "react";

const Footer: FC = () => {
  return (
    <footer className="bg-gray-800 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">Q-Manager.kz</h3>
            <p>
              Профессиональное обучение и консультации в области менеджмента
              качества.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4">Курсы</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="hover:underline">
                  СМК (ISO 9001)
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  СМОТ (ISO 45001)
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  СМИ (ISO 27001)
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  СМАК (ISO 37001)
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4">Контакты</h3>
            <ul className="space-y-2">
              <li>Телефон: +7 (727) 274-93-92</li>
              <li>Email: info@q-manager.kz</li>
              <li>Адрес: г. Алматы, ул. Примерная, 123</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4">Подписаться</h3>
            <p>Будьте в курсе наших новостей и мероприятий</p>
            <div className="mt-4 flex">
              <input
                type="email"
                placeholder="Ваш email"
                className="px-4 py-2 rounded-l-lg w-full text-gray-800"
              />
              <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-r-lg">
                OK
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-12 pt-8 text-center">
          <p>© 2023 Q-Manager.kz. Все права защищены.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
