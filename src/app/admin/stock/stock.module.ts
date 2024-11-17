import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StockRoutingModule } from './stock-routing.module';
import { StockComponent } from './stock.component';
import { AdminWidgetsModule } from '../admin-widgets/admin-widgets.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DatabaseService } from 'src/app/services/database.service';
import {MatPaginatorModule} from '@angular/material/paginator'; 
import {MatDialogModule} from '@angular/material/dialog';
import { RecognizerComponent } from './recognizer/recognizer.component'; 
@NgModule({
  declarations: [
    StockComponent,
    RecognizerComponent
  ],
  imports: [
    CommonModule,
    StockRoutingModule,
    AdminWidgetsModule,
    FormsModule,
    ReactiveFormsModule,
    MatPaginatorModule,
    MatDialogModule
  ],
  providers: [
    DatabaseService
  ]
})
export class StockModule { }
