import { Block } from '@/core/Block';
import { NavigationPage } from '@/pages/NavigationPage';
import { LoginPage } from '@/pages/LoginPage';
import { SignupPage } from '@/pages/SignupPage';
import { ChatPage } from '@/pages/ChatPage';
import { ProfilePage } from '@/pages/ProfilePage';
import { Error404Page, Error500Page } from '@/pages/ErrorPage';

type BlockConstructor = new () => Block;

export class App {
  private routes: Record<string, BlockConstructor>;

  constructor() {
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

  init(): void {
    this.render();

    document.addEventListener('click', (e: MouseEvent) => {
      if (!(e.target instanceof HTMLElement)) return;

      const link = e.target.closest('[data-link]');
      if (link instanceof HTMLElement) {
        e.preventDefault();
        const href = link.getAttribute('href');
        if (href) this.navigate(href);
      }
    });

    window.addEventListener('popstate', () => this.render());
  }

  render(): void {
    const path = window.location.pathname;
    const PageClass = this.routes[path] || this.routes['/error404'];

    const root = document.getElementById('app');
    if (!root) throw new Error('Element #app not found');

    const page = new PageClass();

    root.innerHTML = '';
    root.append(page.getContent());
    page.dispatchComponentDidMount();
  }

  navigate(path: string): void {
    window.history.pushState({}, '', path);
    this.render();
  }
}
