import { Component } from '@angular/core';
import { ChatService } from '../../services/chat.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent {
  constructor(private _chatService: ChatService) {}

  public title: Observable<string> = this._chatService.getMessage();
}
