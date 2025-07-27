// libraries
import { type FC } from 'react';
import FormWrapper from 'shared/FormWrapper';
import { fields, initialValues, validationSchema } from 'pages/Register/config';
import { links } from 'constants/links';
import { Link } from 'react-router-dom';

const handleSubmit = (values: typeof initialValues) => {
  console.log('Register values:', values);
};

const Register: FC = () => {
  return (
    <div className="bg-blue-600 w-screen h-screen mx-auto my-auto">
      <div className="bg-white p-6 shadow-md rounded mx-auto">
        <FormWrapper
          fields={fields}
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          submitText="Зарегистрироваться"
        />
        <Link className="text-sm text-black" to={links.login}>
          Уже зарегестрированы? Войдите в аккаунт
        </Link>
      </div>
    </div>
  );
};

export default Register;
