
import { Component, OnInit, ElementRef,  ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
declare const UIkit: any;
@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.scss']
})
export class EmployeesComponent implements OnInit {

  items: Array<any> = [
    {
      id: 1,
      img: 'https://picsum.photos/200/?random=1',
      employeeName: 'Sujeet Singh',
      post:'Manager',
      phoneNumber:'+11 121-212-212',
      aadharNumber: '1233 1223 1222',
      address: 'cuttuck',
      accountHolderName:'John Doe',
      experience:'20+',
      age:'30',
      accountNumber:'1223 1122 383'
    },
    {
      img: 'https://picsum.photos/200/?random=2',
      employeeName: 'Sujeet Singh',
      phoneNumber:'+11 121-212-212',
      post:'Manager',
      aadharNumber: '1233 1223 1222',
      address: 'cuttuck',
      accountHolderName:'John Doe',
      experience:'20+',
      age:'30',
      accountNumber:'1223 1122 383'
    },
    {
      id: 3,
      img: 'https://picsum.photos/200/?random=3',
      employeeName: 'Sujeet Singh',
      post:'Manager',
      phoneNumber:'+11 121-212-212',
      aadharNumber: '1233 1223 1222',
      address: 'cuttuck',
      accountHolderName:'John Doe',
      experience:'20+',
      age:'30',
      accountNumber:'1223 1122 383'
    },
    {
      id: 4,
      img: 'https://picsum.photos/200/?random=4',
      employeeName: 'Sujeet Singh',
      phoneNumber:'+11 121-212-212',
      aadharNumber: '1233 1223 1222',
      post:'Manager',
      address: 'cuttuck',
      accountHolderName:'John Doe',
      experience:'20+',
      age:'30',
      accountNumber:'1223 1122 383'
    },
    {
      id: 5,
      img: 'https://picsum.photos/200/?random=5',
      employeeName: 'Sujeet Singh',
      phoneNumber:'+11 121-212-212',
      aadharNumber: '1233 1223 1222',
      address: 'cuttuck',
      post:'Manager',
      accountHolderName:'John Doe',
      experience:'20+',
      age:'30',
      accountNumber:'1223 1122 383'
    },
    {
      id: 6,
      img: 'https://picsum.photos/200/?random=6',
      employeeName: 'Sujeet Singh',
      phoneNumber:'+11 121-212-212',
      aadharNumber: '1233 1223 1222',
      post:'Manager',
      address: 'cuttuck',
      accountHolderName:'John Doe',
      experience:'20+',
      age:'30',
      accountNumber:'1223 1122 383'
    },
    {
      id: 7,
      img: 'https://picsum.photos/200/?random=7',
      employeeName: 'Sujeet Singh',
      phoneNumber:'+11 121-212-212',
      post:'Manager',
      aadharNumber: '1233 1223 1222',
      address: 'cuttuck',
      accountHolderName:'John Doe',
      experience:'20+',
      age:'30',
      accountNumber:'1223 1122 383'
    },
  ];
 
  deleteRecipe(): void {}
  deleteItem(): void {}
  @ViewChild('photoInput') photoInput: ElementRef;

  editMode: boolean = false;
  currentEditId: string = '';
  recipeForm: FormGroup = new FormGroup({
    employeeName: new FormControl('', [Validators.required]),
    phoneNumber: new FormControl('', [Validators.required]),
    aadharNumber: new FormControl('', [Validators.required]),
    address: new FormControl('', [Validators.required]),
    accountHolderName: new FormControl('', [Validators.required]),
    accountNumber: new FormControl('', [Validators.required]),
    post: new FormControl('', [Validators.required]),
    age: new FormControl('', [Validators.required]),
    experience: new FormControl('', [Validators.required])
  });
  editItem(item: any): void {
    this.editMode = true;
    this.currentEditId = item.id;
    this.recipeForm.patchValue(item);

    const itemModal = document.getElementById('employee-modal');
    if (itemModal) {
      itemModal.addEventListener('hidden', () => {
        this.editMode = false;
        this.currentEditId = '';
        this.recipeForm.reset();
      });
      UIkit.modal(itemModal).show();
    }
  }
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
  constructor() { }

  ngOnInit(): void {
  }


}
