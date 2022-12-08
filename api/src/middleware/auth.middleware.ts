import {
  HttpException,
  HttpStatus,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { NextFunction } from 'express';
import { AuthService } from 'src/auth/service/auth.service';
import { UserService } from 'src/user/service/user.service';
import { UserInterface } from 'src/user/model/user.interface';

export interface RequestModel extends Request {
  user: UserInterface;
}

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    private _authService: AuthService,
    private _userService: UserService,
  ) {}

  async use(req: RequestModel, res: Response, next: NextFunction) {
    try {
      const tokenArray: string[] = req.headers['authorization'].split(' ');
      const decodeToken = await this._authService.verifyJWT(tokenArray[1]);
      // make sure that the user is in repo
      const user: UserInterface = await this._userService.getOne(
        decodeToken.user.id,
      );
      if (user) {
        // add the user to the our request object so that we can access later if needed it
        req.user = user;
        next();
      } else {
        throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
      }
    } catch {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }
  }
}
