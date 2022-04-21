import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RecipesRoutingModule } from './recipes-routing.module';
import { RecipesComponent } from './recipes.component';
import { AdminWidgetsModule } from '../admin-widgets/admin-widgets.module';


@NgModule({
  declarations: [
    RecipesComponent
  ],
  imports: [
    CommonModule,
    RecipesRoutingModule,
    AdminWidgetsModule
  ]
})
export class RecipesModule { }
