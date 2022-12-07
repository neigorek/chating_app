import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { tap } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  constructor(private _router: Router, private _authService: AuthService) {}
  private _loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
  });

  get loginForm(): FormGroup {
    return this._loginForm;
  }

  get email(): FormControl {
    return this._loginForm.get('email') as FormControl;
  }

  get password(): FormControl {
    return this._loginForm.get('password') as FormControl;
  }

  public submitLoginForm(): void {
    if (this._loginForm.valid) {
      this._authService
        .login({
          email: this.email.value,
          password: this.password.value,
        })
        .pipe(tap(() => this._router.navigate(['/../private/dashboard'])))
        .subscribe();
    }
  }
}
