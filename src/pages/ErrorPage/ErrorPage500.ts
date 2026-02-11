import { ErrorPage } from './ErrorPage';

export class Error500Page extends ErrorPage {
  constructor() {
    super({
      errorCode: '500',
      errorMessage: 'Мы уже фиксим',
    });
  }
}
