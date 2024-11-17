import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CustomersRoutingModule } from './customers-routing.module';
import { CustomersComponent } from './customers.component';
import { AdminWidgetsModule } from '../admin-widgets/admin-widgets.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CustomerPageComponent } from './customer-page/customer-page.component';
import { RouterModule } from '@angular/router';


@NgModule({
  declarations: [
    CustomersComponent,
    CustomerPageComponent
  ],
  imports: [
    CommonModule,
    CustomersRoutingModule,
    AdminWidgetsModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule
  ]
})
export class CustomersModule { }
