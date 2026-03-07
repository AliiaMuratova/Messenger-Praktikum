import { Block } from '@/core/Block';
import template from './Chat.hbs?raw';
import readIcon from '@/assets/icons/read_message_status.svg';
import { ChatSideBar } from './components/ChatSideBar';
import { ChatWindow } from './components/ChatWindow';
import { MessageBubbleProps } from './components/MessageBubble/MessageBubble';
import { Chat, chatsAPI } from '@/api/messenger/chatsAPI';
import { authAPI } from '@/api/auth/AuthAPI';
import { messagesAPI, MessagesEvents, Message } from '@/api/messenger/messagesAPI';
import { resourcesAPI } from '@/api/resources/resourcesAPI';
import { userAPI } from '@/api/user/userAPI';
import { handleError, NotFoundError } from '@/utils/errorHandler/errorHandler';
import { DialogData } from './components/DialogItem/DialogItem';
import { BASE_URL } from '@/api/http/config';
import { Modal } from '@/components/Modal';
import { Input } from '@/components/common/Input';

const messagesData: MessageBubbleProps[] = [];

export class ChatPage extends Block {
  private userId: number | null = null;
  private userLogin: string | null = null;
  private _currentChatId: number | null = null;
  private chats: Chat[] = [];
  private messagesOffset = 0;
  private hasMoreMessages = true;
  private isInitialLoad = true;

  constructor() {
    super({
      sidebar: new ChatSideBar({
        onSearch: (title) => this.getChatsList(title),
        onSelectChat: (chatId) => this.selectChat(chatId),
        onAddChat: () => this.openCreateChatModal(),
      }),
      chat: new ChatWindow({
        messagesData,
        actions: {
          onAddUser: () => this.openAddUserModal(),
          onRemoveUser: () => this.openRemoveUserModal(),
          onDeleteChat: () => this.openDeleteChatModal(),
          onSendMessage: (message) => this.sendMessage(message),
          onSendFile: (file) => this.sendFile(file),
          onLoadMore: () => this.loadMoreMessages(),
        },
      }),
      addUserModal: new Modal({
        title: 'Добавить пользователя',
        buttonText: 'Добавить',
        content: new Input({
          name: 'login',
          label: 'Логин',
        }),
        onSubmit: () => this.handleAddUser(),
      }),
      removeUserModal: new Modal({
        title: 'Удалить пользователя',
        buttonText: 'Удалить',
        content: new Input({
          name: 'login',
          label: 'Логин',
        }),
        onSubmit: () => this.handleRemoveUser(),
      }),
      createChatModal: new Modal({
        title: 'Создать чат',
        buttonText: 'Создать',
        content: new Input({
          name: 'title',
          label: 'Название чата',
        }),
        onSubmit: () => this.handleCreateChat(),
      }),
    });

    this.subscribeToMessages();
  }

  private openAddUserModal(): void {
    (this.children.addUserModal as Modal).open();
  }

  private openRemoveUserModal(): void {
    (this.children.removeUserModal as Modal).open();
  }

  private openDeleteChatModal(): void {
    this.handleDeleteChat();
  }

  private openCreateChatModal(): void {
    (this.children.createChatModal as Modal).open();
  }

  private async handleCreateChat(): Promise<void> {
    const modal = this.children.createChatModal as Modal;
    const title = modal.getInputValue();

    if (!title) return;

    try {
      await chatsAPI.createChat(title);
      modal.resetInput();
      modal.close();

      this.getChatsList();
    } catch (error) {
      handleError(error, { context: 'Создание чата' });
    }
  }

  private async handleAddUser(): Promise<void> {
    const modal = this.children.addUserModal as Modal;
    const login = modal.getInputValue();

    if (!this._currentChatId || !login) return;

    try {
      const users = await userAPI.searchByLogin(login);
      if (users.length === 0) {
        throw new NotFoundError(`Пользователь с логином "${login}" не найден`);
      }

      await chatsAPI.addUsersToChat(this._currentChatId, [users[0].id]);
      modal.resetInput();
      modal.close();
    } catch (error) {
      handleError(error, { context: 'Добавление пользователя' });
    }
  }

  private async handleRemoveUser(): Promise<void> {
    const modal = this.children.removeUserModal as Modal;
    const login = modal.getInputValue();

    if (!this._currentChatId || !login) return;

    try {
      const users = await userAPI.searchByLogin(login);
      if (users.length === 0) {
        throw new NotFoundError(`Пользователь с логином "${login}" не найден`);
      }

      await chatsAPI.removeUsersFromChat(this._currentChatId, [users[0].id]);
      modal.resetInput();
      modal.close();
    } catch (error) {
      handleError(error, { context: 'Удаление пользователя из чата' });
    }
  }

  private async handleDeleteChat(): Promise<void> {
    if (!this._currentChatId) return;

    try {
      await chatsAPI.deleteChatById(this._currentChatId);
      this._currentChatId = null;

      this.messagesOffset = 0;
      this.hasMoreMessages = true;
      this.isInitialLoad = true;

      messagesAPI.close();

      const chatWindow = this.children.chat as ChatWindow;
      chatWindow.reset();

      this.getChatsList();
    } catch (error) {
      handleError(error, { context: 'Удаление чата' });
    }
  }


  protected componentDidMount(): void {
    this.initPage();
  }

  private async initPage(): Promise<void> {
    await this.initUser();
    this.getChatsList();
  }

