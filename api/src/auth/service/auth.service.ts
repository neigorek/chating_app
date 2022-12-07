import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { from, Observable } from 'rxjs';
import * as bcrypt from 'bcrypt';
import { UserInterface } from 'src/user/model/user.interface';

@Injectable()
export class AuthService {
  constructor(private readonly _jwtService: JwtService) {}

  public generateJWT(user: UserInterface): Observable<string> {
    return from(this._jwtService.signAsync({ user }));
  }

  public hashPassword(password: string): Observable<string> {
    return from<string>(bcrypt.hash(password, 12));
  }

  public comparePasswords(
    password: string,
    storedPasswordHash: string,
  ): Observable<any> {
    return from(bcrypt.compare(password, storedPasswordHash));
  }
}
