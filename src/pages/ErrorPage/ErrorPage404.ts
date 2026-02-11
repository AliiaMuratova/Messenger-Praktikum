import { ErrorPage } from './ErrorPage';

export class Error404Page extends ErrorPage {
  constructor() {
    super({
      errorCode: '404',
      errorMessage: 'Не туда попали',
    });
  }
}
