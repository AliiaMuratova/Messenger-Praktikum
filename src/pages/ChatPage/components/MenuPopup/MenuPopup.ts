import { Block, BlockProps } from '@/core/Block';
import { Button } from '@/components/common/Button';
import template from './MenuPopup.hbs?raw';

const CLOSE_ALL_MENUS_EVENT = 'closeAllMenuPopups';

interface MenuPopupProps extends BlockProps {
  isOpen: boolean;
  buttons: Button[];
}

export class MenuPopup extends Block<MenuPopupProps> {
  constructor(props: MenuPopupProps) {
    super({
      ...props,
      isOpen: false,
    });

    document.addEventListener(CLOSE_ALL_MENUS_EVENT, this._handleCloseAll);
  }

  protected afterRender(): void {
    const buttons = this.element?.querySelectorAll('.dropdown__button');
    buttons?.forEach((button) => {
      button.addEventListener('click', () => this.close());
    });

    if (this.props.isOpen) {
      setTimeout(() => {
        document.addEventListener('click', this._handleOutsideClick);
      }, 0);
    }
  }

  toggle() {
    if (this.props.isOpen) {
      this.close();
    } else {
      this.open();
    }
  }

  open() {
    document.dispatchEvent(new CustomEvent(CLOSE_ALL_MENUS_EVENT, { detail: this }));
    this.setProps({ isOpen: true });
  }

  close() {
    document.removeEventListener('click', this._handleOutsideClick);
    this.setProps({ isOpen: false });
  }

  private _handleCloseAll = (e: Event) => {
    const customEvent = e as CustomEvent;
    if (customEvent.detail !== this && this.props.isOpen) {
      this.close();
    }
  };

  private _handleOutsideClick = (e: Event) => {
    const element = this.element;
    if (element && !element.contains(e.target as Node)) {
      this.close();
    }
  };

  render() {
    return this.compile(template, this.props);
  }
}
