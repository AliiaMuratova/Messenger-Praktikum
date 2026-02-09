import {Block, BlockProps} from '@/core/Block';
import template from './Button.hbs?raw';

interface ButtonProps extends BlockProps {
  text: string;
  type?: 'button' | 'submit' | 'reset';
  class?: string;
  id?: string;
  events?: {
    click?: (e: Event) => void;
  };
}

export class Button extends Block<ButtonProps> {
  render() {
    return this.compile(template, this.props);
  }
}

