import { EventBus } from '@/core/EventBus';
import { WebSocketTransport, WSTransportEvents } from '../websocket/WebSocketTransport';

const WS_BASE_URL = 'wss://ya-praktikum.tech/ws/chats';

export interface Message {
  user_id: number;
  chat_id: number;
  content: string;
  time: string;
  type: 'message' | 'file';
  file?: {
    id: number;
    user_id: number;
    path: string;
    filename: string;
    content_type: string;
    content_size: number;
    upload_date: string;
  };
}

export enum MessagesEvents {
  Connected = 'connected',
  HistoryReceived = 'history-received',
  MessageReceived = 'message-received',
  Error = 'error',
  Close = 'close',
}

class MessagesAPI extends EventBus {
  private socket: WebSocketTransport | null = null;

  public async connect(userId: number, chatId: number, tokenValue: string): Promise<void> {
    this.close();

    const url = `${WS_BASE_URL}/${userId}/${chatId}/${tokenValue}`;
    this.socket = new WebSocketTransport(url);

    this.subscribeToSocket();

    await this.socket.connect();
  }

  public sendMessage(content: string): void {
    if (!this.socket) {
      throw new Error('WebSocket is not connected');
    }

    this.socket.send({
      content,
      type: 'message',
    });
  }

  public sendFile(resourceId: number): void {
    if (!this.socket) {
      throw new Error('WebSocket is not connected');
    }

    this.socket.send({
      content: String(resourceId),
      type: 'file',
    });
  }

  public getOldMessages(offset: number = 0): void {
    if (!this.socket) {
      throw new Error('WebSocket is not connected');
    }

    this.socket.send({
      type: 'get old',
      content: String(offset),
    });
  }

  public close(): void {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
  }

  private subscribeToSocket(): void {
    if (!this.socket) return;

    this.socket.on(WSTransportEvents.Connected, () => {
      this.emit(MessagesEvents.Connected);
    });

    this.socket.on(WSTransportEvents.Message, (data: unknown) => {
      if (Array.isArray(data)) {
        this.emit(MessagesEvents.HistoryReceived, data as Message[]);
      } 
      else if (data && typeof data === 'object' && 'type' in data) {
        const messageData = data as { type: string };
        if (messageData.type === 'message' || messageData.type === 'file') {
          this.emit(MessagesEvents.MessageReceived, data as Message);
        }
      }
    });

    this.socket.on(WSTransportEvents.Error, (error: unknown) => {
      this.emit(MessagesEvents.Error, error);
    });

    this.socket.on(WSTransportEvents.Close, () => {
      this.emit(MessagesEvents.Close);
    });
  }
}

export const messagesAPI = new MessagesAPI();

