import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { ChatService } from '../../services/chat.service';
import { Observable, Subject } from 'rxjs';
import {
  RoomInterface,
  RoomPaginationInterface,
} from '../../../models/rooms.interface';
import { PageEvent } from '@angular/material/paginator';
import { MatSelectionListChange } from '@angular/material/list';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit, OnDestroy, AfterViewInit {
  constructor(private _chatService: ChatService) {}

  private _unsubscribe$ = new Subject<boolean>();
  public rooms$: Observable<RoomPaginationInterface> =
    this._chatService.getMyRooms();
  public selectedRoom: RoomInterface;

  public title: Observable<string> = this._chatService.getMessage();

  ngOnInit() {
    this._chatService.paginateRooms(10, 0);
  }

  ngAfterViewInit() {
    this._chatService.paginateRooms(10, 0);
  }

  selectRoom(event: MatSelectionListChange): void {
    this.selectedRoom = event.source.selectedOptions.selected[0].value;
  }

  onPaginateRooms(page: PageEvent): void {
    this._chatService.paginateRooms(page.pageSize, page.pageIndex);
  }

  ngOnDestroy() {
    this._unsubscribe$.next(null);
    this._unsubscribe$.complete();
  }
}
