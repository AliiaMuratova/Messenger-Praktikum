import { ValidationType } from '@/utils/validation/types';

const REGEX = {
  NAME: /^[A-ZА-ЯЁ][a-zA-Zа-яА-ЯёЁ]*(?:-[A-Za-zА-Яа-яёЁ]+)*$/,
  LOGIN: /^(?=.*[a-zA-Z])[a-zA-Z0-9_-]{3,20}$/,
  EMAIL: /^[a-zA-Z0-9_-]+@[a-zA-Z]+\.[a-zA-Z]+$/,
  PASSWORD: /^(?=.*[A-Z])(?=.*\d).{8,40}$/,
  PHONE: /^\+?\d{10,15}$/,
  NOT_EMPTY: /^.+$/,
} as const;

export const PATTERNS: Partial<Record<ValidationType, RegExp>> = {
  [ValidationType.FirstName]: REGEX.NAME,
  [ValidationType.SecondName]: REGEX.NAME,
  [ValidationType.Login]: REGEX.LOGIN,
  [ValidationType.Email]: REGEX.EMAIL,
  [ValidationType.Password]: REGEX.PASSWORD,
  [ValidationType.Phone]: REGEX.PHONE,
  [ValidationType.Message]: REGEX.NOT_EMPTY,
  [ValidationType.OldPassword]: REGEX.PASSWORD,
  [ValidationType.NewPassword]: REGEX.PASSWORD,
};

export const ERRORS = {
  [ValidationType.FirstName]: 'Имя должно начинаться с заглавной буквы и содержать только буквы',
  [ValidationType.SecondName]: 'Фамилия должна начинаться с заглавной буквы и содержать только буквы',
  [ValidationType.Login]: 'Логин должен содержать только латинские буквы, цифры, дефис и нижнее подчеркивание',
  [ValidationType.Email]: 'Неверный email',
  [ValidationType.Password]: 'Пароль должен содержать хотя бы одну заглавную букву и одну цифру',
  [ValidationType.Phone]: 'Неверный номер телефона',
  [ValidationType.Message]: 'Поле не должно быть пустым',
  [ValidationType.OldPassword]: 'Пароль должен содержать хотя бы одну заглавную букву и одну цифру',
  [ValidationType.NewPassword]: 'Пароль должен содержать хотя бы одну заглавную букву и одну цифру',
  [ValidationType.ConfirmPassword]: 'Пароли не совпадают',
};
