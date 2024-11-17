import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RecipePageComponent } from './recipe-page/recipe-page.component';
import { RecipesComponent } from './recipes.component';

const routes: Routes = [
  { path: '', component: RecipesComponent },
  { path: '**', component: RecipePageComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RecipesRoutingModule {}
