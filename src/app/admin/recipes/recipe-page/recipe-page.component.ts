import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { DatabaseService } from 'src/app/services/database.service';

@Component({
  selector: 'app-recipe-page',
  templateUrl: './recipe-page.component.html',
  styleUrls: ['./recipe-page.component.scss'],
})
export class RecipePageComponent implements OnInit {
  recipe: any;
  ingredients: any;

  constructor(
    private router: Router,
    private databaseService: DatabaseService
  ) {
    this.router.events.forEach((event) => {
      if (event instanceof NavigationEnd) {
        const url = this.router.url;
        const urlArr = url.split('/');
        const recipeId = urlArr[urlArr.length - 1];

        if (urlArr.length >= 2 && urlArr[urlArr.length - 2] == 'recipes') {
          this.getRecipe(recipeId);
        }
      }
    });
  }

  ngOnInit() {}

  async getRecipe(recipeId: string) {
    const recipeTypes: any = {};
    await this.databaseService.getRecipeTypes().then((docs: any) => {
      docs.forEach((recipeType: any) => {
        docs[recipeType.id] = recipeType.data();
      });
    });

    await this.databaseService.getRecipe(recipeId).then((doc) => {
      const recipeData = doc.data();
      if (recipeData) {
        this.recipe = recipeData;
      }
    });

    if (!this.recipe) {
      this.router.navigate(['/admin/recipes']);
      return;
    }

    this.ingredients = {};
    await this.databaseService.getStock().then((stock: any) => {
      stock.forEach((stockItem: any) => {
        this.ingredients[stockItem.id] = stockItem.data();
      });
    });

    // calculate cooking cost & selling price
    var cookingCost = 0;
    this.recipe['ingredients'].forEach((ingredient: any) => {
      cookingCost += this.ingredients[ingredient.id].rate * ingredient.quantity;
    });

    this.recipe['cookingCost'] = cookingCost.toFixed(2);
    this.recipe['sellingPrice'] = (cookingCost / 0.3).toFixed(2);
  }
}
