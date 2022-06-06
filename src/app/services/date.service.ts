import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DateService {
  constructor() {}

  getAge(dob: any): any {
    if (dob) {
      const date = new Date(dob);
      const today = new Date();
      const difference = today.getTime() - date.getTime();
      const years = Math.round(difference / 31_556_952_000);
      return years;
    }
  }

  getDateName(date: any): string {
    if (date) {
      const dateObj = new Date(date);
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
    }
    return '';
  }
}
