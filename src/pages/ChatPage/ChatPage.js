import Handlebars from 'handlebars';
import template from './Chat.hbs?raw';
import searchIcon from '@/assets/icons/search_icon.svg';
import dotsIcon from '@/assets/icons/dots.svg';
import fileIcon from '@/assets/icons/import_file.svg';
import sendIcon from '@/assets/icons/send_Icon.svg';
import readIcon from '@/assets/icons/read_message_status.svg';
import pic from '@/assets/images/picture.png';
import { ChatWindow } from './components/ChatWindow/ChatWindow.js';
import { ChatSideBar } from './components/ChatSideBar/ChatSideBar.js';

export const ChatPage = {
  render: () => {
    const context = {
      isEmpty: false,
      searchIcon: searchIcon,
      dotsIcon: dotsIcon,
      fileIcon: fileIcon,
      sendIcon: sendIcon,
      readIcon: readIcon,
      pic: pic,
      dialogs: [
        { id: 1, name: 'Имя', message: 'Изображение', time: '10:49', count: 2, active: false },
        { id: 2, name: 'Имя', message: 'Стикер', time: 'Пн', active: true },
        { id: 3, name: 'Имя', message: 'Тест тест Тест Тест', time: '15:12', count: 4, active: false }
      ]
    };
    return Handlebars.compile(template)(context);
  },

  init: () => {
    ChatWindow.init();
    ChatSideBar.init();
  }
};
