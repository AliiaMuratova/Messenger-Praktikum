import { Block, BlockProps } from '@/core/Block';
import template from './MessageBubble.hbs?raw';

export interface MessageBubbleProps extends BlockProps {
  text?: string;
  time: string;
  icon?: string;
  picture?: string;
  isIncoming?: boolean;
  isRead?: boolean;
}

export class MessageBubble extends Block<MessageBubbleProps> {
  constructor(props: MessageBubbleProps) {
    super({
      isIncoming: false,
      isRead: false,
      ...props,
    });
  }

  render() {
    return this.compile(template, this.props);
  }
} 
