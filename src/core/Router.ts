import { Block } from './Block';
import { Route } from './Route';

type BlockConstructor = new () => Block;

export class Router {
  private static __instance: Router | null = null;
  private routes: Route[] = [];
  private history: History = window.history;
  private _currentRoute: Route | null = null;
  private _rootQuery: string = '';
  private _notFoundRoute: Route | null = null;

  constructor(rootQuery: string) {
    if (Router.__instance) {
      return Router.__instance;
    }

    this.routes = [];
    this.history = window.history;
    this._currentRoute = null;
    this._rootQuery = rootQuery;

    Router.__instance = this;
  }

  use(pathname: string, block: BlockConstructor): this {
    const route = new Route(pathname, block, { rootQuery: this._rootQuery });
    this.routes.push(route);
    return this;
  }

  start(): void {
    window.onpopstate = () => {
      this._onRoute(window.location.pathname);
    };
    this._onRoute(window.location.pathname);
  }

  notFound(pathname: string, block: BlockConstructor): this {
    this._notFoundRoute = new Route(pathname, block, { rootQuery: this._rootQuery });
    return this;
  }

  private _onRoute(pathname: string): void {
    const route = this.getRoute(pathname);

    if (this._currentRoute) {
      this._currentRoute.leave();
    }

    if (!route) {
      if (this._notFoundRoute) {
        this._currentRoute = this._notFoundRoute;
        this._notFoundRoute.render();
      }
      return;
    }

    this._currentRoute = route;
    route.render();
  }

  go(pathname: string): void {
    this.history.pushState({}, '', pathname);
    this._onRoute(pathname);
  }

  back(): void {
    this.history.back();
  }

  forward(): void {
    this.history.forward();
  }

  private getRoute(pathname: string): Route | undefined {
    return this.routes.find(route => route.match(pathname));
  }

  static getInstance(): Router {
    if (!Router.__instance) {
      throw new Error('Router is not initialized. Call new Router(rootQuery) first.');
    }
    return Router.__instance;
  }

  static reset(): void {
    Router.__instance = null;
  }
}

