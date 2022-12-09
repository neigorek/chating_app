import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError, Observable, take, tap, throwError } from 'rxjs';
import { UserInterface } from '../../models/user.interface';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private _http: HttpClient, private _snackBar: MatSnackBar) {}

  public create(user: UserInterface): Observable<UserInterface> {
    return this._http.post('api/user', user).pipe(
      take(1),
      tap((createdUser: UserInterface) => {
        this._snackBar.open(
          `User ${createdUser.username}, was successfully created`
        );
      }),
      catchError((err) => {
        this._snackBar.open(
          `User can not created, due to: ${err.error.message}`,
          `Close`,
          {
            duration: 5000,
            horizontalPosition: 'right',
            verticalPosition: 'top',
          }
        );
        return throwError(err);
      })
    );
  }

  public findByUserName(username: string): Observable<UserInterface[]> {
    return this._http.get<UserInterface[]>(
      `/api/user/find-by-username?username=${username}`
    );
  }
}
