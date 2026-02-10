export interface ValidationResult {
  isValid: boolean;
  message: string;
}

export enum ValidationType {
  FirstName = 'first_name',
  SecondName = 'second_name',
  Login = 'login',
  Email = 'email',
  Password = 'password',
  Phone = 'phone',
  Message = 'message',
  OldPassword = 'oldPassword',
  NewPassword = 'newPassword',
  ConfirmPassword = 'confirmPassword',
}
