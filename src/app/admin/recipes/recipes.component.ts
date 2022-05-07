import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-recipes',
  templateUrl: './recipes.component.html',
  styleUrls: ['./recipes.component.scss']
})
export class RecipesComponent implements OnInit {
 recipes: Array<any> = [
    {
      id: 1,
      title: 'Chicken Biryani',
      desc: 'A Delicious treat for a mouth carving for flavours.',
      imgSrc: 'https://simmertoslimmer.com/wp-content/uploads/2018/01/South-Indian-chicken-biryani.jpg'
    },
    {
      id: 2,
      title: 'Veg Noodles',
      desc: 'A Delicious treat for a mouth carving for flavours.',
      imgSrc: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcStUT3jiReO7gl1UOeVnY1xQESP_yYxn28WoQ&usqp=CAU'
    },
    {
      id: 3,
      title: 'Manchurian',
      desc: 'A Delicious treat for a mouth carving for flavours.',
      imgSrc: 'https://www.cookshideout.com/wp-content/uploads/2014/11/Veg-Manchurian-Low-Fat2S.jpg'
    }
  ]

  constructor() { }

  ngOnInit(): void {
  }
  deleteRecipe(): void {}

  @ViewChild('photoInput') photoInput: ElementRef;

  editMode: boolean = false;
  recipeForm: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required]),
    quantity: new FormControl(0, [Validators.required]),
    rate: new FormControl(0, [Validators.required]),
    unit: new FormControl('', [Validators.required]),
  });
  addrecipe(): void {}
  imageSelected(): void {
    var selectionIsValid = true;
    const file = this.photoInput.nativeElement.files[0];

    if (this.photoInput.nativeElement.files.length != 1) {
      selectionIsValid = false;
    } else if (!['image/png', 'image/jpg', 'image/jpeg'].includes(file.type)) {
      alert('Your photo should either be in .png or .jpg');
      selectionIsValid = false;
    } else if (file.size > 100_000) {
      alert("Your photo's size should not exceed 100 KB");
      selectionIsValid = false;
    }

    if (selectionIsValid) {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = () => {
        document.documentElement.style.setProperty(
          '--photo-background',
          `url('${fileReader.result}')`
        );
      };
    } else {
      document.documentElement.style.setProperty('--photo-background', '');
    }
  }

}
