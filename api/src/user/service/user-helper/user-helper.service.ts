import { Injectable } from '@nestjs/common';
import { CreateUserDto } from "src/user/model/dto/create-user-dto";
import { Observable, of } from "rxjs";
import { UserInterface } from "src/user/model/user.interface";
import { LoginUserDto } from "src/user/model/dto/login-user-dto";

@Injectable()
export class UserHelperService {
    createUserDtoToEntity(createUserDto: CreateUserDto): Observable<UserInterface> {
        return of({
            email: createUserDto.email,
            password: createUserDto.password,
            username: createUserDto.username
        })
    }

    loginUserDtoToEntity(loginUserDto: LoginUserDto): Observable<UserInterface> {
        return of({
            email: loginUserDto.email,
            password: loginUserDto.password
        })
    }
}
