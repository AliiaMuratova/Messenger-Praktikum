import { BlockProps } from '@/core/Block';
import { TEvent } from '@/types/common';
import { Block } from '@/core/Block';
import template from './ProfileForm.hbs?raw';
import { ProfileInput } from '../ProfileInput/ProfileInput';
import { Button } from '@/components/common/Button';
import './ProfileForm.pcss';
import { handleError } from '@/utils/errorHandler/errorHandler';
import { profileAPI, ProfileData, ProfilePassword } from '@/api/profile/profileAPI';
import { Router } from '@/core/Router';
import { authAPI } from '@/api/auth/AuthAPI';

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
    const target = event.target;

    if (!(target instanceof HTMLElement)) return;

    const button = target.closest('button');
    if (!button || button.type === 'submit') return;

    const isEditProfile = button.id === 'editProfile';
    const isEditPassword = button.id === 'editPassword';
    const isCancelButton = button.id === 'cancelButton';
    const isLogout = button.id === 'logout';

    if (isEditProfile || isEditPassword) {
      this.setChildrenProps('profileFields', { isReadonly: !isEditProfile });
      this.setChildrenProps('passwordFields', { isReadonly: !isEditPassword });

      this.setProps({
        isEditMode: true,
        isPasswordMode: isEditPassword
      });
    } else if (isCancelButton) {
      const profileFields = this.children.profileFields as ProfileInput[];
      const passwordFields = this.children.passwordFields as ProfileInput[];

      profileFields.forEach(input => input.clearError());
      passwordFields.forEach(input => input.clearError());

      this.setChildrenProps('profileFields', { isReadonly: true });
      this.setChildrenProps('passwordFields', { isReadonly: true });

      this.setProps({
        isEditMode: false,
        isPasswordMode: false
      });
    } else if (isLogout) {
      this.handleLogout();
    }
  }

  private _handleFormSubmit(e: TEvent) {
    const event = e as SubmitEvent;
    event.preventDefault();

    const profileFields = this.children.profileFields as ProfileInput[];
    const passwordFields = this.children.passwordFields as ProfileInput[];

    const activeInputs = this.props.isPasswordMode ? passwordFields : profileFields;

    if (!activeInputs) return;

    const validationResults = activeInputs.map(input => input.validate());
    const isFormValid = validationResults.every(Boolean);
    if (!isFormValid) return;

    if (!(event.target instanceof HTMLFormElement)) return;

    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());

    if (this.props.isPasswordMode) {
      const passwordData: ProfilePassword = {
        oldPassword: data.oldPassword as string,
        newPassword: data.newPassword as string,
      };
      this.handleUpdatePassword(passwordData);
    } else {
      this.handleUpdateProfile(data as unknown as ProfileData);
    }

    activeInputs.forEach(input => {
      const inputElement = input.element?.querySelector<HTMLInputElement>('input');
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

  private async handleUpdateProfile(data: ProfileData): Promise<void> {
    try {
      await profileAPI.updateData(data);
    } catch (error) {
      handleError(error, { context: 'Обновление профиля' });
    }
  }

  private async handleUpdatePassword(data: ProfilePassword): Promise<void> {
    try {
      await profileAPI.updatePassword(data);
    } catch (error) {
      handleError(error, { context: 'Обновление пароля' });
    }
  }

  private async handleLogout(): Promise<void> {
    try {
      await authAPI.logout();
      Router.getInstance().go('/');
    } catch (error) {
      handleError(error, { context: 'Выход из системы' });
    }
  }
  
  render() {
    return this.compile(template, this.props);
  }
}
