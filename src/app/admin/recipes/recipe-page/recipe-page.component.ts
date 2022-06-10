import { Component, OnInit } from '@angular/core';
import { DocumentData } from '@angular/fire/firestore';
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

  ngOnInit() {
    // this.databaseService.getFirstStock(500).then(async(stocks) => {
    //   const allIngredients: DocumentData[] = []
    //   stocks.forEach((data)=>{
    //     allIngredients.push({ id:data.id,...data.data()})
    //   })
    //   // console.log(allIngredients)
    //   await this.databaseService.getFirstRecipes(500).then((recipes) => {
    //     recipes.forEach(async (recipe) => {
    //       const recipeData = recipe.data();
    //       let recipeIngredients: any[] = [];
    //       recipeData['ingredients'].forEach((ingredient:any) => {
    //         allIngredients.filter((ingredientData:any) => {
    //           // console.log(ingredientData.id,ingredient.id)
    //           if (ingredientData.id == ingredient.id) {
    //             ingredient['unit'] = ingredientData['unit'];
    //           }
    //         })
    //         recipeIngredients.push(ingredient);
    //       })
    //       console.log(recipeIngredients);
    //       await this.databaseService.editRecipe(recipe.id, { ingredients: recipeIngredients });
    //     })
    //   })
    // })
  }

  async getRecipe(recipeId: string) {
    await this.databaseService.getRecipe(recipeId).then((doc) => {
      this.recipe = doc.data();
    });
  }
}
