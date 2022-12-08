import { Module } from '@nestjs/common';
import { GatewayGateway } from './gateway/gateway.gateway';
import { AuthModule } from 'src/auth/auth.module';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [AuthModule, UserModule],
  providers: [GatewayGateway],
})
export class ChatModule {}
