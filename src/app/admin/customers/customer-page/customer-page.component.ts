import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-customer-page',
  templateUrl: './customer-page.component.html',
  styleUrls: ['../../employee-customer-page.scss'],
})
export class CustomerPageComponent implements OnInit {
  image: string = '';
  name: string = '';
  dob: string = '';
  gender: string = '';
  grossPurchase: string = '';
  phoneNumber: string = '';
  email: string = '';
  address: string = '';
  job: string = '';

  constructor(private router: Router) {
    router.events.forEach((event) => {
      if (event instanceof NavigationEnd) {
        const url = this.router.url;
        const urlArr = url.split('/');
        const customerId = urlArr[urlArr.length - 1];
        if (
          urlArr.length >= 2 &&
          urlArr[urlArr.length - 2] == 'customers' &&
          customerId != 'kumar-singh'
        ) {
          this.router.navigate(['/admin/customers']);
        } else {
          const customer = {
            id: 'kumar-singh',
            image: 'https://picsum.photos/200/?random=1',
            name: 'Kumar Singh',
            dob: '2002-01-27',
            gender: 'male',
            grossPurchase: '9000',
            phoneNumber: '9900099000',
            email: 'raghav@goel.com',
            address: 'Amity University, Noida',
            job: 'Proctor',
          };
          this.image = customer.image;
          this.name = customer.name;
          this.dob = customer.dob;
          this.gender = customer.gender;
          this.grossPurchase = customer.grossPurchase;
          this.phoneNumber = customer.phoneNumber;
          this.email = customer.email;
          this.address = customer.address;
          this.job = customer.job;
        }
      }
    });
  }

  ngOnInit(): void {}

  getDateName(dateStr: string): string {
    const dateObj = new Date(dateStr);
    if (dateObj) {
      return (
        [
          'January',
          'February',
          'March',
          'April',
          'May',
          'June',
          'July',
          'August',
          'September',
          'October',
          'November',
          'December',
        ][dateObj.getMonth()] +
        ' ' +
        dateObj.getDate() +
        ', ' +
        dateObj.getFullYear()
      );
    }
    return '';
  }
}
