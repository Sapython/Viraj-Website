import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-recipe-page',
  templateUrl: './recipe-page.component.html',
  styleUrls: ['./recipe-page.component.scss'],
})
export class RecipePageComponent implements OnInit {
  image: string = '';
  name: string = '';
  type: string = '';
  description: string = '';
  price: string = '';
  shelfLife: string = '';
  ingredients: any[] = [];
  instructions: string[] = [];

  recipeTypes: any[] = [
    { id: '1', name: 'Chinese Cuisine' },
    { id: '2', name: 'South Indian Cuisine' },
    { id: '3', name: 'Dessert' },
    { id: '4', name: 'Italian Cuisine' },
    { id: '5', name: 'Beverage' },
  ];

  allIngredients: any[] = [
    {
      id: '1',
      name: 'Rice',
      unit: 'kg',
    },
    {
      id: '2',
      name: 'Onion',
      unit: 'kg',
    },
    {
      id: '3',
      name: 'Potato',
      unit: 'kg',
    },
    {
      id: '4',
      name: 'Pumpkin',
      unit: 'kg',
    },
    {
      id: '5',
      name: 'Beetroot',
      unit: 'kg',
    },
    {
      id: '6',
      name: 'Carrot',
      unit: 'g',
    },
    {
      id: '7',
      name: 'Mushroom',
      unit: 'mL',
    },
    {
      id: '8',
      name: 'Flour',
      unit: 'L',
    },
  ];

  constructor(private router: Router) {
    router.events.forEach((event) => {
      if (event instanceof NavigationEnd) {
        const url = this.router.url;
        const urlArr = url.split('/');
        const recipeId = urlArr[urlArr.length - 1];
        if (recipeId != 'veg-noodles') {
        } else {
          const recipe = {
            id: 'veg-noodles',
            name: 'Veg Noodles',
            typeId: '4',
            description: 'A Delicious treat for a mouth carving for flavours.',
            image:
              'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcStUT3jiReO7gl1UOeVnY1xQESP_yYxn28WoQ&usqp=CAU',
            shelfLife: '4 days',
            price: '420',
            ingredients: [
              {
                id: 1,
                quantity: 2,
              },
              {
                id: 8,
                quantity: '4',
              },
            ],
            instructions: [
              'Put some ketchup in a bowl',
              'Mix with mustard',
              'Add nutella',
              'Chop onions',
              'Put 2 eggs',
              'Add salt for taste',
            ],
          };
          this.image = recipe.image;
          this.name = recipe.name;
          this.type = this.getRecipeType(recipe.typeId);
          this.description = recipe.description;
          this.price = recipe.price;
          this.shelfLife = recipe.shelfLife;
          this.ingredients = recipe.ingredients;
          this.instructions = recipe.instructions;
        }
      }
    });
  }

  ngOnInit(): void {}

  getRecipeType(typeId: any): string {
    return this.recipeTypes.find((recipeType) => recipeType.id == typeId).name;
  }

  getIngredient(ingredientId: any): any  {
    return this.allIngredients.find(
      (ingredient) => ingredient.id == ingredientId
    );
  }

  deleteRecipe(): void {}
}
