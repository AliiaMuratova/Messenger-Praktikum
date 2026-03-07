import { Block, BlockProps } from '@/core/Block';
import dotsIcon from '@/assets/icons/dots.svg';
import template from './ChatWindow.hbs?raw';
import { MessageBubble, MessageBubbleProps } from '../MessageBubble/MessageBubble';
import { MessageForm } from '../MessageForm';
import { MenuPopup } from '../MenuPopup';
import { Button } from '@/components/common/Button';
import noImage from '@/assets/images/image-not-found.png';

interface ChatWindowProps extends BlockProps {
  isSelected: boolean;
  name?: string;
  avatar?: string;
  menuIcon: string;
  messages: MessageBubble[];
  messageForm: MessageForm;
  menu: MenuPopup;
}

interface ChatWindowActions {
  onAddUser?: () => void;
  onRemoveUser?: () => void;
  onDeleteChat?: () => void;
  onSendMessage?: (message: string) => void;
  onSendFile?: (file: File) => void;
  onLoadMore?: () => void;
}

interface ChatWindowConstructorProps {
  messagesData: MessageBubbleProps[];
  actions: ChatWindowActions;
}

export class ChatWindow extends Block<ChatWindowProps> {
  private onLoadMore?: () => void;
  private isLoading = false;
  private firstMessageDate: string | null = null;

  constructor(props: ChatWindowConstructorProps) {
    const messages = props.messagesData.map((message) => new MessageBubble(message));

    const menuButtons: Button[] = [
      new Button({
        text: 'Добавить пользователя',
        type: 'button',
        class: 'dropdown__button',
        events: {
          click: () => props.actions.onAddUser?.(),
        },
      }),
      new Button({
        text: 'Удалить пользователя',
        type: 'button',
        class: 'dropdown__button',
        events: {
          click: () => props.actions.onRemoveUser?.(),
        },
      }),
      new Button({
        text: 'Удалить чат',
        type: 'button',
        class: 'dropdown__button',
        events: {
          click: () => props.actions.onDeleteChat?.(),
        },
      }),
    ];

    super({
      isSelected: false,
      menuIcon: dotsIcon,
      messages,
      messageForm: new MessageForm({
        onSendMessage: (data: { message: string }) => {
          props.actions.onSendMessage?.(data.message);
        },
        onSendFile: (file: File) => {
          props.actions.onSendFile?.(file);
        },
      }),
      menu: new MenuPopup({
        isOpen: false,
        buttons: menuButtons,
      }),
    });

    this.onLoadMore = props.actions.onLoadMore;
  }

  protected afterRender(): void {
    const messagesContainer = this.element?.querySelector('.dialog__messages');
    if (messagesContainer) {
      messagesContainer.addEventListener('scroll', () => this.handleScroll());
    }

    const menuTrigger = this.element?.querySelector('.dialog__header-menu');
    if (menuTrigger) {
      menuTrigger.addEventListener('click', (e: Event) => {
        e.stopPropagation();
        this.toggleMenu();
      });
    }
  }

  private toggleMenu(): void {
    const menu = this.children.menu as MenuPopup;
    menu.toggle();
  }

  private handleScroll(): void {
    const messagesContainer = this.element?.querySelector('.dialog__messages');
    if (!messagesContainer || this.isLoading) return;

    if (messagesContainer.scrollTop < 50) {
      this.onLoadMore?.();
    }
  }

  public setLoading(loading: boolean): void {
    this.isLoading = loading;
  }

  public setChatInfo(name: string, avatar?: string): void {
    this.setProps({ 
      isSelected: true,
      name, 
      avatar: avatar || noImage 
    });
  }

  public reset(): void {
    this.children.messages = [];
    this.lastMessageDate = null;
    this.firstMessageDate = null;
    this.isLoading = false;
    if ('messages' in this.lists) {
      delete this.lists.messages;
    }
    this.setProps({ 
      isSelected: false,
      name: undefined,
      avatar: undefined,
    });
  }

  private lastMessageDate: string | null = null;

  public setMessages(messagesData: MessageBubbleProps[]): void {
    let prevDate: string | null = null;
    const messagesWithSeparators = messagesData.map((message) => {
      const showDateSeparator = message.date !== prevDate;
      prevDate = message.date || null;
      return { ...message, showDateSeparator };
    });

    const messages = messagesWithSeparators.map((message) => new MessageBubble(message));
    this.children.messages = messages;
    this.lastMessageDate = prevDate;
    
    if (messagesData.length > 0) {
      this.firstMessageDate = messagesData[0].date || null;
    }
    
    if ('messages' in this.lists) {
      delete this.lists.messages;
    }
    
    this.setProps({ isSelected: this.props.isSelected });
    
    this.scrollToBottom();
  }

  public prependMessages(messagesData: MessageBubbleProps[]): void {
    if (messagesData.length === 0) return;

    const messagesContainer = this.element?.querySelector('.dialog__messages');
    if (!messagesContainer) return;

    const prevScrollHeight = messagesContainer.scrollHeight;
    const prevScrollTop = messagesContainer.scrollTop;

    let prevDate: string | null = null;
    const messagesWithSeparators = messagesData.map((message) => {
      const showDateSeparator = message.date !== prevDate;
      prevDate = message.date || null;
      return { ...message, showDateSeparator };
    });

    const existingMessages = this.children.messages as MessageBubble[];
    if (existingMessages.length > 0 && prevDate === this.firstMessageDate) {
      existingMessages[0].setProps({ showDateSeparator: false });
    }

    const newMessages = messagesWithSeparators.map((msg) => new MessageBubble(msg));

    this.children.messages = [...newMessages, ...existingMessages];

    this.firstMessageDate = messagesData[0].date || null;

    const firstChild = messagesContainer.firstChild;
    newMessages.forEach((message) => {
      messagesContainer.insertBefore(message.getContent(), firstChild);
    });

    const newScrollHeight = messagesContainer.scrollHeight;
    messagesContainer.scrollTop = prevScrollTop + (newScrollHeight - prevScrollHeight);
  }

  public addMessage(messageData: MessageBubbleProps): void {
    const showDateSeparator = messageData.date !== this.lastMessageDate;
    this.lastMessageDate = messageData.date || null;
    
    const message = new MessageBubble({ ...messageData, showDateSeparator });
    
    if (!this.children.messages) {
      this.children.messages = [];
      if ('messages' in this.lists) {
        delete this.lists.messages;
      }
    }
    
    const messages = this.children.messages as MessageBubble[];
    messages.push(message);
    
    const messagesContainer = this.element?.querySelector('.dialog__messages');
    if (messagesContainer) {
      messagesContainer.appendChild(message.getContent());
    }
    
    this.scrollToBottom();
  }

  private scrollToBottom(): void {
    setTimeout(() => {
      const messagesContainer = this.element?.querySelector('.dialog__messages');
      if (messagesContainer) {
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
      }
    }, 0);
  }

  render() {
    return this.compile(template, this.props);
  }
}
