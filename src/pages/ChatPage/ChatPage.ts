import { Block } from '@/core/Block';
import template from './Chat.hbs?raw';
import readIcon from '@/assets/icons/read_message_status.svg';
import pic from '@/assets/images/picture.png';
import { ChatSideBar } from './components/ChatSideBar';
import { ChatWindow } from './components/ChatWindow';
import { DialogData } from './components/DialogItem/DialogItem';
import { MessageBubbleProps } from './components/MessageBubble/MessageBubble';

const dialogsData: DialogData[] = [
  { id: 1, name: 'Имя', message: 'Изображение', time: '10:49', count: 2, active: false },
  { id: 2, name: 'Имя', message: 'Стикер', time: 'Пн', active: true },
  { id: 3, name: 'Имя', message: 'Тест тест Тест Тест', time: '15:12', count: 4, active: false }
];

const messagesData: MessageBubbleProps[] = [
  {
    text: 'Привет! Смотри, тут всплыл интересный кусок лунной космической истории — НАСА в какой-то момент попросила Хассельблад адаптировать модель SWC для полетов на Луну. Сейчас мы все знаем что астронавты летали с моделью 500 EL — и к слову говоря, все тушки этих камер все еще находятся на поверхности Луны, так как астронавты с собой забрали только кассеты с пленкой.',
    icon: readIcon,
    time: '12:00',
  },
  {
    text: 'Хассельблад в итоге адаптировал SWC для космоса, но что-то пошло не так и на ракету они так никогда и не попали. Всего их было произведено 25 штук, одну из них недавно продали на аукционе за 45000 евро.',
    icon: readIcon,
    time: '12:01',
    isIncoming: true,
  },
  {
    icon: readIcon,
    time: '12:00',
    isIncoming: true,
    picture: pic
  }
];

export class ChatPage extends Block {
  constructor() {
    super({
      sidebar: new ChatSideBar({ dialogsData }),
      chat: new ChatWindow({ messagesData }),
    });
  }

  render() {
    return this.compile(template, this.props);
  }
}

