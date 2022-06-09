import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RecipesRoutingModule } from './recipes-routing.module';
import { RecipesComponent } from './recipes.component';
import { AdminWidgetsModule } from '../admin-widgets/admin-widgets.module';
import { RecipeCardComponent } from './recipe-card/recipe-card.component';
import { RecipePageComponent } from './recipe-page/recipe-page.component';
import { RouterModule } from '@angular/router';
import { RecipeModalComponent } from './recipe-modal/recipe-modal.component';
import { MatPaginatorModule } from '@angular/material/paginator';


@NgModule({
  declarations: [
    RecipesComponent,
    RecipeCardComponent,
    RecipePageComponent,
    RecipeModalComponent
  ],
  imports: [
    CommonModule,
    RecipesRoutingModule,
    AdminWidgetsModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    MatPaginatorModule,
  ]
})
export class RecipesModule { }