  private async initUser(): Promise<void> {
    try {
      const user = await authAPI.getUser();
      this.userId = user.id;
      this.userLogin = user.login;
    } catch (error) {
      handleError(error, { context: 'Получение данных пользователя' });
    }
  }

  private async selectChat(chatId: number): Promise<void> {
    if (!this.userId) {
      console.error('Пользователь не авторизован');
      return;
    }

    try {
      this._currentChatId = chatId;

      this.messagesOffset = 0;
      this.hasMoreMessages = true;
      this.isInitialLoad = true;

      const selectedChat = this.chats.find((chat) => chat.id === chatId);
      if (selectedChat) {
        const chatWindow = this.children.chat as ChatWindow;
        const avatar = selectedChat.avatar
          ? `${BASE_URL}resources${selectedChat.avatar}`
          : undefined;
        chatWindow.setChatInfo(selectedChat.title, avatar);
      }

      const { token } = await chatsAPI.getToken(chatId);

      await messagesAPI.connect(this.userId, chatId, token);

      messagesAPI.getOldMessages(0);
    } catch (error) {
      handleError(error, { context: 'Подключение к чату' });
    }
  }

  private loadMoreMessages(): void {
    if (!this._currentChatId || !this.hasMoreMessages) return;

    const chatWindow = this.children.chat as ChatWindow;
    chatWindow.setLoading(true);

    messagesAPI.getOldMessages(this.messagesOffset);
  }

  private subscribeToMessages(): void {
    messagesAPI.on(MessagesEvents.HistoryReceived, (...args: unknown[]) => {
      const messages = args[0] as Message[];
      this.handleHistoryReceived(messages);
    });

    messagesAPI.on(MessagesEvents.MessageReceived, (...args: unknown[]) => {
      const message = args[0] as Message;
      this.handleNewMessage(message);
    });

    messagesAPI.on(MessagesEvents.Error, (...args: unknown[]) => {
      console.error('Ошибка WebSocket:', args[0]);
    });
  }

  private handleHistoryReceived(messages: Message[]): void {
    const chatWindow = this.children.chat as ChatWindow;

    if (messages.length < 20) {
      this.hasMoreMessages = false;
    }

    const messagesData = messages
      .reverse()
      .map((msg) => this.mapMessageToBubble(msg));

    if (this.isInitialLoad) {
      chatWindow.setMessages(messagesData);
      this.isInitialLoad = false;
    } else {
      chatWindow.prependMessages(messagesData);
    }

    this.messagesOffset += messages.length;
    chatWindow.setLoading(false);
  }

  private handleNewMessage(message: Message): void {
    const chatWindow = this.children.chat as ChatWindow;
    const messageData = this.mapMessageToBubble(message);
    chatWindow.addMessage(messageData);
  }

  private mapMessageToBubble(message: Message): MessageBubbleProps {
    const fileUrl = message.file?.path 
      ? this.validateFileUrl(`${BASE_URL}resources${message.file.path}`) 
      : undefined;
    return {
      text: message.content,
      time: this.formatTime(message.time),
      date: this.formatDate(message.time),
      isIncoming: message.user_id !== this.userId,
      icon: readIcon,
      picture: fileUrl,
    };
  }

  private validateFileUrl(url: string): string | undefined {
    try {
      const parsed = new URL(url);
      if (!['http:', 'https:'].includes(parsed.protocol)) {
        return undefined;
      }
      return parsed.toString();
    } catch {
      return undefined;
    }
  }

  private formatDate(isoTime: string): string {
    const date = new Date(isoTime);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Сегодня';
    }
    if (date.toDateString() === yesterday.toDateString()) {
      return 'Вчера';
    }
    return date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
    });
  }

  private sendMessage(message: string): void {
    if (!this._currentChatId) {
      throw new NotFoundError('Чат не выбран');
    }

    try {
      messagesAPI.sendMessage(message);
    } catch (error) {
      handleError(error, { context: 'Отправка сообщения' });
    }
  }

  private async sendFile(file: File): Promise<void> {
    if (!this._currentChatId) {
      throw new NotFoundError('Чат не выбран для отправки файла');
    }
    try {
      const resource = await resourcesAPI.upload(file);
      messagesAPI.sendFile(resource.id);
    } catch (error) {
      handleError(error, { context: 'Отправка файла' });
    }
  }

  private async getChatsList(title?: string) {
    try {
      this.chats = await chatsAPI.getChats(title);
      const dialogsData = this.mapChatsToDialogs(this.chats);
      const sidebar = this.children.sidebar as ChatSideBar;
      sidebar.setDialogs(dialogsData);
    } catch (error) {
      handleError(error, { context: 'Загрузка списка чатов' });
    }
  }

  private mapChatsToDialogs(chats: Chat[]): DialogData[] {
    return chats.map((chat) => {
      const isOwnMessage = chat.last_message?.user?.login === this.userLogin;
      const lastMessageContent = chat.last_message?.content || '';

      return {
        id: chat.id,
        title: chat.title,
        last_message: lastMessageContent,
        message_prefix: isOwnMessage && lastMessageContent ? 'Вы:' : undefined,
        time: chat.last_message?.time ? this.formatTime(chat.last_message.time) : '',
        unread_count: chat.unread_count || undefined,
        avatar: chat.avatar ? `${BASE_URL}resources${chat.avatar}` : undefined,
        active: false,
      };
    });
  }

  private formatTime(isoTime: string): string {
    const date = new Date(isoTime);
    return date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
  }

  render() {
    return this.compile(template, this.props);
  }
}

