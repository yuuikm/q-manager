import * as Yup from 'yup';

export const fields = [
  { name: 'username', label: 'Имя пользователя', placeholder: 'Придумайте уникальное имя пользователя' },
  { name: 'email', label: 'Email', type: 'email', placeholder: 'Введите ваш email адрес' },
  { name: 'password', label: 'Пароль', type: 'password', placeholder: 'Придумайте надежный пароль' },
  { name: 'password_confirmation', label: 'Подтвердите пароль', type: 'password', placeholder: 'Повторите пароль' },
];

export const initialValues = {
  username: '',
  email: '',
  password: '',
  password_confirmation: '',
};

export const validationSchema = Yup.object({
  username: Yup.string()
    .min(3, 'Имя пользователя должно содержать минимум 3 символа')
    .max(20, 'Имя пользователя не должно превышать 20 символов')
    .matches(/^[a-zA-Z0-9_]+$/, 'Имя пользователя может содержать только буквы, цифры и знак подчеркивания')
    .required('Имя пользователя обязательно'),
  email: Yup.string()
    .email('Пожалуйста, введите корректный email адрес')
    .required('Email обязателен для регистрации'),
  password: Yup.string()
    .min(6, 'Пароль должен содержать минимум 6 символов')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Пароль должен содержать хотя бы одну заглавную букву, одну строчную букву и одну цифру')
    .required('Пароль обязателен для регистрации'),
  password_confirmation: Yup.string()
    .oneOf([Yup.ref('password')], 'Пароли должны совпадать')
    .required('Подтверждение пароля обязательно'),
});