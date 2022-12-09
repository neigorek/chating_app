import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SocketCustom } from '../sockets/socket-custom';
import {
  RoomInterface,
  RoomPaginationInterface,
} from '../../models/rooms.interface';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  constructor(private _socket: SocketCustom, private _snackBar: MatSnackBar) {}

  public sendMessage() {}

  public getMessage(): Observable<string> {
    return this._socket.fromEvent('message');
  }

  public getMyRooms(): Observable<RoomPaginationInterface> {
    return this._socket.fromEvent<RoomPaginationInterface>('rooms');
  }

  public createRoom(room: RoomInterface) {
    this._socket.emit('createRoom', room);
    this._snackBar.open(`Room ${room.name}, was successfully created`);
  }

  public paginateRooms(limit: number, page: number): void {
    this._socket.emit('paginateRooms', { limit, page });
  }
}
