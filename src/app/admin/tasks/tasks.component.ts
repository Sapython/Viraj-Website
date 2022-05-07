import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss']
})
export class TasksComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }
  items: Array<any> = [
    {
      id: 1,
      task:'Cleaning',
      status: 'In Progress',
      name: 'Sujeet Singh',
      age:'28',
      details:['Wipe down and sanitize all surface','Wipe down and sanitize all surface']
    },
    {
      id: 2,
      task:'Cleaning',
      status: 'In Progress',
      name: 'Sujeet Singh',
      age:'28',
      details:['Wipe down and sanitize all surface','Wipe down and sanitize all surface']
    },
    {
      id: 3,
      task:'Cleaning',
      status: 'In Progress',
      name: 'Sujeet Singh',
      age:'28',
      details:['Wipe down and sanitize all surface','Wipe down and sanitize all surface']
    },
    {
      id: 4,
      task:'Cleaning',
      status: 'In Progress',
      name: 'Sujeet Singh',
      age:'28',
      details:['Wipe down and sanitize all surface','Wipe down and sanitize all surface']
    },
    {
      id: 5,
      task:'Cleaning',
      status: 'In Progress',
      name: 'Sujeet Singh',
      age:'28',
      details:['Wipe down and sanitize all surface','Wipe down and sanitize all surface']
    },
    {
      id: 6,
      task:'Cleaning',
      status: 'In Progress',
      name: 'Sujeet Singh',
      age:'28',
      details:['Wipe down and sanitize all surface','Wipe down and sanitize all surface']
    },
    {
      id: 7,
      task:'Cleaning',
      status: 'In Progress',
      name: 'Sujeet Singh',
      age:'28',
      details:['Wipe down and sanitize all surface','Wipe down and sanitize all surface']
    },
    {
      id: 8,
      task:'Cleaning',
      status: 'In Progress',
      name: 'Sujeet Singh',
      age:'28',
      details:['Wipe down and sanitize all surface','Wipe down and sanitize all surface']
    },
  ]

}
