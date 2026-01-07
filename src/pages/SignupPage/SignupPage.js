import Handlebars from 'handlebars';
import template from './Signup.hbs?raw';
import { passwordToggle } from '@/utils/passwordToggle';

export const SignupPage = {
  render: () => {
    return Handlebars.compile(template)();
  },

  init: () => {
    const form = document.querySelector('#signupForm');
    if (!form) return;

    passwordToggle(form);

    form.addEventListener('submit', (e) => {
      e.preventDefault();
    });
  }
};
