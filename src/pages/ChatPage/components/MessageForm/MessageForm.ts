import { Block, BlockProps } from '@/core/Block';
import { TEvent } from '@/types/common';
import { Input } from '@/components/common/Input';
import { validateInput } from '@/utils/validation/validateInput';
import { ValidationType } from '@/utils/validation/types';
import fileIcon from '@/assets/icons/import_file.svg';
import sendIcon from '@/assets/icons/send_icon.svg';
import template from './MessageForm.hbs?raw';
import './MessageForm.pcss';
import { MenuPopup } from '../MenuPopup';
import { Button } from '@/components/common/Button';

interface MessageFormProps extends BlockProps {
  onSendMessage?: (data: { message: string }) => void;
  onSendFile?: (file: File) => void;
}

export class MessageForm extends Block<MessageFormProps> {
  private message = '';
  private selectedFile: File | null = null;

  constructor(props: MessageFormProps) {
    const addButtons: Button[] = [
      new Button({
        text: 'Фото',
        type: 'button',
        class: 'dropdown__button',
        events: {
          click: () => this.openFilePicker('image/jpeg,image/jpg,image/png,image/gif'),
        },
      })
    ];

    super({
      ...props,
      fileIcon,
      sendIcon,
      selectedFile: null,
      selectedFileName: '',
      previewUrl: '',
      isImage: false,
      menu: new MenuPopup({
        isOpen: false,
        buttons: addButtons,
      }),
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

  private getFileInput(): HTMLInputElement | null {
    const input = this.element?.querySelector('.message-form__file-input');
    return input instanceof HTMLInputElement ? input : null;
  }

  private openFilePicker(accept: string): void {
    const fileInput = this.getFileInput();
    if (fileInput) {
      fileInput.accept = accept;
      fileInput.click();
    }
  }

  private handleFileSelected(): void {
    const fileInput = this.getFileInput();
    const file = fileInput?.files?.[0];
    if (file) {
      this.selectedFile = file;
      const isImage = file.type.startsWith('image/');
      
      if (isImage) {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.setProps({
            selectedFile: true,
            selectedFileName: file.name,
            previewUrl: e.target?.result as string,
            isImage: true,
          });
        };
        reader.readAsDataURL(file);
      } else {
        this.setProps({
          selectedFile: true,
          selectedFileName: file.name,
          previewUrl: '',
          isImage: false,
        });
      }
    }
  }

  private clearSelectedFile(): void {
    this.selectedFile = null;
    const fileInput = this.getFileInput();
    if (fileInput) {
      fileInput.value = '';
    }
    this.setProps({
      selectedFile: null,
      selectedFileName: '',
      previewUrl: '',
      isImage: false,
    });
  }

  protected afterRender(): void {
    const fileButton = this.element?.querySelector('.message-form__file-button');
    if (fileButton) {
      fileButton.addEventListener('click', (e: Event) => {
        e.stopPropagation();
        const menu = this.children.menu as MenuPopup;
        menu.toggle();
      });
    }

    const fileInput = this.getFileInput();
    if (fileInput) {
      fileInput.addEventListener('change', () => this.handleFileSelected());
    }

    const removeButton = this.element?.querySelector('.message-form__preview-remove');
    if (removeButton) {
      removeButton.addEventListener('click', () => this.clearSelectedFile());
    }
  }

  private _handleInputChange(value: string) {
    this.message = value;
  }

  private _handleFormSubmit(e: TEvent) {
    const event = e as SubmitEvent;
    event.preventDefault();

    if (this.selectedFile) {
      this.props.onSendFile?.(this.selectedFile);
      this.clearSelectedFile();
      return;
    }

    const { isValid } = validateInput(ValidationType.Message, this.message);
    if (!isValid) return;

    this.props.onSendMessage?.({ message: this.message });

    this.message = '';
    (this.children.input as Input).setProps({ value: '' });
    
    this.focusInput();
  }

  private focusInput(): void {
    setTimeout(() => {
      const input = this.element?.querySelector('input[name="message"]');
      if (input instanceof HTMLInputElement) {
        input.focus();
      }
    }, 0);
  }


  render() {
    return this.compile(template, this.props);
  }
}
