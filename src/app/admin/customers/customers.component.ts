import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.scss']
})
export class CustomersComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }
  items: Array<any> = [
    {
      id: 1,
      img: 'assets/img/people.jpg',
      name: 'Sujeet Singh',
      age:'28',
      purchase:'35',
    },
    {
      id: 2,
      img: 'assets/img/people.jpg',
      name: 'Sujeet Singh',
      age:'28',
      purchase:'35',
    },
    {
      id: 3,
      img: 'assets/img/people.jpg',
      name: 'Sujeet Singh',
      age:'28',
      purchase:'35',
    },
    {
      id: 4,
      img: 'assets/img/people.jpg',
      name: 'Sujeet Singh',
      age:'28',
      purchase:'35',
    },
    {
      id: 5,
      img: 'assets/img/people.jpg',
      name: 'Sujeet Singh',
      age:'28',
      purchase:'35',
    },
    {
      id: 6,
      img: 'assets/img/people.jpg',
      name: 'Sujeet Singh',
      age:'28',
      purchase:'35',
    },
    {
      id: 7,
      img: 'assets/img/people.jpg',
      name: 'Sujeet Singh',
      age:'28',
      purchase:'35',
    },
    {
      id: 8,
      img: 'assets/img/people.jpg',
      name: 'Sujeet Singh',
      age:'28',
      purchase:'35',
    },
  ]

}
