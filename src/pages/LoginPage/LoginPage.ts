import { Form } from '@/components/Form';
import { Block } from '@/core/Block';
import { Input } from '@/components/common/Input';
import template from './Login.hbs?raw';

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
        linkHref: '/signup',
        inputs,
      })
    });
  }

  render() {
    return this.compile(template, this.props);
  }
}
