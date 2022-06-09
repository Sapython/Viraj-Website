import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StockRoutingModule } from './stock-routing.module';
import { StockComponent } from './stock.component';
import { AdminWidgetsModule } from '../admin-widgets/admin-widgets.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DatabaseService } from 'src/app/services/database.service';
import {MatPaginatorModule} from '@angular/material/paginator'; 
@NgModule({
  declarations: [
    StockComponent
  ],
  imports: [
    CommonModule,
    StockRoutingModule,
    AdminWidgetsModule,
    FormsModule,
    ReactiveFormsModule,
    MatPaginatorModule,
  ],
  providers: [
    DatabaseService
  ]
})
export class StockModule { }
