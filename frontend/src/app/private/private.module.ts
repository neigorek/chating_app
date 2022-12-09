import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PrivateRoutingModule } from './private-routing.module';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { MatListModule } from '@angular/material/list';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatChipsModule } from '@angular/material/chips';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatIconModule } from '@angular/material/icon';
import { CreateRoomComponent } from './components/create-room/create-room.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatCardModule } from '@angular/material/card';
import { MatLegacyChipsModule } from '@angular/material/legacy-chips';
import { MaterialModule } from '../material/material.module';

@NgModule({
  declarations: [DashboardComponent, CreateRoomComponent],
  imports: [
    CommonModule,
    PrivateRoutingModule,
    ReactiveFormsModule,
    MaterialModule,
  ],
})
export class PrivateModule {}
