import { Block, BlockProps } from '@/core/Block';
import { TEvent } from '@/types/common';
import template from './Modal.hbs?raw';
import './Modal.pcss';
import { FileInput } from '@/components/Modal/components/FileInput';
import { Input } from '../common/Input';


interface ModalProps extends BlockProps {
  title?: string;
  buttonText?: string;
  isOpen?: boolean;
  changeAvatar?: boolean;
  content?: Block;

  onClose?: () => void;
  onSubmit?: (e: SubmitEvent) => void;
}

export class Modal extends Block<ModalProps> {
  constructor(props: ModalProps) {
    const fileInput = new FileInput({
      name: 'avatar',
      accept: 'image/jpeg,image/png,image/webp',
      placeholder: 'Выберите файл на <br /> компьютере',
    });

    super({
      ...props,
      isOpen: props.isOpen ?? false,
      fileInput,
      events: {
        click: (e: TEvent) => this._handleOverlayClick(e),
        submit: (e: TEvent) => this._handleSubmit(e),
      },
    });
  }

  private _handleOverlayClick(e: TEvent) {
    if (!(e.target instanceof HTMLElement)) return;

    if (e.target.classList.contains('modal-wrapper') || e.target.closest('.close-button')) {
      this.close();
    }
  }

  private _handleSubmit(e: TEvent) {
    e.preventDefault();
    this.props.onSubmit?.(e as SubmitEvent);
  }

  public open() {
    this.setProps({ isOpen: true });
  }

  public close() {
    this.setProps({ isOpen: false });
    (this.children.fileInput as FileInput)?.reset();
    this.props.onClose?.();
  }

  public getFile(): File | null {
    return (this.children.fileInput as FileInput)?.getFile() || null;
  }

  public getInputValue(): string {
    const content = this.children.content as Input;
    return content?.getValue?.() || '';
  }

  public resetInput(): void {
    const content = this.children.content as Input;
    content?.setProps?.({ value: '' });
  }

  render() {
    return this.compile(template, this.props);
  }
}
