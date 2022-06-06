import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
declare const UIkit: any;
import Fuse from 'fuse.js';
import { AlertService } from 'src/app/services/alert.service';
import { BlurSiteService } from 'src/app/services/blur-site.service';
import { DatabaseService } from 'src/app/services/database.service';

@Component({
  selector: 'app-stock',
  templateUrl: './stock.component.html',
  styleUrls: ['../admin.util.scss', './stock.component.scss'],
})
export class StockComponent implements OnInit {
  items: any[];
  filteredItems: any[];
  units: any[];
  currentValue: string = '0.00';
  currentDeleteId: string = '';

  @ViewChild('itemSearchInput') itemSearchInput: ElementRef;

  editMode: boolean = false;
  currentEditId: any = '';

  itemForm: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required]),
    unit: new FormControl('', [Validators.required]),
    quantity: new FormControl(0, [Validators.required]),
    rate: new FormControl(0, [Validators.required]),
  });

  updateStockFormControls: any = {};
  updateStockForm: FormGroup = new FormGroup(this.updateStockFormControls);

  constructor(private databaseService: DatabaseService, private blurSiteService: BlurSiteService, private alertService: AlertService) {}

  ngOnInit(): void {
    // Get stock items
    this.databaseService.getStock().then((docs: any) => {
      this.items = [];
      docs.forEach((doc: any) => {
        this.items.push({ id: doc.id, ...doc.data() });
      });
      this.filteredItems = this.items;

      // Initialize updateStockForm
      this.items.forEach((item) => {
        this.updateStockFormControls[item.id.toString()] = new FormControl(
          item.quantity,
          [Validators.required]
        );
      });
    });

    // Get units
    this.databaseService.getUnits().then((docs: any) => {
      this.units = [];
      docs.forEach((doc: any) => {
        this.units.push({ id: doc.id, ...doc.data() });
      });
    });
  }

  calculateCurrentValue() {
    const quantityInput = document.getElementById('quantity-input') as HTMLInputElement;
    const quantity = parseFloat(quantityInput.value);
    const rateInput = document.getElementById('rate-input') as HTMLInputElement;
    const rate = parseFloat(rateInput.value);
    const currentValue = quantity * rate;
    this.currentValue = currentValue.toFixed(2);
  }

  submit(): void {
    if (this.itemForm.valid) {
      this.blurSiteService.startBlur();
      
      if (this.editMode) {
        this.databaseService
          .editStockItem(this.currentEditId, this.itemForm.value)
          .then(() => {
            UIkit.modal(document.getElementById('item-modal')).hide();
            this.ngOnInit();
            this.blurSiteService.stopBlur();
            this.alertService.presentToast(
              'Item edited successfully',
              'info'
            );
          });
      } else {
        this.databaseService.addStockItem(this.itemForm.value).then(() => {
          UIkit.modal(document.getElementById('item-modal')).hide();
          this.itemForm.reset();
          this.ngOnInit();
          this.blurSiteService.stopBlur();
          this.alertService.presentToast('Item added successfully', 'info');
        });
      }
    } else {
      this.alertService.presentToast(
        'Please fill all the required fields.',
        'error'
      );
    }
  }
  

  editItem(item: any): void {
    this.editMode = true;
    this.currentEditId = item.id;

    // Patch values
    this.itemForm.patchValue(item);

    const itemModal = document.getElementById('item-modal');
    if (itemModal) {
      itemModal.addEventListener('hidden', () => {
        this.editMode = false;
        this.currentEditId = '';

        // Reset the form
        this.itemForm.reset();
      });
      UIkit.modal(itemModal).show();
    }
  }

  deleteItem(): void {
    this.blurSiteService.startBlur();
    this.databaseService.deleteStockItem(this.currentDeleteId).then(() => {
      this.ngOnInit();
      this.blurSiteService.stopBlur();
      this.alertService.presentToast('Item deleted successfully', 'info');
    });
  }

  searchItems(): void {
    const query = this.itemSearchInput.nativeElement.value.trim();
    if (query.length > 0) {
      const options = { keys: ['name'] };
      const fuse = new Fuse(this.items, options);
      const results = fuse.search(query);
      this.filteredItems = [];
      results.forEach((result) => {
        this.filteredItems.push(result.item);
      });
    } else {
      this.filteredItems = this.items;
    }
  }

  updateStock(): void {
    // Update only those items' stock whose inputs have been changed
    for (const item of this.items) {
      const newQuantity = this.updateStockForm.get(item.id.toString())!.value;
      if (newQuantity != item.quantity) {
        item.quantity = newQuantity;
        this.databaseService.editStockItem(item.id, item);
      }
    }
  }
}
