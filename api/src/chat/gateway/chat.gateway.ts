import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { AuthService } from 'src/auth/service/auth.service';
import { Server, Socket } from 'socket.io';
import { UserService } from 'src/user/service/user.service';
import { UserInterface } from 'src/user/model/user.interface';
import { UnauthorizedException } from '@nestjs/common';
import { RoomService } from 'src/chat/service/room-service/room-service.service';
import { RoomInterface } from 'src/chat/model/room.interface';
import { PageInterface } from 'src/chat/model/page.interface';

@WebSocketGateway({
  cors: { origin: ['https://hoppscotch.io', 'http://localhost:4200'] },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    private _authService: AuthService,
    private _userService: UserService,
    private _roomService: RoomService,
  ) {}
  @WebSocketServer()
  private _server: Server;

  async handleConnection(socket: Socket, ...args): Promise<any> {
    try {
      const decodeToken = await this._authService.verifyJWT(
        socket.handshake.headers.authorization,
      );
      const user: UserInterface = await this._userService.getOne(
        decodeToken.id,
      );
      if (!user) {
        return this._disconnect(socket);
      } else {
        socket.data.user = user;
        const rooms = await this._roomService.getRoomsForUser(user.id, {
          page: 1,
          limit: 10,
        });
        rooms.meta.currentPage = rooms.meta.currentPage - 1;
        // Only emit rooms to the specific connected client
        return this._server.to(socket.id).emit('rooms', rooms);
      }
    } catch {
      return this._disconnect(socket);
    }
  }

  handleDisconnect(socket: Socket): void {
    socket.disconnect();
  }

  private _disconnect(socket: Socket): void {
    socket.emit('message', new UnauthorizedException());
    socket.disconnect();
  }

  @SubscribeMessage('createRoom')
  async createRoom(
    socket: Socket,
    room: RoomInterface,
  ): Promise<RoomInterface> {
    return this._roomService.createRoom(room, socket.data.user);
  }

  @SubscribeMessage('paginateRooms')
  async paginateRooms(socket: Socket, page: PageInterface) {
    page.limit = page.limit > 100 ? 100 : page.limit;
    page.page = page.page + 1;
    const rooms = await this._roomService.getRoomsForUser(
      socket.data.user?.id,
      page,
    );
    rooms.meta.currentPage = rooms.meta.currentPage - 1;
    return this._server.to(socket.id).emit('rooms', rooms);
  }
}
