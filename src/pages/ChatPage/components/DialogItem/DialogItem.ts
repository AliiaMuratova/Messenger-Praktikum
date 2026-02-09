import {Block, BlockProps} from '@/core/Block';
import template from './DialogItem.hbs?raw';

export interface DialogData extends BlockProps {
  id: number;
  name: string;
  message: string;
  time: string;
  count?: number;
  avatar?: string;
  active: boolean;
}


export class DialogItem extends Block<DialogData> {
  constructor(props: DialogData) {
    super(props);
  }

  render() {
    return this.compile(template, this.props);
  }
}
