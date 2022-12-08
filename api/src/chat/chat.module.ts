import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { UserModule } from 'src/user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoomEntity } from 'src/chat/model/room.entity';
import { ChatGateway } from 'src/chat/gateway/chat.gateway';
import { RoomService } from 'src/chat/service/room-service/room-service.service';

@Module({
  imports: [AuthModule, UserModule, TypeOrmModule.forFeature([RoomEntity])],
  providers: [ChatGateway, RoomService],
})
export class ChatModule {}
