import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { AuthService } from 'src/auth/service/auth.service';
import { Server, Socket } from 'socket.io';
import { UserService } from 'src/user/service/user.service';
import { UserInterface } from 'src/user/model/user.interface';
import { UnauthorizedException } from '@nestjs/common';

@WebSocketGateway({
  cors: { origin: ['https://hoppscotch.io', 'http://localhost:4200'] },
})
export class GatewayGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    private _authService: AuthService,
    private _userService: UserService,
  ) {}
  @WebSocketServer()
  private _server: Server;

  private _title: string[] = [];

  async handleConnection(socket: Socket, ...args): Promise<any> {
    try {
      const decodeToken = await this._authService.verifyJWT(
        socket.handshake.headers.authorization,
      );
      const user: UserInterface = await this._userService.getOne(
        decodeToken.id,
      );
      if (!user) {
        // disconnect
        return this._disconnect(socket);
      } else {
        this._title.push(`Value ${Math.random()}`);
        this._server.emit('message', this._title);
      }
    } catch {
      return this._disconnect(socket);
    }
  }

  handleDisconnect(socket: Socket): void {
    console.log('disconnect');
    socket.disconnect();
  }

  private _disconnect(socket: Socket): void {
    socket.emit('message', new UnauthorizedException());
    socket.disconnect();
  }
}
