import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DocumentReference } from '@angular/fire/firestore';
import { FormControl, FormGroup, Validators } from '@angular/forms';
declare const UIkit: any;
import Fuse from 'fuse.js';
import { DataProvider } from 'src/app/providers/data.provider';
import { BlurSiteService } from 'src/app/services/blur-site.service';
import { DatabaseService } from 'src/app/services/database.service';
import { AlertsAndNotificationsService } from 'src/app/services/uiService/alerts-and-notifications.service';

@Component({
  selector: 'app-utility',
  templateUrl: './utility.component.html',
  styleUrls: ['../admin.util.scss', './utility.component.scss'],
})
export class UtilityComponent implements OnInit {
  utilities: any[];
  filteredUtilities: any[];
  units: any[];
  currentValue: string = '0.00';
  currentDeleteId: string = '';
  allUtilities: any[] = [];
  lastPaginatorEvent:any;
  @ViewChild('utilitySearchInput') utilitySearchInput: ElementRef;
  editMode: boolean = false;
  currentEditId: any = '';
  updateUtilityEnabled: boolean = false;
  serialNumberAdditionalCounter: number = 0;
  utilityForm: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required]),
    type: new FormControl('', [Validators.required]),
    unit: new FormControl('', [Validators.required]),
    totalItems: new FormControl('', [Validators.required]),
    quantityPerItem: new FormControl(0, [Validators.required]),
    rate: new FormControl(0, [Validators.required]),
  });
  utilityLength: number = 0;
  updateUtilityFormControls: any = {};
  updateUtilityForm: FormGroup = new FormGroup(this.updateUtilityFormControls);
  lastDocReference: any;
  firstDocReference: any;
  editedUtility: any = {};
  totalPrice:number = 0;
  constructor(
    private databaseService: DatabaseService,
    private dataProvider: DataProvider,
    private alertService: AlertsAndNotificationsService
  ) {}

  ngOnInit(): void {
    // Get utility utilities
    this.getInitialUtility();
    this.getMeasuringUnits();
  }

  getInitialUtility() {
    this.serialNumberAdditionalCounter = 0;
    this.databaseService
      .getSiteData()
      .then((data) => {
        if (data.exists()) {
          const siteData = data.data();
          this.utilityLength = siteData['utilityLength'];
        } else {
          this.utilityLength = 0;
        }
      })
      .finally(() => {
        this.databaseService.getFirstUtilities(10).then((docs: any) => {
          this.setCurrentViewData(docs);
          // this.allUtilities.push(...docs)
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
    this.utilities = [];
    let setFirstDoc = true;
    docs.forEach((doc: any) => {
      if (setFirstDoc) {
        this.firstDocReference = doc;
        setFirstDoc = false;
      }
      this.utilities.push({ id: doc.id, ...doc.data() });
      this.lastDocReference = doc;
    });
  }

  calculateCurrentValue() {
    const rate = parseFloat(this.utilityForm.controls['rate'].value)
    const quantity = parseFloat(this.utilityForm.controls['quantityPerItem'].value)
    const totalItems = parseFloat(this.utilityForm.controls['totalItems'].value)
    this.currentValue = ((quantity * totalItems)).toString();
    this.totalPrice = (rate * totalItems);
  }

  getNextUtilities(event: any) {
    // const lastDoc =
    this.lastPaginatorEvent = event;
    console.log(event);
    if (event.previousPageIndex < event.pageIndex) {
      console.log('Moved next');
      const lastDoc = this.lastDocReference;
      const length = event.pageSize;
      this.serialNumberAdditionalCounter = event.pageIndex * event.pageSize;
      this.databaseService
        .getNextUtilities(length, lastDoc)
        .then((docs: any) => {
          // this.allUtilities.push(...docs)
          this.setCurrentViewData(docs);
        });
    } else if (event.previousPageIndex > event.pageIndex) {
      this.serialNumberAdditionalCounter = event.pageIndex * event.pageSize;
      this.databaseService
        .getPreviousUtilities(event.pageSize, this.firstDocReference)
        .then((docs: any) => {
          // this.allUtilities.push(...docs)
          this.setCurrentViewData(docs);
        });
    } else if (
      event.previousPageIndex === event.pageIndex &&
      event.pageIndex === 0
    ) {
      this.serialNumberAdditionalCounter = event.pageIndex * event.pageSize;
      this.databaseService
        .getFirstUtilities(event.pageSize)
        .then((docs: any) => {
          this.setCurrentViewData(docs);
          // this.allUtilities.push(...docs)
        });
    }
    console.log(
      event.previousPageIndex,
      (event.pageIndex + 1) * event.pageSize
    );
  }

  changeUtility(utility: any, event: any) {
    // console.log(event);
    this.utilities.forEach((util: any) => {
      if (util.id == utility.id) {
        utility['quantity'] = event.target.value;
        this.editedUtility[utility.id] = utility;
      }
    });
  }

  changeRate(utility: any, event: any) {
    this.utilities.forEach((util: any) => {
      if (util.id == utility.id) {
        utility['rate'] = event.target.value;
        this.editedUtility[utility.id] = utility;
      }
    });
  }

  // Form Management
  submit(): void {
    this.utilityForm.value['totalQuantity'] = parseFloat(this.currentValue);
    this.utilityForm.value['totalPrice'] = this.totalPrice;
    console.log(this.utilityForm.value);
    if (this.utilityForm.valid) {
      this.dataProvider.pageSetting.blur = true;
      if (this.editMode) {
        this.databaseService
          .updateUtility(this.currentEditId, this.utilityForm.value)
          .then(() => {
            UIkit.modal(document.getElementById('utility-modal')).hide();
            // this.ngOnInit();
            if (this.lastPaginatorEvent){
              this.getNextUtilities(this.lastPaginatorEvent);
            } else {
              this.getInitialUtility();
            }
            this.dataProvider.pageSetting.blur = false;;
            this.alertService.presentToast(
              'Utility edited successfully',
              'info'
            );
          });
      } else {
        this.databaseService
          .addUtility(this.utilityForm.value)
          .then(() => {
            UIkit.modal(document.getElementById('utility-modal')).hide();
            this.utilityForm.reset();
            if (this.lastPaginatorEvent){
              this.getNextUtilities(this.lastPaginatorEvent);
            } else {
              this.getInitialUtility();
            }
            this.dataProvider.pageSetting.blur = false;;
            this.alertService.presentToast(
              'Utility added successfully',
              'info'
            );
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
  // Utility actions
  editUtility(utility: any): void {
    this.editMode = true;
    this.currentEditId = utility.id;

    // Patch values
    this.utilityForm.patchValue(utility);

    const utilityModal = document.getElementById('utility-modal');
    if (utilityModal) {
      utilityModal.addEventListener('hidden', () => {
        this.editMode = false;
        this.currentEditId = '';
        // Reset the form
        this.utilityForm.reset();
      });
      UIkit.modal(utilityModal).show();
      this.calculateCurrentValue();
    }
  }

  deleteUtility(): void {
    this.dataProvider.pageSetting.blur = true;
    this.databaseService.deleteUtility(this.currentDeleteId).then(() => {
      if (this.lastPaginatorEvent){
        this.getNextUtilities(this.lastPaginatorEvent);
      } else {
        this.getInitialUtility();
      }
      this.dataProvider.pageSetting.blur = false;;
      this.alertService.presentToast('Utility deleted successfully', 'info');
    });
  }

  async updateUtility(): Promise<void> {
    // Update only those utilities' utility whose inputs have been changed
    this.updateUtilityEnabled = false;
    for (const key in this.editedUtility) {
      if (Object.prototype.hasOwnProperty.call(this.editedUtility, key)) {
        const utility = this.editedUtility[key];
        if (utility.quantity != utility.oldQuantity) {
          try {
            await this.databaseService.updateUtility(utility.id, utility);
          } catch (error: any) {
            this.alertService.presentToast(error, 'error');
            return;
          }
        }
      }
    }
    this.alertService.presentToast('Utility updated successfully', 'info');
  }

  // Search management
  searchUtilities(): void {
    const query = this.utilitySearchInput.nativeElement.value.trim();
    if (query.length > 0) {
      const options = { keys: ['name'] };
      const fuse = new Fuse(this.utilities, options);
      const results = fuse.search(query);
      this.filteredUtilities = [];
      results.forEach((result) => {
        this.filteredUtilities.push(result.item);
      });
    } else {
      this.filteredUtilities = this.utilities;
    }
  }
}
