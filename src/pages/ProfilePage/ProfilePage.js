import Handlebars from 'handlebars';
import template from './Profile.hbs?raw';
import { passwordToggle } from '@/utils/passwordToggle';
import sendIcon from '@/assets/icons/send_Icon.svg';

export const ProfilePage = {
  render: () => {
    const context = {
      sendIcon: sendIcon,
      fields: [
        { name: 'email', label: 'Почта', value: 'pochta@yandex.ru', type: 'email' },
        { name: 'login', label: 'Логин', value: 'ivanivanov', type: 'text' },
        { name: 'first_name', label: 'Имя', value: 'Иван', type: 'text' },
        { name: 'second_name', label: 'Фамилия', value: 'Иванов', type: 'text' },
        { name: 'display_name', label: 'Имя в чате', value: 'Иван', type: 'text' },
        { name: 'phone', label: 'Телефон', value: '+7 (909) 967 30 30', type: 'tel' },
      ], 
      passwordFields: [
        { name: 'oldPassword', label: 'Старый пароль', value: 'password', type: 'password' },
        { name: 'newPassword', label: 'Новый пароль', value: 'password2', type: 'password' },
        { name: 'repeatPassword', label: 'Повторите новый пароль', value: 'password2', type: 'password' }
      ]
    };

    return Handlebars.compile(template)(context);
  },

  init: () => {
    const form = document.querySelector('#profileForm');
    if (!form) return;

    passwordToggle(form);

    form.addEventListener('submit', (e) => {
      e.preventDefault();
    });

  }
};
