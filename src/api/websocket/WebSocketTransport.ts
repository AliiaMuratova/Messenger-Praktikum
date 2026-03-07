import { EventBus } from '@/core/EventBus';

export enum WSTransportEvents {
  Connected = 'connected',
  Message = 'message',
  Error = 'error',
  Close = 'close',
}

export class WebSocketTransport extends EventBus {
  private socket: WebSocket | null = null;
  private pingInterval: ReturnType<typeof setInterval> | null = null;
  private readonly pingIntervalTime = 30000;

  constructor(private url: string) {
    super();
  }

  public connect(): Promise<void> {
    this.socket = new WebSocket(this.url);

    this.subscribe();

    return new Promise((resolve, reject) => {
      this.socket!.addEventListener('open', () => {
        this.setupPing();
        resolve();
      });

      this.socket!.addEventListener('error', (event) => {
        reject(event);
      });
    });
  }

  public send(data: string | object): void {
    if (!this.socket) {
      throw new Error('WebSocket is not connected');
    }

    const message = typeof data === 'string' ? data : JSON.stringify(data);
    this.socket.send(message);
  }

  public close(): void {
    this.clearPing();

    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
  }

  private subscribe(): void {
    if (!this.socket) return;

    this.socket.addEventListener('open', () => {
      this.emit(WSTransportEvents.Connected);
    });

    this.socket.addEventListener('message', (event: MessageEvent) => {
      try {
        const data = JSON.parse(event.data);

        if (data.type === 'pong') return;

        this.emit(WSTransportEvents.Message, data);
      } catch {
        this.emit(WSTransportEvents.Message, event.data);
      }
    });

    this.socket.addEventListener('error', (event) => {
      this.emit(WSTransportEvents.Error, event);
    });

    this.socket.addEventListener('close', (event: CloseEvent) => {
      this.clearPing();

      if (!event.wasClean) {
        console.error(`WebSocket closed unexpectedly. Code: ${event.code}, Reason: ${event.reason}`);
      }

      this.emit(WSTransportEvents.Close, event);
    });
  }

  private setupPing(): void {
    this.pingInterval = setInterval(() => {
      this.send({ type: 'ping' });
    }, this.pingIntervalTime);
  }

  private clearPing(): void {
    if (this.pingInterval) {
      clearInterval(this.pingInterval);
      this.pingInterval = null;
    }
  }
}

