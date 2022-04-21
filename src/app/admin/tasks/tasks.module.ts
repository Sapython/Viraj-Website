import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TasksRoutingModule } from './tasks-routing.module';
import { TasksComponent } from './tasks.component';
import { AdminWidgetsModule } from '../admin-widgets/admin-widgets.module';

@NgModule({
  declarations: [
    TasksComponent
  ],
  imports: [
    CommonModule,
    TasksRoutingModule,
    AdminWidgetsModule
  ]
})
export class TasksModule { }
