import { Form } from '@/components/Form';
import { Block } from '@/core/Block';
import { Input } from '@/components/common/Input';
import template from './Signup.hbs?raw';


export class SignupPage extends Block {
  constructor() {
    const inputs = [
      new Input({ label: 'Почта', name: 'email', type: 'email', value: '' }),
      new Input({ label: 'Логин', name: 'login', value: '' }),
      new Input({ label: 'Имя', name: 'first_name', value: '' }),
      new Input({ label: 'Фамилия', name: 'second_name',value: '' }),
      new Input({ label: 'Телефон', name: 'phone', type: 'phone', value: '' }),
      new Input({ label: 'Пароль', name: 'password', type: 'password', value: '', isPassword: true }),
      new Input({ label: 'Пароль (еще раз)', name: 'repeat_password', isPassword: true, type: 'password', value: '' }),
    ];


    super({
      signupForm: new Form({
        title: 'Регистрация',
        formId: 'signupForm',
        buttonText: 'Зарегистрироваться',
        linkText: 'Войти',
        linkHref: '/login',
        inputs,
      }),
    });
  }

  render() {
    return this.compile(template, this.props);
  }
}
