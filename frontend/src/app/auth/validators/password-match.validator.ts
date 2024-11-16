import { ValidatorFn } from '@angular/forms';

export const passwordMatchValidator: (
  password: string,
  retypePassword: string
) => ValidatorFn = (password, retypePassword) => {
  return (control) => {
    const passwordControl = control.get(password);
    const retypePasswordControl = control.get(retypePassword);
    if (!passwordControl || !retypePasswordControl) return null;

    if (passwordControl.value === retypePasswordControl.value) return null;

    return {
      passwordMatch: true,
    };
  };
};
