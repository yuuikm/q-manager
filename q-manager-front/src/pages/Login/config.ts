import * as Yup from 'yup';

export const fields = [
  { name: 'email', label: 'Email', type: 'email', placeholder: 'Введите email' },
  { name: 'password', label: 'Пароль', type: 'password', placeholder: 'Введите пароль' },
];

export const initialValues = {
  email: '',
  password: '',
};

export const validationSchema = Yup.object({
  email: Yup.string().email('Неверный email').required('Обязательно'),
  password: Yup.string().min(6, 'Мин. 6 символов').required('Обязательно'),
});
