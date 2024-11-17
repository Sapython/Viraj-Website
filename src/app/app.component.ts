import { Component } from '@angular/core';
import { DataProvider } from './providers/data.provider';
import { AuthenticationService } from './services/authentication.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'Viraj-Website';
  constructor(private authService:AuthenticationService,public dataProvider:DataProvider){}
}
