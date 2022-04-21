import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StockRoutingModule } from './stock-routing.module';
import { StockComponent } from './stock.component';
import { AdminWidgetsModule } from '../admin-widgets/admin-widgets.module';

@NgModule({
  declarations: [
    StockComponent
  ],
  imports: [
    CommonModule,
    StockRoutingModule,
    AdminWidgetsModule
  ]
})
export class StockModule { }
