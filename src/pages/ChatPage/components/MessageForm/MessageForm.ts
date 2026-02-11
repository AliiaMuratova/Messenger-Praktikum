import { Block, BlockProps } from '@/core/Block';
import { TEvent } from '@/types/common';
import { Input } from '@/components/common/Input';
import { validateInput } from '@/utils/validation/validateInput';
import { ValidationType } from '@/utils/validation/types';
import fileIcon from '@/assets/icons/import_file.svg';
import sendIcon from '@/assets/icons/send_icon.svg';
import template from './MessageForm.hbs?raw';
import './MessageForm.pcss';

interface MessageFormProps extends BlockProps {
  onSendMessage?: (data: { message: string }) => void;
}

export class MessageForm extends Block<MessageFormProps> {
  private message = '';

  constructor(props: MessageFormProps) {
    super({
      ...props,
      fileIcon,
      sendIcon,
      input: new Input({
        name: 'message',
        value: '',
        placeholder: 'Сообщение',
        wrapperClassName: 'message-form__input-wrapper',
        inputWrapperClassName: 'message-form__input-wrapper-input',
        className: 'message-form__input',
        onInput: (value) => this._handleInputChange(value),
      }),
      events: {
        submit: (e: TEvent) => this._handleFormSubmit(e),
      },
    });
  }

  private _handleInputChange(value: string) {
    this.message = value;
  }

  private _handleFormSubmit(e: TEvent) {
    const event = e as SubmitEvent;
    event.preventDefault();

    const { isValid } = validateInput(ValidationType.Message, this.message);
    if (!isValid) return;

    this.props.onSendMessage?.({ message: this.message });

    this.message = '';
    (this.children.input as Input).setProps({ value: '' });
  }


  render() {
    return this.compile(template, this.props);
  }
}
