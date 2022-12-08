import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SocketCustom } from '../sockets/socket-custom';
import {
  RoomInterface,
  RoomPaginationInterface,
} from '../../models/rooms.interface';
import { UserInterface } from '../../models/user.interface';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  constructor(private _socket: SocketCustom) {}

  public sendMessage() {}

  public getMessage(): Observable<string> {
    return this._socket.fromEvent('message');
  }

  public getMyRooms(): Observable<RoomPaginationInterface> {
    return this._socket.fromEvent<RoomPaginationInterface>('rooms');
  }

  public createRoom() {
    const user: UserInterface = {
      id: 34,
    };

    const room: RoomInterface = {
      name: 'Test Name Room',
      users: [user],
    };

    this._socket.emit('createRoom', room);
  }
}
