import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EmployeesRoutingModule } from './employees-routing.module';
import { EmployeesComponent } from './employees.component';
import { AdminWidgetsModule } from '../admin-widgets/admin-widgets.module';
import { EmployeePageComponent } from './employee-page/employee-page.component';

@NgModule({
  declarations: [EmployeesComponent, EmployeePageComponent],
  imports: [
    CommonModule,
    EmployeesRoutingModule,
    AdminWidgetsModule,
    FormsModule,
    ReactiveFormsModule,
  ],
})
export class EmployeesModule {}
