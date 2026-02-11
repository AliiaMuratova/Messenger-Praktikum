import { Block, BlockProps } from '@/core/Block';
import template from './ChatEmptyView.hbs?raw';

export class ChatEmptyView extends Block<BlockProps> {
  constructor(props: BlockProps = {}) {
    super(props);
  }

  render() {
    return this.compile(template, this.props);
  }
}
