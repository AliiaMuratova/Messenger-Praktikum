import { Block } from '@/core/Block';
import { BlockProps } from '@/core/Block';
import template from './Profile.hbs?raw';
import { ProfileInputProps } from './components/ProfileInput/ProfileInput';
import sendIcon from '@/assets/icons/send_icon.svg';
import noImage from '@/assets/images/image-not-found.png';
import { ProfileInput } from './components/ProfileInput';
import { ProfileForm } from './components/ProfileForm';
import './Profile.pcss';
import { TEvent } from '@/types/common';
import { Modal } from '@/components/Modal';
import { authAPI, UserData } from '@/api/auth/AuthAPI';
import { profileAPI } from '@/api/profile/profileAPI';
import { handleError, ValidationError } from '@/utils/errorHandler/errorHandler';
import { BASE_URL } from '@/api/http/config';
import { Router } from '@/core/Router';

const profileFields: ProfileInputProps[] = [
  { name: 'email', label: 'Почта', value: '', type: 'email' },
  { name: 'login', label: 'Логин', value: '', type: 'text' },
  { name: 'first_name', label: 'Имя', value: '', type: 'text' },
  { name: 'second_name', label: 'Фамилия', value: '', type: 'text' },
  { name: 'display_name', label: 'Имя в чате', value: '', type: 'text' },
  { name: 'phone', label: 'Телефон', value: '', type: 'tel' },
];

const passwordFields: ProfileInputProps[] = [
  { name: 'oldPassword', label: 'Старый пароль', value: '', type: 'password', isPassword: true },
  { name: 'newPassword', label: 'Новый пароль', value: '', type: 'password', isPassword: true },
  { name: 'confirmPassword', label: 'Повторите новый пароль', value: '', type: 'password', isPassword: true },
];

interface ProfilePageProps extends BlockProps {
  sendIcon?: string;
  name: string;
  avatar?: string;
  noImage?: string;
  profileForm: ProfileForm;
  changeAvatarModal?: Modal;
}

export class ProfilePage extends Block<ProfilePageProps> {
  private profileInputs: ProfileInput[] = [];

  constructor() {
    const profileInputs = profileFields.map(f => new ProfileInput({
      ...f,
      isReadonly: true,
    }));
    const passwordInputs: ProfileInput[] = [];
    
    passwordFields.forEach(f => {
      const input = new ProfileInput({
        ...f,
        isReadonly: true,
        ...(f.name === 'newPassword' && {
          onBlur: () => {
            const confirmInput = passwordInputs.find(
              input => input.getName() === 'confirmPassword'
            );
            if (confirmInput?.getValue()) {
              confirmInput.validate();
            }
          }
        }),
        ...(f.name === 'confirmPassword' && {
          getCompareValue: () => {
            const newPasswordInput = passwordInputs.find(
              input => input.getName() === 'newPassword'
            );
            return newPasswordInput?.getValue() || '';
          }
        })
      });
      passwordInputs.push(input);
    });

    super({
      sendIcon,
      name: '',
      noImage,
      profileForm: new ProfileForm({
        profileFields: profileInputs,
        passwordFields: passwordInputs,
        isPasswordMode: false,
        isEditMode: false,
      }),
      changeAvatarModal: new Modal({
        title: 'Загрузите файл',
        buttonText: 'Поменять',
        changeAvatar: true, 
        onSubmit: () => this.handleUpdateAvatar(),
      }),
      events: {
        click: (e: TEvent) => {
          if (!(e.target instanceof HTMLElement)) return;

          if (e.target.closest('[data-modal]')) {
            (this.children.changeAvatarModal as Modal)?.open();
          }

          if (e.target.closest('[data-back]')) {
            Router.getInstance().go('/messenger');
          }
        },
      },
    });

    this.profileInputs = profileInputs;
  }

  protected componentDidMount(): void {
    this.loadUserData();
  }

  private async loadUserData(): Promise<void> {
    try {
      const user = await authAPI.getUser();
      this.setUserData(user);
    } catch (error) {
      handleError(error, { context: 'Загрузка данных пользователя' });
    }
  }

  private setUserData(user: UserData): void {
    const displayName = `${user.first_name} ${user.second_name}`;
    const avatar = user.avatar ? `${BASE_URL}resources${user.avatar}` : undefined;
    
    this.setProps({
      name: displayName,
      avatar,
    });

    this.profileInputs.forEach(input => {
      const fieldName = input.getName() as keyof UserData;
      const value = user[fieldName];
      input.setProps({ value: value != null ? String(value) : '' });
    });
  }

  private async handleUpdateAvatar(): Promise<void> {
    const modal = this.children.changeAvatarModal as Modal;
    const file = modal?.getFile();

    if (!file) {
      throw new ValidationError('Файл не выбран');
    }

    try {
      const updatedUser = await profileAPI.updateAvatar(file);
      const avatar = updatedUser.avatar ? `${BASE_URL}resources${updatedUser.avatar}` : undefined;
      this.setProps({ avatar });
      modal.close();
    } catch (error) {
      handleError(error, { context: 'Обновление аватара' });
    }
  }

  render() {
    const avatarSrc = this.props.avatar || noImage;
    return this.compile(template, { ...this.props, avatarSrc });
  }
}
