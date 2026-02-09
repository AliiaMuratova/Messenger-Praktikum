import { Block, BlockProps } from '@/core/Block';
import template from './ProfileInput.hbs?raw';
import { Input } from '@/components/common/Input';
import { validateInput } from '@/utils/validation/validateInput';
import { ValidationType } from '@/utils/validation/types';
import './ProfileInput.pcss';

export interface ProfileInputProps extends BlockProps {
  label: string;
  name: string;
  type: 'text' | 'password' | 'email' | 'tel' | 'number';
  value?: string;
  isPassword?: boolean;
  isReadonly?: boolean;
}

export class ProfileInput extends Block<ProfileInputProps> {
  constructor(props: ProfileInputProps) {
    super({
      ...props,
      input: new Input({
        name: props.name,
        type: props.type,
        value: props.value,
        isPassword: props.isPassword,
        isReadonly: props.isReadonly,
        className: 'input-field__input',
        wrapperClassName: 'input-field__input-wrapper',
        inputWrapperClassName: props.isPassword ? 'input-field__input-wrapper-input-password' : 'input-field__input-wrapper-input',
        errorClassName: 'input-field__input-error',
        onBlur: () => this._handleBlur()
      }),
    });
  }

  protected componentDidUpdate(oldProps: ProfileInputProps, newProps: ProfileInputProps): boolean {
    if (oldProps.isReadonly !== newProps.isReadonly || oldProps.value !== newProps.value) {
      this.setChildrenProps('input', {
        isReadonly: newProps.isReadonly,
        value: newProps.value,
      });
    }
    return true;
  }

  public getValue(): string {
    const input = this.children.input as Input;
    return input?.getValue() || '';
  }

  public validate(): boolean {
    const input = this.children.input as Input;
    const value = input?.getValue() || '';
    const { isValid, message } = validateInput(input.getName() as ValidationType, value);

    if (input?.element?.isConnected) {
      requestAnimationFrame(() => {
        input.setProps({
          error: message,
          isError: !isValid,
          value,
        });
      });
    }

    return isValid;
  }

  private _handleBlur() {
    this.validate();
  }

  
  render() {
    return this.compile(template, this.props);
  }
} 
