import { Component, OnInit } from '@angular/core';
import { App, AppService } from "./services/app.service";
import { Observable } from "rxjs";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  constructor(private _appService: AppService) {
  }
  title: Observable<App> = this._appService.getAppTest();

  ngOnInit() {}
}
