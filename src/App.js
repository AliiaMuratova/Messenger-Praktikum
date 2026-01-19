import { registerAllPartials } from '@/utils/registerAllPartials';

import { NavigationPage } from '@/pages/NavigationPage/NavigationPage.js';
import { LoginPage } from '@/pages/LoginPage/LoginPage.js';
import { SignupPage } from '@/pages/SignupPage/SignupPage.js';
import { ChatPage } from '@/pages/ChatPage/ChatPage.js';
import { ProfilePage } from '@/pages/ProfilePage/ProfilePage.js';
import { Error404Page, Error500Page } from '@/pages/ErrorPage/ErrorPage.js';

export class App {
  constructor() {

    registerAllPartials();

    this.routes = {
      '/': NavigationPage,
      '/login': LoginPage,
      '/signup': SignupPage,
      '/chat': ChatPage,
      '/profile': ProfilePage,
      '/error404': Error404Page,
      '/error500': Error500Page,
    };

    this.init();
  }

  init() {
    this.render();

    document.addEventListener('click', (e) => {
      const link = e.target.closest('[data-link]');
      if (link) {
        e.preventDefault();
        this.navigate(link.getAttribute('href'));
      }
    });

    window.addEventListener('popstate', () => this.render());
  }

  render() {
    const path = window.location.pathname;
    const page = this.routes[path] || Error404Page;

    const root = document.getElementById('app');
    if (!root) throw new Error('Element #app not found');

    root.innerHTML = page.render();

    if (page.init && typeof page.init === 'function') {
      page.init();
    }
  }

  navigate(path) {
    window.history.pushState({}, '', path);
    this.render();
  }
}
