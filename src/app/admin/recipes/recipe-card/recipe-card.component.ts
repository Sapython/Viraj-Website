import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-recipe-card',
  templateUrl: './recipe-card.component.html',
  styleUrls: ['./recipe-card.component.scss'],
})
export class RecipeCardComponent implements OnInit {
  @Input() recipeId: any = '';
  @Input() recipeImage: string = '';
  @Input() recipeName: string = '';
  @Input() recipeType: string = '';
  @Input() recipePrice: string = '';
  @Input() recipeShelfLife: string = '';

  @Output() requestEdit: EventEmitter<any> = new EventEmitter<any>();

  constructor() {}

  ngOnInit(): void {}
}
