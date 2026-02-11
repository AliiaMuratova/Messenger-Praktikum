import { ValidationResult, ValidationType } from '@/utils/validation/types';
import { PATTERNS, ERRORS } from '@/utils/validation/constants';

export function validateInput(type: ValidationType, value: string, secondValue?: string): ValidationResult {
  if (type === ValidationType.ConfirmPassword) {
    const isMatch = value === secondValue;
    return {
      isValid: isMatch,
      message: isMatch ? '' : (ERRORS[ValidationType.ConfirmPassword] || 'Пароли не совпадают'),
    };
  }

  const pattern = PATTERNS[type];
  
  if (!pattern) {
    return { isValid: true, message: '' };
  }

  const isValid = pattern.test(value);

  if (type === ValidationType.Message) {
    return { isValid, message: '' };
  }

  return {
    isValid,
    message: isValid ? '' : (ERRORS[type] || 'Ошибка валидации'),
  };
}
