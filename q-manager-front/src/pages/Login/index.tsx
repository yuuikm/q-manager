// libraries
import { type FC } from 'react';
import { fields, initialValues, validationSchema } from 'pages/Login/config';
import FormWrapper from 'shared/FormWrapper';
import { links } from 'constants/links';
import { Link } from 'react-router-dom';

const handleSubmit = (values: typeof initialValues) => {
  console.log('Login values:', values);
};

const Login: FC = () => {
  return (
    <div className="bg-blue-600 w-screen h-screen">
      <div className="bg-white p-6 shadow-md rounded mx-auto">
        <FormWrapper
          fields={fields}
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          submitText="Войти"
        />
        <Link className="text-sm text-black" to={links.register}>Ещё нет аккаунта? Зарегестрируйтесь</Link>
      </div>
    </div>
  );
};

export default Login;
