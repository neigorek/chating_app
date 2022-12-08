import { Component, OnInit } from '@angular/core';
import { ChatService } from '../../services/chat.service';
import { Observable } from 'rxjs';
import { RoomPaginationInterface } from '../../../models/rooms.interface';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  constructor(private _chatService: ChatService) {}

  public rooms$: Observable<RoomPaginationInterface> =
    this._chatService.getMyRooms();

  public title: Observable<string> = this._chatService.getMessage();

  ngOnInit() {
    this._chatService.createRoom();
  }
}
