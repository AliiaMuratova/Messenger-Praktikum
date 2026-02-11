import { Block, BlockProps } from '@/core/Block';
import template from './Navigation.hbs?raw';

const links = [
  { path: '/login', title: 'Вход' },
  { path: '/signup', title: 'Регистрация' },
  { path: '/chat', title: 'Чат' },
  { path: '/profile', title: 'Профиль' },
  { path: '/error404', title: 'Ошибка 404' },
  { path: '/error500', title: 'Ошибка 500' },
];

export class NavigationPage extends Block<BlockProps> {
  constructor() {
    super({});
  }

  render() {
    return this.compile(template, { links });
  }
}
