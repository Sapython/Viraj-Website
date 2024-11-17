import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmployeePageComponent } from './employee-page/employee-page.component';
import { EmployeesComponent } from './employees.component';

const routes: Routes = [
  { path: '', component: EmployeesComponent },
  { path: '**', component: EmployeePageComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EmployeesRoutingModule {}
