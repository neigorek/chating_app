import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { UserService } from "src/user/service/user.service";
import { Observable, of, switchMap } from "rxjs";
import { CreateUserDto } from "src/user/model/dto/create-user-dto";
import { UserHelperService } from "src/user/service/user-helper/user-helper.service";
import { UserInterface } from "src/user/model/user.interface";
import { Pagination } from "nestjs-typeorm-paginate";
import { LoginUserDto } from "src/user/model/dto/login-user-dto";

@Controller('user')
export class UserController {
    constructor(private _userService: UserService, private _userHelperService: UserHelperService) {
    }

    @Post()
    createUser(@Body() createUserDTO: CreateUserDto): Observable<UserInterface> {
        return this._userHelperService.createUserDtoToEntity(createUserDTO)
            .pipe(switchMap((usr: UserInterface) => this._userService.create(usr)));
    }

    @Get()
    findAll(
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 10,
    ): Observable<Pagination<UserInterface>> {
        limit = limit > 100 ? 100 : limit;
        return this._userService.findAll({page, limit, route: 'http://localhost:3000/api/user'});
    }

    @Post('login')
    login(@Body() loginUserDTO: LoginUserDto): Observable<boolean> {
        return this._userHelperService.loginUserDtoToEntity(loginUserDTO)
            .pipe(switchMap((user) => this._userService.login(user)));
    }
}
