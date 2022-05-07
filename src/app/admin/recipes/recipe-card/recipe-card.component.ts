import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-recipe-card',
  templateUrl: './recipe-card.component.html',
  styleUrls: ['./recipe-card.component.scss'],
})
export class RecipeCardComponent implements OnInit {
  @Input() recipeId: any = '';
  @Input() recipeTitle: string = '';
  @Input() recipeDesc: string = '';
  @Input() recipeImage: string = '';

  constructor() {}

  ngOnInit(): void {}
}
