import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CustomValidators } from '../../_helpers/custom-validators';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { tap } from 'rxjs';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  constructor(private _userService: UserService, private _router: Router) {}
  private _registerForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
    passwordConfirm: new FormControl('', [
      Validators.required,
      CustomValidators.passwordMatching,
    ]),
  });

  get registerForm(): FormGroup {
    return this._registerForm;
  }

  get email(): FormControl {
    return this._registerForm.get('email') as FormControl;
  }

  get username(): FormControl {
    return this._registerForm.get('username') as FormControl;
  }

  get password(): FormControl {
    return this._registerForm.get('password') as FormControl;
  }

  get passwordConfirm(): FormControl {
    return this._registerForm.get('passwordConfirm') as FormControl;
  }

  public submitRegisterForm(): void {
    if (this._registerForm.valid) {
      this._userService
        .create({
          email: this.email.value,
          username: this.username.value,
          password: this.password.value,
        })
        .pipe(tap(() => this._router.navigate(['../login'])))
        .subscribe();
    }
  }
}
