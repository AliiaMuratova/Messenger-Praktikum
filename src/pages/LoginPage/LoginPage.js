import Handlebars from 'handlebars';
import template from './Login.hbs?raw';
import { passwordToggle } from '@/utils/passwordToggle';

export const LoginPage = {
  render: () => {
    return Handlebars.compile(template)();
  },

  init: () => {
    const form = document.querySelector('#loginForm');
    if (!form) return;

    passwordToggle(form);

    form.addEventListener('submit', (e) => {
      e.preventDefault();
    });
  }
};
