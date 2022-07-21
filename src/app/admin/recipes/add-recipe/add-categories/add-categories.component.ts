import { Component, OnInit } from '@angular/core';
import { DatabaseService } from 'src/app/services/database.service';

@Component({
  selector: 'app-add-categories',
  templateUrl: './add-categories.component.html',
  styleUrls: ['./add-categories.component.scss']
})
export class AddCategoriesComponent implements OnInit {
  constructor(private databaseService:DatabaseService) { }
  categories:any[] = []
  ngOnInit(): void {
    this.databaseService.getNewCategories().subscribe((docs:any)=>{
      this.categories = []
      docs.forEach((doc:any) => {
        let subcategories:any[] = []
        doc.data().subcategories.forEach((element:any) => {
          subcategories.push({
            completed:false,
            title:element
          })
        });
        console.log(doc.data());
        this.categories.push({
          title:doc.data().title,
          id:doc.id,
          subcategories:subcategories
        })
      });
    })
  }
  isComplete(categoryId:string):boolean{
    var finalCompleted = false;
    this.categories.forEach(category =>{
      if (category.id == categoryId){
        let completed = 0;
        category.subcategories.forEach((subcategory:any) =>{
          if (subcategory.completed){
            completed++
          }
        })
        finalCompleted = completed == category.subcategories.length
      }
    })
    return finalCompleted
  }
  isSomeComplete(categoryId:string):boolean{
    var finalCompleted = false;
    var completed = 0;
    this.categories.forEach(category =>{
      if (category.id == categoryId){
        category.subcategories.forEach((subcategory:any) =>{
          if (subcategory.completed){
            completed++
          }
        })
        // finalCompleted = completed == category.subcategories.length
        finalCompleted = completed > 0 && completed < category.subcategories.length
      }
    })
    return finalCompleted
  }
  setAllComplete(categoryId:string,checked:boolean):void{
    this.categories.forEach(category =>{
      if (category.id == categoryId){
        category.subcategories.forEach((subcategory:any) =>{
          subcategory.completed = checked
        })
      }
    })
  }
  updateAllComplete(categoryId:string):void{
    this.isComplete(categoryId)
  }
}
