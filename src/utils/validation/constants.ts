import { ValidationType } from '@/utils/validation/types';

export const PATTERNS = {
  [ValidationType.FirstName]: /^[A-ZА-Я][a-zA-Zа-яА-Я]*(?:-[A-Za-zА-Яа-я]+)*$/,
  [ValidationType.SecondName]: /^[A-ZА-Я][a-zA-Zа-яА-Я]*(?:-[A-Za-zА-Яа-я]+)*$/,
  [ValidationType.Login]: /^(?=.*[a-zA-Z])[a-zA-Z0-9_-]{3,20}$/,
  [ValidationType.Email]: /^[a-zA-Z0-9_-]+@[a-zA-Z]+\.[a-zA-Z]+$/,
  [ValidationType.Password]: /^(?=.*[A-Z])(?=.*\d).{8,40}$/,
  [ValidationType.Phone]: /^\+?\d{10,15}$/,
  [ValidationType.Message]: /^.+$/,
};

export const ERRORS = {
  [ValidationType.FirstName]: 'Имя должно начинаться с заглавной буквы и содержать только буквы',
  [ValidationType.SecondName]: 'Фамилия должна начинаться с заглавной буквы и содержать только буквы',
  [ValidationType.Login]: 'Логин должен содержать только латинские буквы, цифры, дефис и нижнее подчеркивание',
  [ValidationType.Email]: 'Неверный email',
  [ValidationType.Password]: 'Пароль должен содержать хотя бы одну заглавную букву и одну цифру',
  [ValidationType.Phone]: 'Неверный номер телефона',
  [ValidationType.Message]: 'Поле не должно быть пустым',
};
