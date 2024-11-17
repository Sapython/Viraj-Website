import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { DocumentReference } from '@angular/fire/firestore';
import { FormControl, FormGroup, Validators } from '@angular/forms';
declare const UIkit: any;
import Fuse from 'fuse.js';
import { BlurSiteService } from 'src/app/services/blur-site.service';
import { DatabaseService } from 'src/app/services/database.service';
import { AlertsAndNotificationsService } from 'src/app/services/uiService/alerts-and-notifications.service';
import {MatDialog} from '@angular/material/dialog';
import { UtilityComponent } from '../recipes/utility/utility.component';
import { DataProvider } from 'src/app/providers/data.provider';
import { VoiceRecognitionService } from 'src/app/services/voice-recognition.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-stock',
  templateUrl: './stock.component.html',
  styleUrls: ['../admin.util.scss', './stock.component.scss'],
})
export class StockComponent implements OnInit, OnDestroy {
  items: any[];
  filteredItems: any[];
  units: any[];
  currentValue: string = '0.00';
  currentDeleteId: string = '';
  allStocks: any[] = [];
  lastPaginatorEvent:any;
  recognizedText: string = '';
  currentRecognizedId:string = '';
  recognitionActive: boolean = false;
  @ViewChild('itemSearchInput') itemSearchInput: ElementRef;
  editMode: boolean = false;
  currentEditId: any = '';
  updateStockEnabled: boolean = false;
  serialNumberAdditionalCounter: number = 0;
  itemForm: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required]),
    unit: new FormControl('', [Validators.required]),
    quantity: new FormControl(0, [Validators.required]),
    rate: new FormControl(0, [Validators.required]),
  });
  stockLength: number = 0;
  updateStockFormControls: any = {};
  updateStockForm: FormGroup = new FormGroup(this.updateStockFormControls);
  lastDocReference: any;
  firstDocReference: any;
  editedItem: any = {};
  recognizerSubscription:Subscription = new Subscription();
  constructor(
    private databaseService: DatabaseService,
    private dataProvider: DataProvider,
    private alertService: AlertsAndNotificationsService,
    public dialog: MatDialog,
    private voiceRecognitionService: VoiceRecognitionService
  ) {}

  ngOnInit(): void {
    // Get stock items
    this.getInitialStock();
    this.getMeasuringUnits();
  }

  getInitialStock() {
    this.serialNumberAdditionalCounter = 0;
    this.databaseService
      .getSiteData()
      .then((data) => {
        if (data.exists()) {
          const siteData = data.data();
          this.stockLength = siteData['stockLength'];
        } else {
          this.stockLength = 0;
        }
      })
      .finally(() => {
        this.databaseService.getFirstStock(10).then((docs: any) => {
          this.setCurrentViewData(docs);
          // this.allStocks.push(...docs)
        });
      })
      .catch((error) => {
        this.alertService.presentToast(error, 'error');
      });
  }

  getMeasuringUnits() {
    this.databaseService
      .getUnits()
      .then((units: any) => {
        this.units = units;
      })
      .catch((error) => {
        this.alertService.presentToast(error, 'error');
      });
  }

  setCurrentViewData(docs: DocumentReference[]) {
    this.items = [];
    let setFirstDoc = true;
    docs.forEach((doc: any) => {
      if (setFirstDoc) {
        this.firstDocReference = doc;
        setFirstDoc = false;
      }
      this.items.push({ id: doc.id, ...doc.data() });
      this.lastDocReference = doc;
    });
  }

  calculateCurrentValue() {
    const quantityInput = document.getElementById(
      'quantity-input'
    ) as HTMLInputElement;
    const quantity = parseFloat(quantityInput.value);
    const rateInput = document.getElementById('rate-input') as HTMLInputElement;
    const rate = parseFloat(rateInput.value);
    const currentValue = quantity * rate;
    this.currentValue = currentValue.toFixed(2);
  }

  getNextStocks(event: any) {
    // const lastDoc =
    this.lastPaginatorEvent = event;
    console.log(event);
    if (event.previousPageIndex < event.pageIndex) {
      console.log('Moved next');
      const lastDoc = this.lastDocReference;
      const length = event.pageSize;
      this.serialNumberAdditionalCounter = (event.pageIndex) * event.pageSize
      this.databaseService.getNextStock(length, lastDoc).then((docs: any) => {
        // this.allStocks.push(...docs)
        this.setCurrentViewData(docs);
      });
    } else if (event.previousPageIndex > event.pageIndex) {
      this.serialNumberAdditionalCounter = (event.pageIndex) * event.pageSize
      this.databaseService.getPreviousStock(event.pageSize, this.firstDocReference).then((docs: any) => {
        // this.allStocks.push(...docs)
        this.setCurrentViewData(docs);
      })
    } else if (event.previousPageIndex === event.pageIndex && event.pageIndex === 0) {
      this.serialNumberAdditionalCounter = (event.pageIndex) * event.pageSize
      this.databaseService.getFirstStock(event.pageSize).then((docs: any) => {
        this.setCurrentViewData(docs);
        // this.allStocks.push(...docs)
      });
    }
    console.log(
      event.previousPageIndex,
      (event.pageIndex + 1) * event.pageSize
    );
  }

  changeStock(stock: any,event:any) {
    // console.log(event);
    this.items.forEach((item: any) => {
      if (item.id == stock.id){
        stock['quantity'] = parseFloat(event.target.value);
        this.editedItem[stock.id] =stock;
      }
    })
  }
  changeRate(stock: any,event:any){
    this.items.forEach((item: any) => {
      if (item.id == stock.id){
        stock['rate'] = parseFloat(event.target.value);
        this.editedItem[stock.id] = stock;
      }
    })
  }
  // Form Management
  submit(): void {
    if (this.itemForm.valid) {
      this.dataProvider.pageSetting.blur = true;
      if (this.editMode) {
        this.itemForm.value['rate'] = parseFloat(this.itemForm.value['rate']);
        this.databaseService
          .updateStockItem(this.currentEditId, this.itemForm.value)
          .then(() => {
            UIkit.modal(document.getElementById('item-modal')).hide();
            // this.ngOnInit();
            if(this.lastPaginatorEvent){
              this.getNextStocks(this.lastPaginatorEvent);
            } else {
              this.getInitialStock();
            }
            this.dataProvider.pageSetting.blur = false;;
            this.alertService.presentToast('Item edited successfully', 'info');
          });
      } else {
        this.itemForm.value['rate'] = parseFloat(this.itemForm.value['rate']);
        this.databaseService
          .addStockItem(this.itemForm.value)
          .then(() => {
            UIkit.modal(document.getElementById('item-modal')).hide();
            this.itemForm.reset();
            if(this.lastPaginatorEvent){
              this.getNextStocks(this.lastPaginatorEvent);
            } else {
              this.getInitialStock();
            }
            this.dataProvider.pageSetting.blur = false;;
            this.alertService.presentToast('Item added successfully', 'info');
          })
          .catch((error) => {
            this.alertService.presentToast(error.message, 'error');
          });
      }
    } else {
      this.alertService.presentToast(
        'Please fill all the required fields.',
        'error'
      );
    }
  }
  // Item actions
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
      this.calculateCurrentValue();
    }
  }
  get currentUnit(){
    return this.itemForm.get('unit');
  }
  deleteItem(): void {
    this.dataProvider.pageSetting.blur = true;
    this.databaseService.deleteStockItem(this.currentDeleteId).then(() => {
      if(this.lastPaginatorEvent){
        this.getNextStocks(this.lastPaginatorEvent);
      } else {
        this.getInitialStock();
      }
      this.dataProvider.pageSetting.blur = false;;
      this.alertService.presentToast('Item deleted successfully', 'info');
    });
  }

  async updateStock(): Promise<void> {
    // Update only those items' stock whose inputs have been changed
    this.updateStockEnabled = false;
    for (const key in this.editedItem) {
      if (Object.prototype.hasOwnProperty.call(this.editedItem, key)) {
        const item = this.editedItem[key];
        if (item.quantity != item.oldQuantity) {
          try{
            this.databaseService.updateStockItem(item.id, item).then(()=>{
              console.log('Updated',this.lastPaginatorEvent);
              this.alertService.presentToast('Stock updated successfully', 'info');
            })
          } catch(error:any){
            this.alertService.presentToast(error, 'error');
            return
          }
        }
      }
    }
    if(this.lastPaginatorEvent){
      this.getNextStocks(this.lastPaginatorEvent);
    } else {
      this.getInitialStock();
    }
  }

  // Search management
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
  
  stopRecognition(){
    this.items.forEach((item: any) => {
      if(item['id'] == this.currentRecognizedId){
        item['quantity'] = parseFloat(this.recognizedText);
        this.editedItem[item.id] = item;
      }
    })
    this.voiceRecognitionService.stop();
    this.recognizerSubscription.unsubscribe();
    this.recognitionActive = false;
  }

  startRecognition(itemId:string){
    if (this.voiceRecognitionService.supported){
      this.currentRecognizedId = itemId;
      this.voiceRecognitionService.init();
      this.voiceRecognitionService.start();
      this.recognitionActive = true;
      this.recognizerSubscription = this.voiceRecognitionService.words.subscribe((data)=>{
        this.recognizedText = data;
      })
      this.alertService.presentToast('Listening...', 'info');    
      // setTimeout(()=>{
      //   this.voiceRecognitionService.stop();
      //   this.alertService.presentToast('Stopped Listening', 'info');    
      // },5000)
    }  else {
      this.alertService.presentToast(
        'Speech recognition is not supported in your browser','error'
      );
    }
  }

  ngOnDestroy(): void {
    this.recognizerSubscription.unsubscribe();
  }
}
