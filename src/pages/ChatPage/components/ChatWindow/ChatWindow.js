import Handlebars from 'handlebars';
import template from './ChatWindow.hbs?raw';

export const ChatWindow = {
  render: () => {
    return Handlebars.compile(template);
  },

  init: () => {
    const form = document.querySelector('#sendMessageForm');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
    });
  }
};
