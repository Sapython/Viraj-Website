import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BlurSiteService } from 'src/app/services/blur-site.service';
import { DatabaseService } from 'src/app/services/database.service';
import Fuse from 'fuse.js';
import { DateService } from 'src/app/services/date.service';
import { AlertsAndNotificationsService } from 'src/app/services/uiService/alerts-and-notifications.service';
import { DataProvider } from 'src/app/providers/data.provider';
declare const UIkit: any;

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.scss', '../admin.util.scss'],
})
export class CustomersComponent implements OnInit {
  customers: any[];
  filteredCustomers: any[];
  editMode: boolean = false;
  file: File | null;
  currentEditId: any = '';
  currentDeleteId: string = '';

  customerForm: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required]),
    dob: new FormControl(''),
    gender: new FormControl(''),
    grossPurchase: new FormControl(0),
    phoneNumber: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.email]),
    address: new FormControl(''),
    job: new FormControl(''),
  });

  constructor(
    private databaseService: DatabaseService,
    private alertService: AlertsAndNotificationsService,
    private dataProvider: DataProvider,
    public dateService: DateService
  ) {}

  ngOnInit(): void {
    this.customers = [];
    this.databaseService.getCustomers().then((docs) => {
      docs.forEach((doc) => {
        this.customers.push({ id: doc.id, ...doc.data() });
      });
      this.filteredCustomers = this.customers;
      // alert(this.customers.length);
    });
  }

  ngAfterViewInit(): void {
    // Set up customer search
    const customerSearchInput = document.getElementById(
      'customer-search-input'
    ) as HTMLInputElement;
    if (customerSearchInput) {
      customerSearchInput.addEventListener(
        'input',
        () => {
          const query = customerSearchInput.value.trim();
          if (query.length > 0) {
            const options = { keys: ['name'] };
            const fuse = new Fuse(this.customers, options);
            const results = fuse.search(query);
            this.filteredCustomers = [];
            results.forEach((result: any) => {
              this.filteredCustomers.push(result.item);
            });
          } else {
            this.filteredCustomers = this.customers;
          }
        },
        false
      );
    }
  }

  validatePhoto(event: Event): void {
    const target = event.target as HTMLInputElement;
    const files = target.files;
    if (files && files.length > 0) {
      const file = files[0];
      var fileIsValid = false;
      if (!['image/png', 'image/jpeg', 'image/jpg'].includes(file.type)) {
        this.alertService.presentToast(
          'Only png, jpeg and jpg image is allowed',
          'error'
        );
      } else if (file.size >= 100_000) {
        this.alertService.presentToast(
          "The image's size must be less than 100 Kb",
          'error'
        );
      } else {
        fileIsValid = true;
        this.file = file;
      }
      if (!fileIsValid) {
        target.value = '';
      }
    }
  }

  async submit(): Promise<void> {
    if (this.customerForm.valid) {
      this.dataProvider.pageSetting.blur = true;

      // Upload image if it's selected
      if (this.file) {
        await this.databaseService
          .upload('customers/' + new Date().getTime(), this.file)
          .then((url) => {
            this.customerForm.value.image = url;
          });
      }
      
      if (this.editMode) {
        this.databaseService
          .editCustomer(this.currentEditId, this.customerForm.value)
          .then(() => {
            UIkit.modal(document.getElementById('customer-modal')).hide();
            this.ngOnInit();
            this.dataProvider.pageSetting.blur = false;;
            this.alertService.presentToast(
              'Customer edited successfully',
              'info'
            );
          });
      } else {
        this.databaseService.addCustomer(this.customerForm.value).then(() => {
          UIkit.modal(document.getElementById('customer-modal')).hide();
          this.customerForm.reset();
          (document.getElementById('photo-input') as HTMLInputElement).value = '';
          this.file = null;
          this.ngOnInit();
          this.dataProvider.pageSetting.blur = false;;
          this.alertService.presentToast('Customer added successfully', 'info');
        }).catch((error)=>{
          this.alertService.presentToast(error, 'error');
        });
      }
    } else {
      this.alertService.presentToast(
        'Please fill all the required fields.',
        'error'
      );
    }
  }

  editCustomer(customer: any): void {
    this.editMode = true;
    this.currentEditId = customer.id;

    // Patch values
    this.customerForm.patchValue(customer);

    const customerModal = document.getElementById('customer-modal');
    if (customerModal) {
      customerModal.addEventListener('hidden', () => {
        this.editMode = false;
        this.currentEditId = '';

        // Reset the form
        this.customerForm.reset();
        (document.getElementById('photo-input') as HTMLInputElement).value = '';
        this.file = null;
      });
      UIkit.modal(customerModal).show();
    }
  }

  deleteCustomer(): void {
    this.dataProvider.pageSetting.blur = true;
    this.databaseService.deleteCustomer(this.currentDeleteId).then(() => {
      this.ngOnInit();
      this.dataProvider.pageSetting.blur = false;;
      this.alertService.presentToast('Customer deleted successfully', 'info');
    });
  }
}
