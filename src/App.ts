import { Router } from '@/core/Router';
import { LoginPage } from '@/pages/LoginPage';
import { SignupPage } from '@/pages/SignupPage';
import { ChatPage } from '@/pages/ChatPage';
import { ProfilePage } from '@/pages/ProfilePage';
import { Error404Page, Error500Page } from '@/pages/ErrorPage';

export class App {
  private router: Router;

  constructor() {
    this.router = new Router('#app');
    this.registerRoutes();
    this.initLinkHandler();
  }

  private registerRoutes(): void {
    this.router
      .use('/', LoginPage)
      .use('/sign-up', SignupPage)
      .use('/messenger', ChatPage)
      .use('/settings', ProfilePage)
      .use('/500', Error500Page)
      .notFound('/404', Error404Page);
  }

  private initLinkHandler(): void {
    document.addEventListener('click', (e: MouseEvent) => {
      if (!(e.target instanceof HTMLElement)) return;

      const link = e.target.closest('[data-link]');
      if (link instanceof HTMLElement) {
        e.preventDefault();
        const href = link.getAttribute('href');
        if (href) {
          this.router.go(href);
        }
      }
    });
  }

  start(): void {
    this.router.start();
  }
}
