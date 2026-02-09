import { ValidationResult, ValidationType } from '@/utils/validation/types';
import { PATTERNS, ERRORS } from '@/utils/validation/constants';

export function validateInput(type: ValidationType, value: string): ValidationResult {
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
