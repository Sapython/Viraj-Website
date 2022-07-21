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
import {MatDialogModule} from '@angular/material/dialog';
import { AddRecipeComponent } from './add-recipe/add-recipe.component';
import { EditRecipeComponent } from './edit-recipe/edit-recipe.component';
import { LoaderComponent } from './loader/loader.component';
import { UtilityComponent } from './utility/utility.component'; 
import { MatButtonModule } from '@angular/material/button';
import {MatInputModule} from '@angular/material/input'; 
import {MatSelectModule} from '@angular/material/select';
import { ManageCategoryComponent } from './manage-category/manage-category.component';
import { AddCategoriesComponent } from './add-recipe/add-categories/add-categories.component';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { ManageCategoriesComponent } from './edit-recipe/manage-categories/manage-categories.component';


@NgModule({
  declarations: [
    RecipesComponent,
    RecipeCardComponent,
    RecipePageComponent,
    RecipeModalComponent,
    AddRecipeComponent,
    EditRecipeComponent,
    LoaderComponent,
    UtilityComponent,
    ManageCategoryComponent,
    AddCategoriesComponent,
    ManageCategoriesComponent,
  ],
  imports: [
    CommonModule,
    RecipesRoutingModule,
    AdminWidgetsModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    MatPaginatorModule,
    MatDialogModule,
    MatButtonModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule
  ]
})
export class RecipesModule { }
