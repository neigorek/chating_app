import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SocketCustom } from '../sockets/socket-custom';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  constructor(private _socket: SocketCustom) {}

  public sendMessage() {}

  public getMessage(): Observable<string> {
    return this._socket.fromEvent('message');
  }
}
