import { Component, OnInit } from '@angular/core';
import { DatabaseService } from 'src/app/services/database.service';

@Component({
  selector: 'app-manage-category',
  templateUrl: './manage-category.component.html',
  styleUrls: ['./manage-category.component.scss']
})
export class ManageCategoryComponent implements OnInit {
  categories:Category[] = []
  constructor(private databaseService:DatabaseService) { }

  ngOnInit(): void {
    this.databaseService.getNewCategories().subscribe((docs:any)=>{
      this.categories = []
      docs.forEach((doc:any) => {
        console.log(doc.data());
        this.categories.push({
          title:doc.data().title,
          id:doc.id,
          subcategories:doc.data().subcategories
        })
      });
    })
  }

  addCategory(title:string){
    this.databaseService.addNewCategory({
      title:title
    })
  }
  removeCategory(categoryId:string){
    this.databaseService.deleteNewCategory(categoryId)
  }

  addSubCategory(subCategoryTitle:string,categoryId:string){
    this.databaseService.addNewSubcategory(subCategoryTitle,categoryId)
  }
  removeSubCategory(subCategoryTitle:string,categoryId:string){
    this.databaseService.deleteNewSubcategory(subCategoryTitle,categoryId)
  }

}

export type Category = {
  title:string;
  id:string;
  subcategories:string[];
}