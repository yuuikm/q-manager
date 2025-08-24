import * as Yup from 'yup';

export const fields = [
  { name: 'email', label: 'Email', type: 'email', placeholder: 'Введите ваш email' },
  { name: 'password', label: 'Пароль', type: 'password', placeholder: 'Введите ваш пароль' },
];

export const initialValues = {
  email: '',
  password: '',
};

export const validationSchema = Yup.object({
  email: Yup.string()
    .email('Пожалуйста, введите корректный email адрес')
    .required('Email обязателен для входа'),
  password: Yup.string()
    .min(6, 'Пароль должен содержать минимум 6 символов')
    .required('Пароль обязателен для входа'),
});
