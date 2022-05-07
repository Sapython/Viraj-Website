import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
})
export class AdminComponent implements OnInit {
  currentPanel: string = 'Panel';

  breakpoint: number = 1000;
  largeScreen: boolean = window.innerWidth > this.breakpoint;
  showSidebar: boolean = false;

  onWindowResize() {
    this.largeScreen = window.innerWidth > this.breakpoint;
    document.documentElement.style.setProperty(
      '--overlay-width',
      !this.largeScreen && this.showSidebar ? '100%' : '0%'
    );
  }

  constructor(private router: Router) {
    router.events.forEach((event) => {
      if (event instanceof NavigationEnd) {
        // Update header heading
        const url = this.router.url;
        if (url.indexOf('recipes') !== -1) {
          this.currentPanel = 'Recipes';
        } else {
          const lastSlashIndex = url.lastIndexOf('/');
          const panel = url.substring(lastSlashIndex + 1);
          const panelWords = panel.split('-');
          panelWords.forEach((word, index) => {
            panelWords[index] =
              word.charAt(0).toUpperCase() + word.substring(1);
          });
          this.currentPanel = panelWords.join(' ');
        }
      }
    });
  }

  toggleSidebar() {
    this.showSidebar = !this.showSidebar;
    document.documentElement.style.setProperty(
      '--overlay-width',
      !this.largeScreen && this.showSidebar ? '100%' : '0%'
    );
  }

  ngOnInit(): void {}
}
