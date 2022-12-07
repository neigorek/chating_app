import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserInterface } from '../../models/user.interface';
import { Observable, take, tap } from 'rxjs';
import { LoginResponseInterface } from '../../models/login-response.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private _http: HttpClient, private _snackBar: MatSnackBar) {}

  public login(user: UserInterface): Observable<LoginResponseInterface> {
    return this._http.post<LoginResponseInterface>('api/user/login', user).pipe(
      take(1),
      tap((loginRes: LoginResponseInterface) =>
        localStorage.setItem('access_token', loginRes.access_token)
      ),
      tap(() => {
        this._snackBar.open(`Login successfully`, `Close`, {
          duration: 5000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
        });
      })
    );
  }
}
