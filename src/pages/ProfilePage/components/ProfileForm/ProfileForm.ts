import { BlockProps } from '@/core/Block';
import { TEvent } from '@/types/common';
import { Block } from '@/core/Block';
import template from './ProfileForm.hbs?raw';
import { ProfileInput } from '../ProfileInput/ProfileInput';
import { Button } from '@/components/common/Button';
import './ProfileForm.pcss';

interface ProfileFormProps extends BlockProps {
  profileFields: ProfileInput[];
  passwordFields: ProfileInput[];
  isPasswordMode: boolean;
  isEditMode: boolean;
  cancelButton?: Button;
  saveButton?: Button;
}

export class ProfileForm extends Block<ProfileFormProps> {
  constructor(props: ProfileFormProps) {
    super({
      ...props,
      cancelButton: new Button({
        text: 'Отмена',
        type: 'button',
        class: 'submit-buttons__cancel',
        id: 'cancelButton',
      }),
      saveButton: new Button({
        text: 'Сохранить',
        type: 'submit',
        class: 'submit-buttons__btn',
        id: 'saveProfileData',
      }),
      events: {
        submit: (e: TEvent) => this._handleFormSubmit(e),
        click: (e: TEvent) => this._handleButtonsClick(e),
      },
    });
  }

  private _handleButtonsClick(e: TEvent) {
    const event = e as MouseEvent;
    const target = event.target as HTMLElement;
    const button = target.closest('button');
    if (!button || button.type === 'submit') return;

    const isEditProfile = button.id === 'editProfile';
    const isEditPassword = button.id === 'editPassword';
    const isCancelButton = button.id === 'cancelButton';

    if (isEditProfile || isEditPassword) {
      this.setChildrenProps('profileFields', { isReadonly: !isEditProfile });
      this.setChildrenProps('passwordFields', { isReadonly: !isEditPassword });

      this.setProps({
        isEditMode: true,
        isPasswordMode: isEditPassword
      });
    } else if (isCancelButton) {
      this.setChildrenProps('profileFields', { isReadonly: true });
      this.setChildrenProps('passwordFields', { isReadonly: true });

      this.setProps({
        isEditMode: false,
        isPasswordMode: false
      });
    }
  }

  private _handleFormSubmit(e: TEvent) {
    const event = e as SubmitEvent;
    event.preventDefault();

    const profileFields = this.children.profileFields as ProfileInput[];
    const passwordFields = this.children.passwordFields as ProfileInput[];

    const activeInputs = this.props.isPasswordMode ? passwordFields : profileFields;

    if (!activeInputs) return;

    const isFormValid = activeInputs.every(input => input.validate());
    if (!isFormValid) return;

    const formData = new FormData(event.target as HTMLFormElement);
    const data = Object.fromEntries(formData.entries());
    console.log('Данные формы:', data);

    activeInputs.forEach(input => {
      const inputElement = input.element?.querySelector('input') as HTMLInputElement;
      if (inputElement) {
        input.setProps({
          value: inputElement.value,
          isReadonly: true
        });
      }
    });

    this.setProps({
      isEditMode: false,
      isPasswordMode: false
    });
  }

  render() {
    return this.compile(template, this.props);
  }
}
