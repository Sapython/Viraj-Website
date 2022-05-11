import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-employee-page',
  templateUrl: './employee-page.component.html',
  styleUrls: ['../../employee-customer-page.scss'],
})
export class EmployeePageComponent implements OnInit {
  image: string = '';
  name: string = '';
  post: string = '';
  dob: string = '';
  yearStartedWork: string = '';
  phoneNumber: string = '';
  aadharNumber: string = '';
  address: string = '';
  paymentMethod: string = '';
  accountHolderName: string = '';
  accountNumber: string = '';

  constructor(private router: Router) {
    router.events.forEach((event) => {
      if (event instanceof NavigationEnd) {
        const url = this.router.url;
        const urlArr = url.split('/');
        const employeeId = urlArr[urlArr.length - 1];
        if (
          urlArr.length >= 2 &&
          urlArr[urlArr.length - 2] == 'employees' &&
          employeeId != 'kumar-yadav'
        ) {
          this.router.navigate(['/admin/employees']);
        } else {
          const employee = {
            id: 'kumar-yadav',
            image: 'https://picsum.photos/200/?random=1',
            name: 'Kumar Yadav',
            post: 'Manager',
            dob: '2002-01-27',
            yearStartedWork: '2020',
            phoneNumber: '+11 121-212-212',
            aadharNumber: '1233 1223 1222',
            address: 'cuttuck',
            paymentMethod: 'UPI',
            accountHolderName: 'John Doe',
            accountNumber: '1223 1122 383',
          };
          this.image = employee.image;
          this.name = employee.name;
          this.post = employee.post;
          this.dob = employee.dob;
          this.yearStartedWork = employee.yearStartedWork;
          this.phoneNumber = employee.phoneNumber;
          this.aadharNumber = employee.aadharNumber;
          this.address = employee.address;
          this.paymentMethod = employee.paymentMethod;
          this.accountHolderName = employee.accountHolderName;
          this.accountNumber = employee.accountNumber;
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
