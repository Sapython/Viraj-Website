import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-stock',
  templateUrl: './stock.component.html',
  styleUrls: ['./stock.component.scss'],
})
export class StockComponent implements OnInit {
  items: Array<any> = [
    {
      id: 1,
      name: 'Rice',
      img: 'assets/img/product-2.png',
      quantity: 50,
      unit: 'kg',
      rate: 50,
    },
    {
      id: 2,
      name: 'Onion',
      img: 'assets/img/product-2.png',
      quantity: 50,
      unit: 'kg',
      rate: 50,
    },
    {
      id: 3,
      name: 'Potato',
      img: 'assets/img/product-2.png',
      quantity: 50,
      unit: 'kg',
      rate: 50,
    },
    {
      id: 4,
      name: 'Pumpkin',
      img: 'assets/img/product-2.png',
      quantity: 50,
      unit: 'kg',
      rate: 50,
    },
    {
      id: 5,
      name: 'Beetroot',
      img: 'assets/img/product-2.png',
      quantity: 50,
      unit: 'kg',
      rate: 50,
    },
    {
      id: 6,
      name: 'Carrot',
      img: 'assets/img/product-2.png',
      quantity: 50,
      unit: 'kg',
      rate: 50,
    },
    {
      id: 7,
      name: 'Mushroom',
      img: 'assets/img/product-2.png',
      quantity: 50,
      unit: 'kg',
      rate: 50,
    },
    {
      id: 8,
      name: 'Flour',
      img: 'assets/img/product-2.png',
      quantity: 50,
      unit: 'kg',
      rate: 50,
    },
  ];

  @ViewChild('uploadPostWrapper') uploadPostWrapper: ElementRef;
  @ViewChild('postInput') postInput: ElementRef;

  addItemForm: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required]),
    phone: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    bookingDate: new FormControl('', [Validators.required]),
    projectName: new FormControl('', [Validators.required]),
    unitNo: new FormControl('', [Validators.required]),
    propertyType: new FormControl('', [Validators.required]),
    companySalesValue: new FormControl('', [Validators.required]),
    salesValue: new FormControl('', [Validators.required]),
    advanceValue: new FormControl('', [Validators.required]),
    financeDetails: new FormControl('', [Validators.required]),
    paymentMode: new FormControl('', [Validators.required]),
    jobType: new FormControl('', [Validators.required]),
    companyName: new FormControl('', [Validators.required]),
    monthlySalary: new FormControl('', [Validators.required]),
    firmName: new FormControl('', [Validators.required]),
    yearOfEstablishment: new FormControl('', [Validators.required]),
    incomeAsPerITR: new FormControl('', [Validators.required]),
    itrStatus: new FormControl('', [Validators.required]),
  });

  constructor() {}

  imageSelected() {
    var selectionIsValid = true;
    const file = this.postInput.nativeElement.files[0];

    if (this.postInput.nativeElement.files.length != 1) {
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
          '--post-background',
          `url('${fileReader.result}')`
        );
      };
    } else {
      document.documentElement.style.setProperty('--post-background', '');
    }
  }

  addItem() {}

  ngOnInit(): void {}
}
