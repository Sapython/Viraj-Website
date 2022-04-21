import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EmployeesRoutingModule } from './employees-routing.module';
import { EmployeesComponent } from './employees.component';
import { AdminWidgetsModule } from '../admin-widgets/admin-widgets.module';

@NgModule({
  declarations: [
    EmployeesComponent
  ],
  imports: [
    CommonModule,
    EmployeesRoutingModule,
    AdminWidgetsModule
  ]
})
export class EmployeesModule { }
