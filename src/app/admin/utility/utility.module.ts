import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UtilityRoutingModule } from './utility-routing.module';
import { UtilityComponent } from './utility.component';
import { AdminWidgetsModule } from '../admin-widgets/admin-widgets.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatPaginatorModule } from '@angular/material/paginator';
import { DatabaseService } from 'src/app/services/database.service';

@NgModule({
  declarations: [UtilityComponent],
  imports: [
    CommonModule,
    UtilityRoutingModule,
    AdminWidgetsModule,
    FormsModule,
    ReactiveFormsModule,
    MatPaginatorModule,
  ],
  providers: [DatabaseService],
})
export class UtilityModule {}
