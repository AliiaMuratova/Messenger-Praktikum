import { BASE_URL } from '../http/config';
import { HTTPTransport } from '../http/HttpTransport';


export interface Chat {
  id: number;
  title: string;
  avatar: string;
  unread_count: number;
  created_by: number;
  last_message: {
    user: {
      first_name: string,
        second_name: string,
        avatar: string,
        email: string,
        login: string,
        phone: string
    };
    time: string;
    content: string;
  };
}

class ChatsAPI {
  private http: HTTPTransport;

  constructor() {
    this.http = new HTTPTransport(BASE_URL);
  }

  getChats(title?: string): Promise<Chat[]> {
    return this.http.get('chats', { data: title ? { title } : undefined });
  }

  getToken(chatId: number): Promise<{ token: string }> {
    return this.http.post(`chats/token/${chatId}`);
  }

  addUsersToChat(chatId: number, users: number[]): Promise<void> {
    return this.http.put('chats/users', { data: { chatId, users } });
  }

  removeUsersFromChat(chatId: number, users: number[]): Promise<void> {
    return this.http.delete('chats/users', { data: { chatId, users } });
  }

  deleteChatById(chatId: number): Promise<void> {
    return this.http.delete('chats', { data: { chatId } });
  }

  createChat(title: string): Promise<{ id: number }> {
    return this.http.post('chats', { data: { title } });
  }
}

export const chatsAPI = new ChatsAPI();
