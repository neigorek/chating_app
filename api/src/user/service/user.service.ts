import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/user/model/user.entity';
import { Like, Repository } from 'typeorm';
import { UserInterface } from 'src/user/model/user.interface';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';
import { AuthService } from 'src/auth/service/auth.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private _authService: AuthService,
  ) {}

  public async create(newUser: UserInterface): Promise<UserInterface> {
    try {
      const existing: boolean = await this._mailExist(newUser.email);
      if (!existing) {
        const passwordHash: string = await this._authService.hashPassword(
          newUser.password,
        );
        newUser.password = passwordHash;
        const user: UserInterface = await this.userRepository.save(
          this.userRepository.create(newUser),
        );
        return this._findOne(user.id);
      }
    } catch {
      throw new HttpException('Email is already in use', HttpStatus.CONFLICT);
    }
  }

  public async login(user: UserInterface): Promise<string> {
    try {
      const foundUser: UserInterface = await this._findByEmail(
        user.email.toLowerCase(),
      );
      if (foundUser) {
        const matches = await this._authService.comparePasswords(
          user.password,
          foundUser.password,
        );
        if (matches) {
          const payload: UserInterface = await this._findOne(user.id);
          return this._authService.generateJWT(payload);
        } else {
          throw new HttpException('Wrong Password', HttpStatus.UNAUTHORIZED);
        }
      } else {
        throw new HttpException('Wrong Password', HttpStatus.UNAUTHORIZED);
      }
    } catch {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
  }

  public async findAll(
    options: IPaginationOptions,
  ): Promise<Pagination<UserInterface>> {
    return paginate<UserEntity>(this.userRepository, options);
  }

  private async _findOne(id: number): Promise<UserInterface> {
    return this.userRepository.findOne({ where: { id } });
  }

  private async _findByEmail(email: string): Promise<UserInterface> {
    return this.userRepository.findOne({
      where: { email },
      select: ['id', 'email', 'password', 'username'],
    });
  }

  public async getOne(id: number): Promise<UserInterface> {
    return this.userRepository.findOneOrFail({ where: { id } });
  }

  private async _mailExist(email: string): Promise<boolean> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (user) {
      return true;
    } else {
      return false;
    }
  }

  public async findAllByUserName(username: string): Promise<UserInterface[]> {
    return this.userRepository.find({
      where: { username: Like(`%${username.toLowerCase()}%`) },
    });
  }
}
