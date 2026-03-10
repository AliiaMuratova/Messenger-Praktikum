import {Block, BlockProps} from '@/core/Block';
import template from './DialogItem.hbs?raw';

export interface DialogData extends BlockProps {
  id: number;
  title: string;
  last_message: string;
  message_prefix?: string;
  time: string;
  unread_count?: number;
  avatar?: string;
  active: boolean;
  onClick?: (id: number) => void;
}


export class DialogItem extends Block<DialogData> {
  private readonly chatId: number;

  constructor(props: DialogData) {
    super({
      ...props,
      events: {
        click: () => props.onClick?.(props.id),
      },
    });
    this.chatId = props.id;
  }

  public getChatId(): number {
    return this.chatId;
  }

  render() {
    return this.compile(template, this.props);
  }
}
