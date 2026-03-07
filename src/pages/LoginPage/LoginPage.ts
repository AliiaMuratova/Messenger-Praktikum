import { Form } from '@/components/Form';
import { Block } from '@/core/Block';
import { Input } from '@/components/common/Input';
import { authAPI, SignInData } from '@/api/auth/AuthAPI';
import { Router } from '@/core/Router';
import template from './Login.hbs?raw';
import { handleError } from '@/utils/errorHandler/errorHandler';

export class LoginPage extends Block {
  constructor() {
    const inputs = [
      new Input({ label: 'Логин', name: 'login', value: '', isError: false, error: '' }),
      new Input({ label: 'Пароль', name: 'password', type: 'password', value: '', isPassword: true, isError: false, error: '' }),
    ];

    super({
      loginForm: new Form({
        title: 'Вход',
        formId: 'loginForm',
        buttonText: 'Авторизоваться',
        linkText: 'Нет аккаунта?',
        linkHref: '/sign-up',
        inputs,
        onSubmit: (data) => this.handleLogin(data as unknown as SignInData),
      })
    });
  }

  private async handleLogin(data: SignInData) {
    try {
      await authAPI.signIn(data);
      Router.getInstance().go('/messenger');
    } catch (error) {
      handleError(error, { 
        context: 'Авторизация',
        redirectOnUnauthorized: false
      });
    }
  }

  render() {
    return this.compile(template, this.props);
  }
}
