import * as Yup from 'yup';

export const fields = [
  { name: 'username', label: 'Имя пользователя', placeholder: 'Придумайте имя' },
  { name: 'email', label: 'Email', type: 'email', placeholder: 'Введите email' },
  { name: 'password', label: 'Пароль', type: 'password', placeholder: 'Придумайте пароль' },
];

export const initialValues = {
  username: '',
  email: '',
  password: '',
};

export const validationSchema = Yup.object({
  username: Yup.string().required('Обязательно'),
  email: Yup.string().email('Неверный email').required('Обязательно'),
  password: Yup.string().min(6, 'Мин. 6 символов').required('Обязательно'),
});