import { Block } from './Block';
import { renderDOM } from '@/utils/helpers/renderDom';
import { isEqual } from '@/utils/helpers/isEqual';


type BlockConstructor = new () => Block;

export class Route {
  private _pathname: string;
  private _blockClass: BlockConstructor;
  private _block: Block | null = null;
  private _props: Record<string, unknown>;

  constructor(pathname: string, view: BlockConstructor, props: Record<string, unknown>) {
    this._pathname = pathname;
    this._blockClass = view;
    this._block = null;
    this._props = props;
  }

  navigate(pathname: string): void {
    if (this.match(pathname)) {
      this._pathname = pathname;
      this.render();
    }
  }

  leave() {
    if (this._block) {
      this._block.getContent().remove();
      this._block = null;
    }
  }

  match(pathname: string): boolean {
    return isEqual(pathname, this._pathname);
  }

  render() {
    if (!this._block) {
      this._block = new this._blockClass();
    }

    renderDOM(this._props.rootQuery as string, this._block);
  }
}

