import { Block, BlockProps } from '@/core/Block';
import dotsIcon from '@/assets/icons/dots.svg';
import pic from '@/assets/images/picture.png';
import template from './ChatWindow.hbs?raw';
import { MessageBubble, MessageBubbleProps } from '../MessageBubble/MessageBubble';
import { MessageForm } from '../MessageForm';
import noImage from '@/assets/images/image-not-found.png';

interface ChatWindowProps extends BlockProps {
  name: string;
  avatar?: string;
  dotsIcon: string;
  pic: string;
  date: string;
  messages: MessageBubble[];
  messageForm: MessageForm;
}

interface ChatWindowConstructorProps {
  messagesData: MessageBubbleProps[];
}

export class ChatWindow extends Block<ChatWindowProps> {
  constructor(props: ChatWindowConstructorProps) {
    const messages = props.messagesData.map((message) => new MessageBubble(message));

    super({
      name: 'Имя',
      avatar: noImage,
      dotsIcon,
      pic,
      date: '19.06.2025',
      messages,
      messageForm: new MessageForm({
        onSendMessage: (data: { message: string }) => {
          console.log('Данные формы:', data);
        }
      }),
    });
  }

  render() {
    return this.compile(template, this.props);
  }
}
