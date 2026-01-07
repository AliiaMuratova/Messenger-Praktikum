import Handlebars from 'handlebars';
import template from './ChatSideBar.hbs?raw';

export const ChatSideBar = {
  render: () => {
    return Handlebars.compile(template);
  }
};
