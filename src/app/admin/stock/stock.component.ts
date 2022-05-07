import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
declare const UIkit: any;

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
      unit: 'g',
      rate: 50,
    },
    {
      id: 7,
      name: 'Mushroom',
      img: 'assets/img/product-2.png',
      quantity: 50,
      unit: 'ml',
      rate: 50,
    },
    {
      id: 8,
      name: 'Flour',
      img: 'assets/img/product-2.png',
      quantity: 50,
      unit: 'l',
      rate: 50,
    },
  ];
  filteredItems: Array<any> = this.items;

  @ViewChild('photoInput') photoInput: ElementRef;
  @ViewChild('itemSearchInput') itemSearchInput: ElementRef;

  editMode: boolean = false;
  currentEditId: string = '';

  itemForm: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required]),
    quantity: new FormControl(0, [Validators.required]),
    rate: new FormControl(0, [Validators.required]),
    unit: new FormControl('', [Validators.required]),
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

    const itemModal = document.getElementById('item-modal');
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
