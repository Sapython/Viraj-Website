import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { DatabaseService } from 'src/app/services/database.service';
import { DateService } from 'src/app/services/date.service';

@Component({
  selector: 'app-customer-page',
  templateUrl: './customer-page.component.html',
  styleUrls: ['../../employee-customer-page.scss'],
})
export class CustomerPageComponent implements OnInit {
  customer: any;

  constructor(
    private router: Router,
    private databaseService: DatabaseService,
    public dateService: DateService
  ) {
    this.router.events.forEach((event) => {
      if (event instanceof NavigationEnd) {
        const url = this.router.url;
        const urlArr = url.split('/');
        const customerId = urlArr[urlArr.length - 1];

        if (
          urlArr.length >= 2 &&
          urlArr[urlArr.length - 2] == 'customers'
        ) {
          this.databaseService.getCustomer(customerId).then((doc) => {
            const customerData = doc.data();
            if (customerData) {
              this.customer = customerData;
            } else {
              this.router.navigate(['/admin/customers']);
              return;
            }
          });
        }
      }
    });
  }

  ngOnInit() {}
}
