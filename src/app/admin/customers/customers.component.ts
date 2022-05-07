import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
declare const UIkit: any;

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.scss'],
})
export class CustomersComponent implements OnInit {
  items: Array<any> = [
    {
      id: 1,
      img: 'https://picsum.photos/200/?random=1',
      name: 'Sujeet Singh',
      age: '28',
      purchase: '9000',
      address:'delhi',
      job:'bar tender',
      gross:'₹2000',
      phoneNumber:'+91-112-212-221',
      email:'test@gmail.com'
    },
    {
      id: 2,
      img: 'https://picsum.photos/200/?random=2',
      name: 'Sujeet Singh',
      age: '28',
      purchase: '9000',
      address:'delhi',
      job:'bar tender',
      gross:'₹2000',
      phoneNumber:'+91-112-212-221',
      email:'test@gmail.com'
    },
    {
      id: 3,
      img: 'https://picsum.photos/200/?random=3',
      name: 'Sujeet Singh',
      age: '28',
      purchase: '9000',
      address:'delhi',
      job:'bar tender',
      gross:'₹2000',
      phoneNumber:'+91-112-212-221',
      email:'test@gmail.com'
    },
    {
      id: 4,
      img: 'https://picsum.photos/200/?random=4',
      name: 'Sujeet Singh',
      age: '28',
      purchase: '9000',
      address:'delhi',
      job:'bar tender',
      gross:'₹2000',
      phoneNumber:'+91-112-212-221',
      email:'test@gmail.com'
    },
    {
      id: 5,
      img: 'https://picsum.photos/200/?random=5',
      name: 'Sujeet Singh',
      age: '28',
      purchase: '9000',
      address:'delhi',
      job:'bar tender',
      gross:'₹2000',
      phoneNumber:'+91-112-212-221',
      email:'test@gmail.com'
    },
    {
      id: 6,
      img: 'https://picsum.photos/200/?random=6',
      name: 'Sujeet Singh',
      age: '28',
      purchase: '9000',
      address:'delhi',
      job:'bar tender',
      gross:'₹2000',
      phoneNumber:'+91-112-212-221',
      email:'test@gmail.com'
    },
    {
      id: 7,
      img: 'https://picsum.photos/100/100?random=7',
      name: 'Sujeet Singh',
      age: '28',
      purchase: '9000',
      address:'delhi',
      job:'bar tender',
      gross:'₹2000',
      phoneNumber:'+91-112-212-221',
      email:'test@gmail.com'
    },
    {
      id: 8,
      img: 'https://picsum.photos/200/?random=3',
      name: 'Sujeet Singh',
      age: '28',
      purchase: '9000',
      address:'delhi',
      job:'bar tender',
      gross:'₹2000',
      phoneNumber:'+91-112-212-221',
      email:'test@gmail.com'
    },
  ];

  filteredItems: Array<any> = this.items;

  @ViewChild('photoInput') photoInput: ElementRef;
  @ViewChild('itemSearchInput') itemSearchInput: ElementRef;

  editMode: boolean = false;
  currentEditId: string = '';

  itemForm: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required]),
    age: new FormControl('', [Validators.required]),
    gender: new FormControl('', [Validators.required]),
    address: new FormControl('', [Validators.required]),
    job: new FormControl('', [Validators.required]),
    gross: new FormControl('', [Validators.required]),
    purchase: new FormControl('', [Validators.required]),
    phoneNumber: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required]),
  });

  updateStockForm: FormGroup;

  constructor() {
    // Initialize updateStockForm
    const group: any = {};
    this.items.forEach((item) => {
      group[item.id.toString()] = new FormControl(item.quantity, [
        Validators.required,
      ]);
    });
    this.updateStockForm = new FormGroup(group);
  }

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

  addItem(): void {}

  editItem(item: any): void {
    this.editMode = true;
    this.currentEditId = item.id;
    this.itemForm.patchValue(item);

    const itemModal = document.getElementById('customer-modal');
    if (itemModal) {
      itemModal.addEventListener('hidden', () => {
        this.editMode = false;
        this.currentEditId = '';
        this.itemForm.reset();
      });
      UIkit.modal(itemModal).show();
    }
  }

  deleteItem(): void {}

  searchItems(): void {
    const query = this.itemSearchInput.nativeElement.value.trim().toLowerCase();
    this.filteredItems = this.items.filter((item) => {
      return item.name.toLowerCase().indexOf(query) !== -1;
    });
    this.filteredItems.sort((item1, item2) => {
      const index1 = item1.name.toLowerCase().indexOf(query);
      const index2 = item2.name.toLowerCase().indexOf(query);
      return index1 - index2;
    });
  }

  updateStock(): void {
    // Update only those items' stock whose inputs have been changed
    const toUpdate: any = {};
    for (const item of this.items) {
      if (
        this.updateStockForm.get(item.id.toString())!.value != item.quantity
      ) {
        toUpdate[item.id.toString()] = item.quantity;
      }
    }
  }

  ngOnInit(): void {}
}
