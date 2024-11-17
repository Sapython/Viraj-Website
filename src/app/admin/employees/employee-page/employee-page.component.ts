import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { DatabaseService } from 'src/app/services/database.service';
import { DateService } from 'src/app/services/date.service';

@Component({
  selector: 'app-employee-page',
  templateUrl: './employee-page.component.html',
  styleUrls: ['../../employee-customer-page.scss'],
})
export class EmployeePageComponent implements OnInit {
  employee: any;

  constructor(
    private router: Router,
    private databaseService: DatabaseService,
    public dateService: DateService
  ) {
    this.router.events.forEach((event) => {
      if (event instanceof NavigationEnd) {
        const url = this.router.url;
        const urlArr = url.split('/');
        const employeeId = urlArr[urlArr.length - 1];

        if (
          urlArr.length >= 2 &&
          urlArr[urlArr.length - 2] == 'employees'
        ) {
          this.databaseService.getEmployee(employeeId).then((doc) => {
            const employeeData = doc.data();
            if (employeeData) {
              this.employee = employeeData;
            } else {
              this.router.navigate(['/admin/employees']);
              return;
            }
          });
        }
      }
    });
  }

  ngOnInit() {}
}
