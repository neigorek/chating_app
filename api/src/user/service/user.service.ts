import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/user/model/user.entity';
import { Repository } from 'typeorm';
import { UserInterface } from 'src/user/model/user.interface';
import { from, map, mapTo, Observable, switchMap } from 'rxjs';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';
import * as bcrypt from 'bcrypt';
import { AuthService } from 'src/auth/service/auth.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private _authService: AuthService,
  ) {}

  public create(newUser: UserInterface): Observable<UserInterface> {
    return this._mailExist(newUser.email).pipe(
      switchMap((exist: boolean) => {
        if (exist === false) {
          return this._hashPassword(newUser.password).pipe(
            switchMap((passwordHash: string) => {
              newUser.password = passwordHash;
              return from(this.userRepository.save(newUser)).pipe(
                switchMap((usr) => this._findOne(usr.id)),
              );
            }),
          );
        } else {
          throw new HttpException(
            'Email is already in use',
            HttpStatus.CONFLICT,
          );
        }
      }),
    );
  }

  public login(user: UserInterface): Observable<string> {
    return this._findByEmail(user.email).pipe(
      switchMap((foundUser: UserInterface) => {
        if (foundUser) {
          return this._validatePassword(user.password, foundUser.password).pipe(
            switchMap((matches: boolean) => {
              if (matches) {
                return this._findOne(foundUser.id).pipe(
                  switchMap((user: UserInterface) =>
                    this._authService.generateJWT(user),
                  ),
                );
              } else {
                throw new HttpException(
                  'Wrong Password',
                  HttpStatus.UNAUTHORIZED,
                );
              }
            }),
          );
        } else {
          throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        }
      }),
    );
  }

  public findAll(
    options: IPaginationOptions,
  ): Observable<Pagination<UserInterface>> {
    return from(paginate<UserEntity>(this.userRepository, options));
  }

  private _findOne(id: number): Observable<UserInterface> {
    return from(this.userRepository.findOne({ where: { id } }));
  }

  private _hashPassword(password: string): Observable<string> {
    return from<string>(bcrypt.hash(password, 12));
  }

  private _validatePassword(
    password: string,
    storedPasswordHash: string,
  ): Observable<any> {
    return from(bcrypt.compare(password, storedPasswordHash));
  }

  private _findByEmail(email: string): Observable<UserInterface> {
    return from(
      this.userRepository.findOne({
        where: { email },
        select: ['id', 'email', 'password', 'username'],
      }),
    );
  }

  private _mailExist(email: string): Observable<boolean> {
    return from(this.userRepository.findOne({ where: { email } })).pipe(
      map((usr: UserInterface) => {
        if (usr) {
          return true;
        } else {
          return false;
        }
      }),
    );
  }
}
