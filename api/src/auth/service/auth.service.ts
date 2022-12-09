import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserInterface } from 'src/user/model/user.interface';

@Injectable()
export class AuthService {
  constructor(private readonly _jwtService: JwtService) {}

  public async generateJWT(user: UserInterface): Promise<string> {
    return this._jwtService.signAsync({ user });
  }

  public async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 12);
  }

  public async comparePasswords(
    password: string,
    storedPasswordHash: string,
  ): Promise<any> {
    return bcrypt.compare(password, storedPasswordHash);
  }

  public verifyJWT(jwt: string): Promise<any> {
    return this._jwtService.verifyAsync(jwt);
  }
}
