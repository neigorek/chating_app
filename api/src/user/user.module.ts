import { Module } from '@nestjs/common';
import { UserService } from './service/user.service';
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserEntity } from "src/user/model/user.entity";
import { UserController } from "src/user/controller/user.controller";
import { UserHelperService } from "src/user/service/user-helper/user-helper.service";

@Module({
  imports: [
      TypeOrmModule.forFeature([UserEntity])
  ],
  controllers: [UserController],
  providers: [UserService, UserHelperService]
})
export class UserModule {}
