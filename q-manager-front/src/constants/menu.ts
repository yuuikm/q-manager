import { ROUTES } from './routes';

export interface MenuItem {
  label: string;
  path: string;
  icon?: string;
  children?: MenuItem[];
  requiresAuth?: boolean;
}

export const MAIN_MENU: MenuItem[] = [
  {
    label: 'Главная',
    path: ROUTES.HOME,
  },
  {
    label: 'Учебный центр',
    path: ROUTES.COURSES,
  },
  {
    label: 'Документация',
    path: ROUTES.DOCUMENTS,
  },
  {
    label: 'Новости',
    path: ROUTES.NEWS,
  },
  {
    label: 'Семинары',
    path: ROUTES.COURSES,
  },
  {
    label: 'Помощь менеджеру',
    path: '#',
  },
  {
    label: 'Платная документация',
    path: ROUTES.DOCUMENTS,
  },
  {
    label: 'Контакты',
    path: '#',
  },
];

export const USER_MENU: MenuItem[] = [
  {
    label: 'Мои документы',
    path: ROUTES.DOCUMENTS,
    requiresAuth: true,
  },
  {
    label: 'Мои курсы',
    path: ROUTES.COURSES,
    requiresAuth: true,
  },
  {
    label: 'Профиль',
    path: ROUTES.PROFILE,
    requiresAuth: true,
  },
];

export const AUTH_MENU: MenuItem[] = [
  {
    label: 'Войти',
    path: ROUTES.LOGIN,
  },
  {
    label: 'Регистрация',
    path: ROUTES.REGISTER,
  },
];
