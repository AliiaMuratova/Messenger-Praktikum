import Handlebars from 'handlebars';
import template from './Navigation.hbs?raw';

export const NavigationPage = {
  render: () => {
    const context = {
      links: [
        { path: '/login', title: 'Вход' },
        { path: '/signup', title: 'Регистрация' },
        { path: '/chat', title: 'Чат' },
        { path: '/profile', title: 'Профиль' },
        { path: '/error404', title: 'Ошибка 404' },
        { path: '/error500', title: 'Ошибка 500' },
      ]
    };
    return Handlebars.compile(template)(context);
  }
};

