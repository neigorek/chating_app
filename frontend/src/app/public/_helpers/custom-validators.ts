import { AbstractControl, ValidationErrors } from '@angular/forms';

export class CustomValidators {
  static passwordMatching(control: AbstractControl): ValidationErrors | null {
    const password = control.parent?.get('password')?.value;
    const passwordConfirm = control.parent?.get('passwordConfirm')?.value;
    if (!!password && !!passwordConfirm && password !== passwordConfirm) {
      return { passwordNotMatching: true };
    } else {
      return null;
    }
  }
}
