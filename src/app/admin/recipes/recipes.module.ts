import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RecipesRoutingModule } from './recipes-routing.module';
import { RecipesComponent } from './recipes.component';
import { AdminWidgetsModule } from '../admin-widgets/admin-widgets.module';
import { RecipeCardComponent } from './recipe-card/recipe-card.component';
import { RecipePageComponent } from './recipe-page/recipe-page.component';


@NgModule({
  declarations: [
    RecipesComponent,
    RecipeCardComponent,
    RecipePageComponent
  ],
  imports: [
    CommonModule,
    RecipesRoutingModule,
    AdminWidgetsModule
  ]
})
export class RecipesModule { }
