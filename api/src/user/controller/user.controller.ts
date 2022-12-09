import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { UserService } from 'src/user/service/user.service';
import { CreateUserDto } from 'src/user/model/dto/create-user-dto';
import { UserHelperService } from 'src/user/service/user-helper/user-helper.service';
import { UserInterface } from 'src/user/model/user.interface';
import { Pagination } from 'nestjs-typeorm-paginate';
import { LoginUserDto } from 'src/user/model/dto/login-user-dto';
import { LoginResponseInterface } from 'src/user/model/login-response.interface';

@Controller('user')
export class UserController {
  constructor(
    private _userService: UserService,
    private _userHelperService: UserHelperService,
  ) {}

  @Post()
  async createUser(
    @Body() createUserDTO: CreateUserDto,
  ): Promise<UserInterface> {
    const userEntity =
      this._userHelperService.createUserDtoToEntity(createUserDTO);
    return this._userService.create(userEntity);
  }

  @Get()
  async findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ): Promise<Pagination<UserInterface>> {
    limit = limit > 100 ? 100 : limit;
    return this._userService.findAll({
      page,
      limit,
      route: 'http://localhost:3000/api/user',
    });
  }

  @Post('login')
  async login(
    @Body() loginUserDTO: LoginUserDto,
  ): Promise<LoginResponseInterface> {
    const userEntity: UserInterface =
      this._userHelperService.loginUserDtoToEntity(loginUserDTO);
    const jwt: string = await this._userService.login(userEntity);
    const loginResponse: LoginResponseInterface = {
      access_token: jwt,
      token_type: 'JWT',
      expire_in: 10000,
    };
    return loginResponse;
  }

  @Get('find-by-username')
  async findAllByUserName(@Query('username') username: string) {
    return this._userService.findAllByUserName(username);
  }
}
