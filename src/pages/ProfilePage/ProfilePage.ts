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

const profileFields: ProfileInputProps[] = [
  { name: 'email', label: 'Почта', value: 'pochta@yandex.ru', type: 'email' },
  { name: 'login', label: 'Логин', value: 'ivanivanov', type: 'text' },
  { name: 'first_name', label: 'Имя', value: 'Иван', type: 'text' },
  { name: 'second_name', label: 'Фамилия', value: 'Иванов', type: 'text' },
  { name: 'display_name', label: 'Имя в чате', value: 'Иван', type: 'text' },
  { name: 'phone', label: 'Телефон', value: '+79099673030', type: 'tel' },
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
      name: 'Иван Иванов',
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
        onSubmit: () => {
          const modal = this.children.changeAvatarModal as Modal;
          const file = modal?.getFile();
        
          if (!file) {
            return;
          }
          console.log('файл: ', file.name);
          modal.close();
        }
      }),
      events: {
        click: (e: TEvent) => {
          if (!(e.target instanceof HTMLElement)) return;

          if (e.target.closest('[data-modal]')) {
            (this.children.changeAvatarModal as Modal)?.open();
          }
        },
      },
    });
  }


  render() {
    const avatarSrc = this.props.avatar || noImage;
    return this.compile(template, { ...this.props, avatarSrc });
  }
}
