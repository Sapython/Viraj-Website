import { Component, Input, OnInit } from '@angular/core';
import { DataProvider } from 'src/app/providers/data.provider';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  hash:string = window.location.hash;
  path:string = window.location.pathname;
  constructor(public dataProvider:DataProvider,public authService:AuthenticationService ) {}

  ngOnInit(): void {
    // alert(this.dataProvider.loggedIn);
  }
}
