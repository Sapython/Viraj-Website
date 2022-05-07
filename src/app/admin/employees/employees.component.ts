import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.scss']
})
export class EmployeesComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }
  items: Array<any> = [
    {
      id: 1,
      img: 'assets/img/people.jpg',
      name: 'Sujeet Singh',
      post: 'Junior',
      post2: 'Accountant',
      age:'28',
      experience:'35',
    },
    {
      id: 2,
      img: 'assets/img/people.jpg',
      name: 'Sujeet Singh',
      post: 'Junior',
      post2: 'Accountant',
      age:'28',
      experience:'35',
    },
    {
      id: 3,
      img: 'assets/img/people.jpg',
      name: 'Sujeet Singh',
      post: 'Junior',
      post2: 'Accountant',
      age:'28',
      experience:'35',
    },
    {
      id: 4,
      img: 'assets/img/people.jpg',
      name: 'Sujeet Singh',
      post: 'Junior',
      post2: 'Accountant',
      age:'28',
      experience:'35',
    },
    {
      id: 5,
      img: 'assets/img/people.jpg',
      name: 'Sujeet Singh',
      post: 'Junior',
      post2: 'Accountant',
      age:'28',
      experience:'35',
    },
    {
      id: 6,
      img: 'assets/img/people.jpg',
      name: 'Sujeet Singh',
      post: 'Junior',
      post2: 'Accountant',
      age:'28',
      experience:'35',
    },
    {
      id: 7,
      img: 'assets/img/people.jpg',
      name: 'Sujeet Singh',
      post: 'Junior',
      post2: 'Accountant',
      age:'28',
      experience:'35',
    },
  ];

}
