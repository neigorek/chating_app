import { LoginUserDto } from "src/user/model/dto/login-user-dto";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateUserDto extends LoginUserDto {
    @IsString()
    @IsNotEmpty()
    username: string;
}
