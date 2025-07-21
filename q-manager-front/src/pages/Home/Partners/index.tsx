// libraries
import { type FC } from 'react';

const Partners: FC = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Нам доверяют</h2>

        <div className="flex flex-wrap justify-center gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md flex items-center justify-center">
            <span className="font-bold text-xl">ASTANA</span>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md flex items-center justify-center">
            <span className="font-bold text-xl">TENJOTRANZIT</span>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md flex items-center justify-center">
            <span className="font-bold text-xl">UPDL</span>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md flex items-center justify-center">
            <span className="font-bold text-xl">NURBANK</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Partners;
