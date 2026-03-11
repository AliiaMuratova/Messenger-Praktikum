import { expect } from 'chai';
import { Router } from './Router.js';
import { Block } from './Block.js';

class TestBlock extends Block {
  constructor() {
    super({});
  }

  render() {
    const fragment = document.createElement('template');
    fragment.innerHTML = '<div>Test</div>';
    return fragment.content;
  }
}


describe('Router', () => {
  let router: Router;

  beforeEach(() => {
    Router.reset();

    const app = document.getElementById('app');
    if (app) app.innerHTML = '';

    window.history.pushState({}, '', '/');

    router = new Router('#app');
  });

  describe('Инициализация', () => {
    it('должен создавать инстанс', () => {
      expect(router).to.be.instanceOf(Router);
    });

    it('должен быть синглтоном', () => {
      const router2 = new Router('#app');
      expect(router).to.equal(router2);
    });

    it('getInstance должен возвращать инстанс', () => {
      expect(Router.getInstance()).to.equal(router);
    });
  });

  describe('Метод use', () => {
    it('должен поддерживать цепочку вызовов', () => {
      const result = router
        .use('/', TestBlock)
        .use('/about', TestBlock);

      expect(result).to.equal(router);
    });
  });

  describe('Навигация', () => {
    it('go должен менять pathname', () => {
      router.use('/', TestBlock);
      router.use('/about', TestBlock);
      router.start();

      router.go('/about');

      expect(window.location.pathname).to.equal('/about');
    });
  });
});

