import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import {
  debounceTime,
  distinctUntilChanged,
  Observable,
  startWith,
  switchMap,
} from 'rxjs';
import { UserInterface } from '../../../models/user.interface';
import {
  MatAutocomplete,
  MatAutocompleteSelectedEvent,
} from '@angular/material/autocomplete';
import { UserService } from '../../../public/services/user.service';
import { ChatService } from '../../services/chat.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-create-room',
  templateUrl: './create-room.component.html',
  styleUrls: ['./create-room.component.scss'],
})
export class CreateRoomComponent implements OnInit {
  @ViewChild('userInput', { static: false })
  userInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto', { static: false }) matAutocomplete: MatAutocomplete;
  private _createRoomForm: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required]),
    users: new FormArray([], [Validators.required, Validators.minLength(1)]),
  });

  public filteredUsers$: Observable<UserInterface[]>;
  private _userCtrl: FormControl = new FormControl<string>('');
  constructor(
    private _userService: UserService,
    private _chatService: ChatService,
    private _router: Router,
    private _activatedRoute: ActivatedRoute
  ) {}
  ngOnInit() {
    this.filteredUsers$ = this.userCtrl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      startWith(null),
      switchMap((user: string | null) => this._userService.findByUserName(user))
    );
  }

  private _initUser(user: UserInterface): FormControl {
    return new FormControl({
      id: user.id,
      username: user.username,
      email: user.email,
    });
  }
  get createRoomForm(): FormGroup {
    return this._createRoomForm;
  }

  get userCtrl(): FormControl {
    return this._userCtrl as FormControl;
  }
  get name(): FormControl {
    return this._createRoomForm.get('name') as FormControl;
  }

  get description(): FormControl {
    return this._createRoomForm.get('description') as FormControl;
  }

  get users(): FormArray {
    return this._createRoomForm.get('users') as FormArray;
  }

  public submitCreateRoomForm(): void {
    this._chatService.createRoom(this.createRoomForm.getRawValue());
    this._router.navigate(['../dashboard'], {
      relativeTo: this._activatedRoute,
    });
  }

  public remove(user: UserInterface): void {
    const index = this.users.value.indexOf(user);
    if (index >= 0) {
      this.users.removeAt(index);
    }
  }

  public selected(event: MatAutocompleteSelectedEvent): void {
    this.users.push(this._initUser(event.option.value));
    this.userInput.nativeElement.value = '';
    this.userCtrl.setValue(null);
  }
}
