import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-recipe-page',
  templateUrl: './recipe-page.component.html',
  styleUrls: ['./recipe-page.component.scss']
})
export class RecipePageComponent implements OnInit {
  recipe: any = {};

  constructor(private router: Router) {
    router.events.forEach((event) => {
      if (event instanceof NavigationEnd) {
        // Update header heading
        const url = this.router.url;
        const lastHyphenIndex = url.lastIndexOf('-');
        const recipe = url.substring(lastHyphenIndex + 1);
        // const panelWords = panel.split('-');
        // panelWords.forEach((word, index) => {
        //   panelWords[index] = word.charAt(0).toUpperCase() + word.substring(1);
        // });
      }
    });
  }

  ngOnInit(): void {
  }

}
