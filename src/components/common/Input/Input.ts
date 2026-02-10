import { Block, BlockProps } from '@/core/Block';
import { TEvent } from '@/types/common';
import template from './Input.hbs?raw';

interface InputProps extends BlockProps {
  name: string;
  label?: string;
  type?: string;
  required?: boolean;
  class?: string;
  isPassword?: boolean;
  isPasswordVisible?: boolean;
  isError?: boolean;
  error?: string;
  value?: string;
  className?: string;
  wrapperClassName?: string;
  inputWrapperClassName?: string;
  errorClassName?: string;
  placeholder?: string;
  isReadonly?: boolean;
  onInput?: (value: string) => void;
  onBlur?: () => void;
}

export class Input extends Block<InputProps> {
  private _isTogglingPassword = false;

  constructor(props: InputProps) {
    super({
      ...props,
      type: props.type || 'text',
      isPasswordVisible: false,
      events: {
        ...props.events,
        input: (e: TEvent) => {
          if (!(e.target instanceof HTMLInputElement)) return;
          const value = e.target.value || '';
          props.onInput?.(value || '');
        },
        blur: () => {
          if (this._isTogglingPassword) {
            return;
          }
          props.onBlur?.();
        },
        mousedown: (e: TEvent) => {
          if (!(e.target instanceof HTMLElement)) return;
          if (e.target.closest('.password-control')) {
            e.preventDefault();
            this._togglePasswordVisibility();
          }
        }
      },
    });
  }


  public getValue(): string {
    const input = this.element?.querySelector('input');
    if (input instanceof HTMLInputElement) {
      return input.value;
    }
    return this.props.value || '';
  }

  public getName(): string {
    return this.props.name;
  }

  public getProps(): InputProps {
    return this.props;
  }


  private _togglePasswordVisibility() {
    const isVisible = !!this.props.isPasswordVisible;
    const currentValue = this.getValue();

    this._isTogglingPassword = true;

    this.setProps({
      isPasswordVisible: !isVisible,
      type: !isVisible ? 'text' : 'password',
      value: currentValue,
    });

    const input = this.element?.querySelector('input') as HTMLInputElement | null;
    if (input) {
      input.focus();
      const length = currentValue.length;
      input.setSelectionRange(length, length);
    }

    requestAnimationFrame(() => {
      this._isTogglingPassword = false;
    });
  }


  render() {
    return this.compile(template, this.props);
  }
}
